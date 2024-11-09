import { Button, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCustomerRecords, changeCustomerParameter, StatusChangeCustomerRecord, insertCustomerRecord, updateCustomerRecord } from '../../redux/slice/customer.slice'
import { useNavigate } from 'react-router-dom'
import { EditFilled, PlusOutlined } from '@ant-design/icons'
import { useForm } from 'react-hook-form'
import { userRoles } from '../../utils/roles'
import { useCookies } from 'react-cookie'
import { fetchPlanRecords } from '../../redux/slice/subscription.slice'
import moment from 'moment'

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
  const Customer = useSelector((state) => state.customer)
  const Plans = useSelector((state) => state.subscription)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(['role']);

  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 5,
    total: 0,
    sort: { '_id': -1 }
  });

  useEffect(() => {
    setPagination({
      current: Customer.pageNo + 1,
      pageSize: Customer.limit,
      total: Customer.count,
      sort: { [`${Customer.sortField || "_id"}`]: Customer.sortBy }
    })
    fetchRecord({ pageNo: Customer.pageNo, limit: Customer.limit, sortBy: Customer.sortBy, sortField: Customer.sortField || "_id", keywords: Customer.keywords })
  }, [])

  useEffect(() => {
    setPagination({
      ...pagination,
      total: Customer.count
    })
  }, [Customer.count])

  function fetchRecord({ pageNo, limit, sortBy, sortField, keywords }) {
    dispatch(fetchCustomerRecords({ pageNo, limit, sortBy, sortField, keywords }));

  }

  const handleStatusChange = async (checked, id) => {
    try {
      dispatch(StatusChangeCustomerRecord({ status: checked, customer_id: id }));

      setTimeout(() => {
        fetchRecord({ pageNo: Customer.pageNo, limit: Customer.limit, sortBy: Customer.sortBy, sortField: Customer.sortField || "_id", keywords: Customer.keywords })
      }, 400);
    }
    catch (err) {
      alert(err.message)
    }
  }

  const handleCustomerSubmit = async (data, id, setOpen) => {
    try {
      if (id) {
        data.customer_id = id;
        await dispatch(updateCustomerRecord(data));
      }
      else {
        await dispatch(insertCustomerRecord(data));
      }

      setTimeout(() => {
        fetchRecord({ pageNo: Customer.pageNo, limit: Customer.limit, sortBy: Customer.sortBy, sortField: Customer.sortField || "_id", keywords: Customer.keywords })
      }, 100);
      setOpen(() => false);
    }
    catch (err) {
      alert(err.message)
    }
  }

  const onChange_table = (paginate, filter, sorter, extra) => {
    // console.log({paginate, filter, sorter, extra})
    paginate.total = Customer.count;
    paginate.sort = {};

    if (extra.action == "sort") {
      paginate.sort[`${sorter.field || "_id"}`] = sorter.order == 'ascent' ? 1 : -1;
    }
    else {
      paginate.sort = pagination.sort;
    }
    setPagination(paginate);
    console.log('paginate', paginate);
    dispatch(changeCustomerParameter({ pageNo: paginate.current - 1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0] || "_id" }))
    dispatch(fetchCustomerRecords({ pageNo: paginate.current - 1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0] || "_id", keywords: Customer.keywords }));
  }

  useEffect(() => {
    dispatch(fetchPlanRecords());
  }, [])


  const columns = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      fixed: 'left',
      width: 200,
      sorter: (a, b) => a.full_name - b.full_name
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
          <p>Expire Date: {moment(record?.plans?.plan_expire_date || new Date()).format('DD-MM-YYYY')}</p>
          <p>{moment(record?.plans?.plan_expire_date).diff(moment(new Date()), 'days', false) <= 0 ? "Plan Expired" : `Expire in ${moment(record?.plans?.plan_expire_date).diff(moment(new Date()), 'days', false)}`}</p>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // fixed: 'left',
      width: 200,
      sorter: (a, b) => a.email - b.email
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: 150,
      sorter: (a, b) => a.username - b.username
    },
    {
      title: 'Mobile',
      dataIndex: 'phone_no',
      key: 'phone_no',
      width: 150,
      sorter: (a, b) => a.phone_no - b.phone_no
    },
    {
      title: 'Org Name',
      dataIndex: 'organization_name',
      key: 'organization_name',
      width: 150,
      sorter: (a, b) => a.organization_name - b.organization_name
    },
    {
      title: 'Url',
      dataIndex: 'website_url',
      key: 'website_url',
      width: 150,
      sorter: (a, b) => a.website_url - b.website_url
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      width: 150,
      sorter: (a, b) => a.country - b.country
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
      dataIndex: 'activate',
      key: 'activate',
      fixed: 'right',
      width: 150,
      render: (e, record) => {
        var params = "";
        if (record.tenders_filter) {
          params = new URLSearchParams({ ...record.tenders_filter }).toString()
          console.log({ params });
        }
        return <Button onClick={() => navigate('/customers/activation-panel?id=' + record._id + '&' + params)}>Activate</Button>
      }
    },
  ]
    .concat(
      [userRoles.SUPER_ADMIN].includes(cookies.role) ?
        [
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            fixed: 'right',
            width: 150,
            sorter: (a, b) => a.status - b.status,
            render: (e, record) => <select className={inputClass} defaultValue={e} onChange={_e => handleStatusChange(_e.target.value, record._id)}>
              <option value={'inactive'}>Inactive</option>
              <option value={'active'}>Active</option>
              {/* <option value={'blocked'}>Blocked</option> */}
            </select>
          },
          {
            title: 'Action',
            dataIndex: 'Action',
            key: 'Action',
            width: 80,
            fixed: 'right',
            render: (e, record) => <div className="flex gap-2" key={record._id}>
              <ManagerModel key={record._id} id={record._id} submitHandler={handleCustomerSubmit} _customer={record} _plans={Plans.plan_records} />
              {/* <Button title="Delete" icon={<DeleteOutlined />} onClick={() => handleDeleteSlide(record._id)}></Button> */}
            </div>
          }
        ] : []
    );


  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-xl'>Customer</h1>
        <ManagerModel submitHandler={handleCustomerSubmit} _plans={Plans.plan_records} />
      </div>
      <Table
        loading={Customer.loading}
        pagination={{ ...pagination, pageSizeOptions: ['5', '10', '30', '50', '100'], defaultPageSize: 5, showSizeChanger: true }}
        dataSource={Customer.records}
        columns={columns}
        // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
        scroll={{ y: 430 }}
        onChange={onChange_table}
      />
    </div>
  )
}



