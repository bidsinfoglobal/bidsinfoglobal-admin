import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {
    changeCityParameter,
    deleteCityRecord,
    fetchCityRecords,
    insertCityRecord,
    updateCityRecord,
} from '../../../redux/slice/city.slice';

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

export default function CityMaster() {
    const City = useSelector((state) => state.city);
    const dispatch = useDispatch();

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 5,
        total: 0,
        sort: { _id: 1 },
    });

    useEffect(() => {
        setPagination({
            current: City.pageNo + 1,
            pageSize: City.limit,
            total: City.count,
            sort: { [`${City.sortField || '_id'}`]: City.sortBy },
        });
        fetchRecord({
            pageNo: City.pageNo,
            limit: City.limit,
            sortBy: City.sortBy,
            sortField: City.sortField || '_id',
            keywords: City.keywords,
        });
    }, []);

    useEffect(() => {
        console.log(City);
        setPagination({
            ...pagination,
            total: City.count,
        });
    }, [City.count]);

    function fetchRecord({ pageNo, limit, sortBy, sortField, keywords }) {
        dispatch(fetchCityRecords({ pageNo, limit, sortBy, sortField, keywords }));
    }

    const handleDeleteSlide = (id) => {
        dispatch(deleteCityRecord({ id }));
        setTimeout(() => {
            fetchRecord({
                pageNo: City.pageNo,
                limit: City.limit,
                sortBy: City.sortBy,
                sortField: City.sortField || '_id',
                keywords: City.keywords,
            });
            // dispatch(fetchCityRecords({ pageNo: City.pageNo, limit: City.limit, sortBy: City.sortBy, sortField: City.sortField || "_id", keywords: City.keywords }));
        }, 100);
    };

    const handleStateSubmit = async (data, id, setOpen, reset) => {
        try {
            if (id) {
                data._id = id;
                data.towns = data.towns.split(',');
                const re = await dispatch(updateCityRecord(data));
                if (!re?.error) {
                    setOpen(() => false);
                    reset();
                }
            } else {
                data.towns = data.towns.split(',');
                const re = await dispatch(insertCityRecord(data));
                if (!re?.error) {
                    setOpen(() => false);
                    reset();
                }
            }

            setTimeout(() => {
                dispatch(
                    fetchCityRecords({
                        pageNo: City.pageNo,
                        limit: City.limit,
                        sortBy: City.sortBy,
                        sortField: City.sortField || '_id',
                        keywords: City.keywords,
                    }),
                );
            }, 100);
            // setOpen(() => false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleStatusChange = async (checked, id) => {
        try {
            // var _slides = City.records.map(s => {
            //     if(s._id == id) {
            //         s.status = checked;
            //     }
            //     return s;
            // })
            // setSlides(_slides);
        } catch (err) {
            alert(err.message);
        }
    };

    const onChange_table = (paginate, filter, sorter, extra) => {
        // console.log({paginate, filter, sorter, extra})
        paginate.total = City.count;
        paginate.sort = {};

        if (extra.action == 'sort') {
            paginate.sort[`${sorter.field || '_id'}`] = sorter.order == 'ascend' ? 1 : -1;
        } else {
            paginate.sort = pagination.sort;
        }
        setPagination(paginate);
        console.log('paginate', paginate);
        dispatch(
            changeCityParameter({
                pageNo: paginate.current - 1,
                limit: paginate.pageSize,
                sortBy: sorter.order == 'ascend' ? 1 : -1,
                sortField: sorter.field || '_id',
            }),
        );
        dispatch(
            fetchCityRecords({
                pageNo: paginate.current - 1,
                limit: paginate.pageSize,
                sortBy: sorter.order == 'ascend' ? 1 : -1,
                sortField: sorter.field || '_id',
                keywords: City.keywords,
            }),
        );
    };

    const columns = [
        // {
        //     title: 'Country Name',
        //     dataIndex: 'country_name',
        //     key: 'country_name',
        //     sorter: {
        //         compare: (a, b) => a.country_name - b.country_name,
        //         multiple: 3
        //     },
        //     // render: (e, record) => <div key={record._id}>{e.name}</div>,
        //     // filters: companies,
        //     // onFilter: (value, record) => record.company._id == value,
        // },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name - b.name,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => a.code - b.code,
        },
        {
            title: 'State',
            dataIndex: 'state_name',
            key: 'state_name',
            sorter: (a, b) => a.state_name - b.state_name,
        },
        {
            title: 'Towns',
            dataIndex: 'towns',
            key: 'towns',
            render: (e, record) => e.join(','),
            sorter: (a, b) => a.towns - b.towns,
        },
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     key: 'status',
        //     width: '100px',
        //     render: (e, record) => <div key={record._id}>
        //         <Switch key={record._id} checked={record.is_active} onChange={(c) => handleStatusChange(c, record._id)} />
        //     </div>
        // },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (e, record) => moment(e).format('MMMM Do YYYY, h:mm:ss a'),
            sorter: (a, b) => a.createdAt - b.createdAt,
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            key: 'Action',
            width: '150px',
            render: (e, record) => (
                <div className="flex gap-2" key={record._id}>
                    <ManagerModel
                        key={record._id}
                        id={record._id}
                        submitHandler={handleStateSubmit}
                        _state={record}
                    />
                    <Button
                        title="Delete"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteSlide(record._id)}
                    ></Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl">Cities</h1>
                {/* <input className={`${inputClass} w-1/2`} onChange={(e) => console.log(e.target.value)} placeholder='Search' /> */}
                <ManagerModel submitHandler={handleStateSubmit} />
            </div>
            <Table
                loading={City.loading}
                pagination={{
                    ...pagination,
                    pageSizeOptions: ['5', '10', '30', '50', '100'],
                    defaultPageSize: 5,
                    showSizeChanger: true,
                }}
                dataSource={City.records}
                columns={columns}
                // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
                scroll={{ y: 430 }}
                onChange={onChange_table}
            />
        </div>
    );
}

