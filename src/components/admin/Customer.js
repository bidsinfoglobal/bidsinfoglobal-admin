import { Button, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchCustomerRecords,
    changeCustomerParameter,
    StatusChangeCustomerRecord,
    insertCustomerRecord,
    updateCustomerRecord,
} from '../../redux/slice/customer.slice';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { userRoles } from '../../utils/roles';
import { useCookies } from 'react-cookie';
import { fetchPlanRecords } from '../../redux/slice/subscription.slice';
import moment from 'moment';
import DebouncedSearch from '../Common/DebouncedSearch';

const inputClass = `form-control
block
w-full
px-3
py-1.5
text-base
font-normal
text-gray-700
bg-white bg-clip-padding
border border-solid border-gray-300
rounded
transition
ease-in-out
m-0
focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none`;

export default function Customer() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cookies] = useCookies(['role']);

    const { records, loading, pagination } = useSelector((state) => state.customer);
    const Plans = useSelector((state) => state.subscription);

    useEffect(() => {
        dispatch(fetchPlanRecords());
        dispatch(fetchCustomerRecords(pagination));
    }, []);

    const handleStatusChange = async (status, id) => {
        try {
            await dispatch(StatusChangeCustomerRecord({ status, customer_id: id }));
            dispatch(fetchCustomerRecords(pagination));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCustomerSubmit = async (data, id, setOpen) => {
        try {
            id
                ? await dispatch(updateCustomerRecord({ ...data, customer_id: id }))
                : await dispatch(insertCustomerRecord(data));
            dispatch(fetchCustomerRecords(pagination));
            setOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const onChangeTable = (paginate, filters, sorter, extra) => {
        const updatedSortField = sorter.field || '_id';
        const updatedSortBy = sorter.order === 'ascend' ? 1 : -1;

        const updatedPagination = {
            pageNo: paginate.current - 1,
            limit: paginate.pageSize,
            sortBy: updatedSortBy,
            sortField: updatedSortField,
            keywords: pagination.keywords,
        };

        dispatch(changeCustomerParameter(updatedPagination));
        dispatch(fetchCustomerRecords(updatedPagination));
    };

    const handleSearch = (keywords) => {
        const updatedPagination = { ...pagination, pageNo: 0, keywords };
        dispatch(changeCustomerParameter(updatedPagination));
        dispatch(fetchCustomerRecords(updatedPagination));
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'full_name',
            key: 'full_name',
            width: 200,
            fixed: 'left',
            sorter: true,
        },
        {
            title: 'Plan',
            dataIndex: 'plans',
            key: 'plans',
            width: 350,
            sorter: false,
            render: (e, record) => (
                <div>
                    <p>Plan Name: {record?.plans?.plan_name}</p>
                    <p>Customer Type: {record?.customer_type}</p>
                    <p>
                        Expire Date:{' '}
                        {moment(record?.plans?.plan_expire_date || new Date()).format(
                            'DD-MM-YYYY',
                        )}
                    </p>
                    <p>
                        {moment(record?.plans?.plan_expire_date).diff(moment(), 'days') <=
                        0
                            ? 'Plan Expired'
                            : `Expires in ${moment(record?.plans?.plan_expire_date).diff(
                                  moment(),
                                  'days',
                              )} days`}
                    </p>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            sorter: true,
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 150,
            sorter: true,
        },
        {
            title: 'Mobile',
            dataIndex: 'phone_no',
            key: 'phone_no',
            width: 150,
            sorter: true,
        },
        {
            title: 'Organization',
            dataIndex: 'organization_name',
            key: 'organization_name',
            width: 150,
            sorter: true,
        },
        {
            title: 'Website',
            dataIndex: 'website_url',
            key: 'website_url',
            width: 150,
            sorter: true,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            width: 150,
            sorter: true,
        },
        // {
        //   title: 'Last LoggedIn',
        //   dataIndex: 'last_logged_in',
        //   key: 'last_logged_in',
        //   width: 150,
        //   sorter: (a, b) => a.last_logged_in - b.last_logged_in
        // },
        {
            title: 'Activate',
            key: 'activate',
            fixed: 'right',
            width: 150,
            render: (_, record) => {
                const params = record.tenders_filter
                    ? new URLSearchParams(record.tenders_filter).toString()
                    : '';
                return (
                    <Button
                        onClick={() =>
                            navigate(
                                `/customers/activation-panel?id=${record._id}&${params}`,
                            )
                        }
                    >
                        Activate
                    </Button>
                );
            },
        },
        ...([userRoles.SUPER_ADMIN].includes(cookies.role)
            ? [
                  {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      fixed: 'right',
                      width: 150,
                      sorter: true,
                      render: (e, record) => (
                          <select
                              className={inputClass}
                              defaultValue={e}
                              onChange={(_e) =>
                                  handleStatusChange(_e.target.value, record._id)
                              }
                          >
                              <option value={'inactive'}>Inactive</option>
                              <option value={'active'}>Active</option>
                          </select>
                      ),
                  },
                  {
                      title: 'Action',
                      dataIndex: 'Action',
                      key: 'Action',
                      width: 80,
                      fixed: 'right',
                      render: (e, record) => (
                          <div className="flex gap-2" key={record._id}>
                              <ManagerModel
                                  key={record._id}
                                  id={record._id}
                                  submitHandler={handleCustomerSubmit}
                                  _customer={record}
                                  _plans={Plans.plan_records}
                              />
                              {/* <Button
                                  title="Delete"
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteSlide(record._id)}
                              ></Button> */}
                          </div>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl">Customer</h1>
                <div className="flex gap-2 ml-auto ">
                    <DebouncedSearch
                        onSearch={handleSearch}
                        placeholder="Search Customers..."
                    />
                    <ManagerModel
                        submitHandler={handleCustomerSubmit}
                        _plans={Plans.plan_records}
                    />
                </div>
            </div>
            <Table
                loading={loading}
                pagination={{
                    current: pagination.pageNo + 1,
                    pageSize: pagination.limit,
                    total: pagination.count,
                    pageSizeOptions: ['15', '30', '50', '100', '200'],
                    showSizeChanger: true,
                }}
                dataSource={records}
                columns={columns}
                scroll={{ y: '65vh' }}
                onChange={onChangeTable}
                rowKey="_id"
            />
        </div>
    );
}

function ManagerModel({ id, _customer = {}, submitHandler, _plans = [] }) {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => submitHandler(data, id, setOpen);

    const formFields = [
        { name: 'full_name', label: 'Full Name', required: true },
        { name: 'phone_no', label: 'Mobile', required: true },
        { name: 'email', label: 'Email', required: true },
        { name: 'organization_name', label: 'Organization Name', required: true },
        { name: 'website_url', label: 'Website Url' },
        { name: 'country', label: 'Country' },
    ];

    const additionalFields = id
        ? [
              { name: 'address', label: 'Address', required: true },
              { name: 'city', label: 'City' },
              { name: 'location', label: 'Location' },
              { name: 'pincode', label: 'Pincode' },
              { name: 'telephone_no', label: 'Telephone' },
              { name: 'products_services', label: 'Products Services' },
              { name: 'operation', label: 'Operation' },
              {
                  name: 'customer_type',
                  label: 'Customer Type',
                  type: 'select',
                  options: [
                      { value: 'FG', label: 'Free Global' },
                      { value: 'FD', label: 'Free Domestic' },
                      { value: 'SG', label: 'Subscribed Global' },
                      { value: 'SD', label: 'Subscribed Domestic' },
                  ],
              },
          ]
        : [];

    return (
        <div>
            <Button
                className={!id ? 'float-right' : ''}
                title={id ? 'Edit' : 'Add'}
                icon={id ? <EditFilled /> : <PlusOutlined />}
                onClick={() => setOpen(true)}
            >
                {id ? '' : 'Add'}
            </Button>

            <Modal
                centered
                title={`${id ? 'Edit' : 'Add'} Customer`}
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={1000}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-3">
                        {[...formFields, ...additionalFields].map(
                            ({ name, label, required, type, options }) => (
                                <div key={name} className="form-group mb-6">
                                    <label className="font-bold">
                                        {label}{' '}
                                        {required && (
                                            <span className="text-red-600">*</span>
                                        )}
                                    </label>
                                    {errors[name] && (
                                        <span className="text-red-600 md:ml-4">
                                            {errors[name].message}
                                        </span>
                                    )}
                                    {type === 'select' ? (
                                        <select
                                            {...register(name, {
                                                required: required && 'Field is required',
                                            })}
                                            className={inputClass}
                                        >
                                            {options.map(({ value, label }) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            className={inputClass}
                                            {...register(name, {
                                                required: required && 'Field is required',
                                            })}
                                            defaultValue={_customer[name] || ''}
                                        />
                                    )}
                                </div>
                            ),
                        )}
                    </div>

                    {/* Plan Details Section */}
                    <h1 className="text-xl">Plan Details</h1>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-3">
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Plan Name <span className="text-red-600">*</span>
                            </label>
                            <select
                                {...register('purchase_plan_id')}
                                className={inputClass}
                                defaultValue={
                                    _customer?.plans?.purchase_plan_id || 'free_plan'
                                }
                            >
                                <option value="free_plan">Free</option>
                                {_plans.map(({ plan_id, title }) => (
                                    <option key={plan_id} value={plan_id}>
                                        {title}
                                    </option>
                                ))}
                            </select>
                            {_customer?.plans?.categories && (
                                <p>
                                    Selected Categories:{' '}
                                    {_customer.plans.categories.join(', ')}
                                </p>
                            )}
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Plan Expire Date <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="date"
                                className={inputClass}
                                {...register('plan_expire_date')}
                                defaultValue={
                                    moment(_customer?.plans?.plan_expire_date).format(
                                        'YYYY-MM-DD',
                                    ) || ''
                                }
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Received Amount</label>
                            <input
                                type="text"
                                className={inputClass}
                                {...register('received_amount')}
                                defaultValue={_customer?.plans?.received_amount || ''}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 rounded shadow hover:bg-gray-200"
                    >
                        Submit
                    </button>
                </form>
            </Modal>
        </div>
    );
}