function ManagerModel({ id, _customer, submitHandler, _plans }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const onSubmit = (body) => {
    submitHandler(body, id, setOpen)
  }

  useEffect(() => {
  }, [])

  return (
    <div className="">
      <Button className={!id ? 'float-right mb-2' : ''} title={(id ? "Edit" : "Add")} icon={id ? <EditFilled /> : <PlusOutlined />} onClick={() => setOpen(true)}>{id ? '' : 'Add'}</Button>

      <Modal centered title={(id ? "Edit" : "Add") + " Customer"} open={open} onOk={() => setOpen(false)} footer={false} onCancel={() => setOpen(false)} width={1000}>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
              <div className="form-group mb-6">
                <label className="font-bold">Full Name <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.full_name?.message}</span>
                <input type="text" className={inputClass} name="full_name" {...register("full_name", { required: 'field is required' })}
                  aria-describedby="full_name" placeholder="full name" defaultValue={_customer?.full_name || ''} />
              </div>
              <div className="form-group mb-6">
                <label className="font-bold">Mobile <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.phone_no?.message}</span>
                <input type="text" className={inputClass} name="phone_no" {...register("phone_no", { required: 'field is required' })}
                  aria-describedby="phone_no" placeholder="mobile" defaultValue={_customer?.phone_no || ''} />
              </div>
              <div className="form-group mb-6">
                <label className="font-bold">Email <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.email?.message}</span>
                <input type="text" className={inputClass} name="email" {...register("email", { required: 'field is required' })}
                  aria-describedby="email" placeholder="email" defaultValue={_customer?.email || ''} />
              </div>
              <div className="form-group mb-6">
                <label className="font-bold">Organization Name <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.organization_name?.message}</span>
                <input type="text" className={inputClass} name="organization_name" {...register("organization_name", { required: 'field is required' })}
                  aria-describedby="organization_name" placeholder="organization name" defaultValue={_customer?.organization_name || ''} />
              </div>
              <div className="form-group mb-6">
                <label className="font-bold">Website Url</label>
                <span className='text-red-600 md:ml-4'>{errors?.website_url?.message}</span>
                <input type="text" className={inputClass} name="website_url" {...register("website_url")}
                  aria-describedby="website_url" placeholder="website url" defaultValue={_customer?.website_url || ''} />
              </div>
              <div className="form-group mb-6">
                <label className="font-bold">Country</label>
                <span className='text-red-600 md:ml-4'>{errors?.country?.message}</span>
                <input type="text" className={inputClass} name="country" {...register("country")}
                  aria-describedby="country" placeholder="country" defaultValue={_customer?.country || ''} />
              </div>
              {id && <>
                <div className="form-group mb-6">
                  <label className="font-bold">Address <span className='text-red-600'>*</span></label>
                  <span className='text-red-600 md:ml-4'>{errors?.address?.message}</span>
                  <input type="text" className={inputClass} name="address" {...register("address", { required: 'field is required' })}
                    aria-describedby="address" placeholder="address" defaultValue={_customer?.address || ''} />
                </div>
                <div className="form-group mb-6">
                  <label className="font-bold">City</label>
                  <span className='text-red-600 md:ml-4'>{errors?.city?.message}</span>
                  <input type="text" className={inputClass} name="city" {...register("city")}
                    aria-describedby="city" placeholder="city" defaultValue={_customer?.city || ''} />
                </div>
                <div className="form-group mb-6">
                  <label className="font-bold">Location</label>
                  <span className='text-red-600 md:ml-4'>{errors?.location?.message}</span>
                  <input type="text" className={inputClass} name="location" {...register("location")}
                    aria-describedby="location" placeholder="location" defaultValue={_customer?.location || ''} />
                </div>
                <div className="form-group mb-6">
                  <label className="font-bold">Pincode</label>
                  <span className='text-red-600 md:ml-4'>{errors?.pincode?.message}</span>
                  <input type="text" className={inputClass} name="pincode" {...register("pincode")}
                    aria-describedby="pincode" placeholder="pincode" defaultValue={_customer?.pincode || ''} />
                </div>
                <div className="form-group mb-6">
                  <label className="font-bold">Telephone</label>
                  <span className='text-red-600 md:ml-4'>{errors?.telephone_no?.message}</span>
                  <input type="text" className={inputClass} name="telephone_no" {...register("telephone_no")}
                    aria-describedby="telephone_no" placeholder="telephone" defaultValue={_customer?.telephone_no || ''} />
                </div>
                <div className="form-group mb-6">
                  <label className="font-bold">Products Services</label>
                  <span className='text-red-600 md:ml-4'>{errors?.products_services?.message}</span>
                  <input type="text" className={inputClass} name="products_services" {...register("products_services")}
                    aria-describedby="products_services" placeholder="products services" defaultValue={_customer?.products_services || ''} />
                </div>
                <div className="form-group mb-6">
                  <label className="font-bold">Operation</label>
                  <span className='text-red-600 md:ml-4'>{errors?.operation?.message}</span>
                  <input type="text" className={inputClass} name="operation" {...register("operation")}
                    aria-describedby="operation" placeholder="operation" defaultValue={_customer?.operation || ''} />
                </div>
                <div className="form-group mb-6">
                  <label className="font-bold">Customer Type <span className='text-red-600'>*</span></label>
                  <select name='customer_type' {...register("customer_type")} className={inputClass} defaultValue="FG">
                    <option value="FG">Free Global</option>
                    <option value="FD">Free Domestic</option>
                    <option value="SG">Subscribed Global</option>
                    <option value="sD">Subscribed Domestic</option>

                  </select>

                </div>
              </>}
            </div>
            <div className="form-group mb-6">
              <h1 className='text-xl'>Plan Details</h1>
            </div>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
              <div className="form-group mb-6">
                <label className="font-bold">Plan name <span className='text-red-600'>*</span></label>
                <select name='purchase_plan_id' {...register("purchase_plan_id")} className={inputClass} defaultValue={_customer?.plans?.purchase_plan_id}>
                  <option value={"668139934ecb1ab2543a5124"}>Free</option>
                  {
                    _plans.map((ob, ke) => {
                      return (
                        <option value={ob.plan_id}>{ob.title}</option>
                      )
                    })
                  }
                </select>
                {
                  _customer?.plans?.categories
                    ?
                    <p>Selected Categories: {_customer?.plans?.categories.join(",")}</p>
                    :
                    null
                }
              </div>
              <div className="form-group mb-6">
                <label className="font-bold">Plan Expire Date <span className='text-red-600'>*</span></label>
                <input type="date" className={inputClass} name="plan_expire_date" {...register("plan_expire_date")}
                  aria-describedby="plan_expire_date" placeholder="plan_expire_date" defaultValue={moment(_customer?.plans?.plan_expire_date).format('YYYY-MM-DD') || ''} />
              </div>
              <div className="form-group mb-6">
                <label className="font-bold">Received Amount</label>
                <input type="text" className={inputClass} name="received_amount" {...register("received_amount")}
                  aria-describedby="received_amount" placeholder="Received Amount" defaultValue={_customer?.plans?.received_amount} />
              </div>
            </div>
            <div>
              <button type="submit" className="px-4 py-2 rounded shadow hover:bg-gray-200">Submit</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}