function ManagerModel({ id, _state, submitHandler }) {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
    } = useForm();

    const onSubmit = (body) => {
        submitHandler(body, id, setOpen, reset);
    };

    return (
        <div className="">
            <Button
                className={!id ? 'float-right mb-2' : ''}
                title={id ? 'Edit' : 'Add'}
                icon={id ? <EditFilled /> : <PlusOutlined />}
                onClick={() => setOpen(true)}
            >
                {id ? '' : 'Add'}
            </Button>

            <Modal
                centered
                title={(id ? 'Edit' : 'Add') + ' State'}
                open={open}
                onOk={() => setOpen(false)}
                footer={false}
                onCancel={() => setOpen(false)}
            >
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                State Name <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.state_name?.message}
                            </span>
                            <input
                                type="text"
                                className={inputClass}
                                name="state_name"
                                {...register('state_name', {
                                    required: 'field is required',
                                })}
                                aria-describedby="state_name"
                                placeholder="state name"
                                defaultValue={_state?.state_name || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Name <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.name?.message}
                            </span>
                            <input
                                type="text"
                                className={inputClass}
                                name="name"
                                {...register('name', { required: 'field is required' })}
                                aria-describedby="name"
                                placeholder="name"
                                defaultValue={_state?.name || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Code
                                {/* <span className="text-red-600">*</span> */}
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.code?.message}
                            </span>
                            <input
                                type="number"
                                className={inputClass}
                                name="code"
                                {...register('code')}
                                aria-describedby="code"
                                placeholder="code"
                                defaultValue={_state?.code || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Towns
                                {/* <span className="text-red-600">*</span> */}
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.towns?.message}
                            </span>
                            <textarea
                                rows={4}
                                type="text"
                                className={inputClass}
                                name="towns"
                                {...register('towns')}
                                aria-describedby="towns"
                                placeholder="towns"
                                defaultValue={_state?.towns || ''}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded shadow hover:bg-gray-200"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
