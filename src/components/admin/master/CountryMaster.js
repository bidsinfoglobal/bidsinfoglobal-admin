import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchCountryRecords,
    insertCOuntryRecord,
    updateCountryRecord,
    deleteCountryRecord,
    changeCountryParameter,
} from '../../../redux/slice/country.slice';
import moment from 'moment';

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

export default function CountryMaster() {
    const Country = useSelector((state) => state.country);
    const dispatch = useDispatch();

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 5,
        total: 0,
        sort: { _id: 1 },
    });

    useEffect(() => {
        setPagination({
            current: Country.pageNo + 1,
            pageSize: Country.limit,
            total: Country.count,
            sort: { [`${Country.sortField || '_id'}`]: Country.sortBy },
        });
        fetchRecord({
            pageNo: Country.pageNo,
            limit: Country.limit,
            sortBy: Country.sortBy,
            sortField: Country.sortField || '_id',
            keywords: Country.keywords,
        });
    }, []);

    useEffect(() => {
        setPagination({
            ...pagination,
            total: Country.count,
        });
    }, [Country.count]);

    function fetchRecord({ pageNo, limit, sortBy, sortField, keywords }) {
        dispatch(fetchCountryRecords({ pageNo, limit, sortBy, sortField, keywords }));
    }

    const handleDeleteSlide = (id) => {
        dispatch(deleteCountryRecord({ id }));
        setTimeout(() => {
            fetchRecord({
                pageNo: Country.pageNo,
                limit: Country.limit,
                sortBy: Country.sortBy,
                sortField: Country.sortField || '_id',
                keywords: Country.keywords,
            });
            // dispatch(fetchCountryRecords({ pageNo: Country.pageNo, limit: Country.limit, sortBy: Country.sortBy, sortField: Country.sortField || "_id", keywords: Country.keywords }));
        }, 100);
    };

    const handleCountrySubmit = async (data, id, setOpen) => {
        try {
            if (id) {
                data._id = id;
                await dispatch(updateCountryRecord(data));
            } else {
                await dispatch(insertCOuntryRecord(data));
            }

            setTimeout(() => {
                dispatch(
                    fetchCountryRecords({
                        pageNo: Country.pageNo,
                        limit: Country.limit,
                        sortBy: Country.sortBy,
                        sortField: Country.sortField || '_id',
                        keywords: Country.keywords,
                    }),
                );
            }, 100);
            setOpen(() => false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleStatusChange = async (checked, id) => {
        try {
            // var _slides = Country.records.map(s => {
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
        paginate.total = Country.count;
        paginate.sort = {};

        if (extra.action == 'sort') {
            paginate.sort[`${sorter.field}`] = sorter.order == 'ascend' ? 1 : -1;
        } else {
            paginate.sort = pagination.sort;
        }
        setPagination(paginate);
        console.log('paginate', paginate);
        dispatch(
            changeCountryParameter({
                pageNo: paginate.current - 1,
                limit: paginate.pageSize,
                sortBy: sorter.order == 'ascend' ? 1 : -1,
                sortField: sorter.field || '_id',
            }),
        );
        dispatch(
            fetchCountryRecords({
                pageNo: paginate.current - 1,
                limit: paginate.pageSize,
                sortBy: sorter.order == 'ascend' ? 1 : -1,
                sortField: sorter.field || '_id',
                keywords: Country.keywords,
            }),
        );
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: {
                compare: (a, b) => a.name - b.name,
                multiple: 3,
            },
            // render: (e, record) => <div key={record._id}>{e.name}</div>,
            // filters: companies,
            // onFilter: (value, record) => record.company._id == value,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a?.title - b?.title,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => a?.description - b?.description,
        },
        {
            title: 'Num Code',
            dataIndex: 'num_code',
            key: 'num_code',
            sorter: (a, b) => a.num_code - b.num_code,
        },
        {
            title: 'Str Code',
            dataIndex: 'str_code',
            key: 'str_code',
            sorter: (a, b) => a.str_code - b.str_code,
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
                        submitHandler={handleCountrySubmit}
                        _country={record}
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
                <h1 className="text-xl">Countries</h1>
                {/* <input className={`${inputClass} w-1/2`} onChange={(e) => console.log(e.target.value)} placeholder='Search' /> */}
                <ManagerModel submitHandler={handleCountrySubmit} />
            </div>
            <Table
                loading={Country.loading}
                pagination={{
                    ...pagination,
                    pageSizeOptions: ['5', '10', '30', '50', '100'],
                    defaultPageSize: 5,
                    showSizeChanger: true,
                }}
                dataSource={Country.records}
                columns={columns}
                // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
                scroll={{ y: 430 }}
                onChange={onChange_table}
            />
        </div>
    );
}

function ManagerModel({ id, _country, submitHandler }) {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm();

    const onSubmit = (body) => {
        submitHandler(body, id, setOpen);
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
                title={(id ? 'Edit' : 'Add') + ' Country'}
                open={open}
                onOk={() => setOpen(false)}
                footer={false}
                onCancel={() => setOpen(false)}
            >
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                defaultValue={_country?.name || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Title <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.title?.message}
                            </span>
                            <input
                                type="text"
                                className={inputClass}
                                name="title"
                                {...register('title', { required: 'field is required' })}
                                aria-describedby="description"
                                placeholder="title"
                                defaultValue={_country?.title || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Description <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.description?.message}
                            </span>
                            <textarea
                                type="text"
                                className={inputClass}
                                name="description"
                                {...register('description', {
                                    required: 'field is required',
                                })}
                                aria-describedby="description"
                                placeholder="description"
                                defaultValue={_country?.description || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Num Code <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.num_code?.message}
                            </span>
                            <input
                                type="text"
                                className={inputClass}
                                name="num_code"
                                {...register('num_code', {
                                    required: 'field is required',
                                })}
                                aria-describedby="num_code"
                                placeholder="num code"
                                defaultValue={_country?.num_code || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Str Code <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.str_code?.message}
                            </span>
                            <input
                                type="text"
                                className={inputClass}
                                name="str_code"
                                {...register('str_code', {
                                    required: 'field is required',
                                })}
                                aria-describedby="str_code"
                                placeholder="str code"
                                defaultValue={_country?.str_code || ''}
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
