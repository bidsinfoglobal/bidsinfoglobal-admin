import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchRegionRecords,
    insertRegionRecord,
    updateRegionRecord,
    deleteRegionRecord,
    changeRegionParameter,
} from '../../../redux/slice/region.slice';
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

export default function RegionMaster() {
    const Region = useSelector((state) => state.region);
    const dispatch = useDispatch();

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 5,
        total: 0,
        sort: { _id: 1 },
    });

    useEffect(() => {
        setPagination({
            current: Region.pageNo + 1,
            pageSize: Region.limit,
            total: Region.count,
            sort: { [`${Region.sortField || '_id'}`]: Region.sortBy },
        });
        fetchRecord({
            pageNo: Region.pageNo,
            limit: Region.limit,
            sortBy: Region.sortBy,
            sortField: Region.sortField || '_id',
            keywords: Region.keywords,
        });
    }, []);

    useEffect(() => {
        setPagination({
            ...pagination,
            total: Region.count,
        });
    }, [Region.count]);

    function fetchRecord({ pageNo, limit, sortBy, sortField, keywords }) {
        dispatch(fetchRegionRecords({ pageNo, limit, sortBy, sortField, keywords }));
    }

    const handleDeleteSlide = (id) => {
        dispatch(deleteRegionRecord({ id }));
        setTimeout(() => {
            fetchRecord({
                pageNo: Region.pageNo,
                limit: Region.limit,
                sortBy: Region.sortBy,
                sortField: Region.sortField || '_id',
                keywords: Region.keywords,
            });
            // dispatch(fetchRegionRecords({ pageNo: Region.pageNo, limit: Region.limit, sortBy: Region.sortBy, sortField: Region.sortField || "_id", keywords: Region.keywords }));
        }, 100);
    };

    const handleRegionSubmit = async (data, id, setOpen) => {
        try {
            if (id) {
                data._id = id;
                await dispatch(updateRegionRecord(data));
            } else {
                await dispatch(insertRegionRecord(data));
            }

            setTimeout(() => {
                fetchRecord({
                    pageNo: Region.pageNo,
                    limit: Region.limit,
                    sortBy: Region.sortBy,
                    sortField: Region.sortField || '_id',
                    keywords: Region.keywords,
                });
            }, 100);
            setOpen(() => false);
        } catch (err) {
            alert(err.message);
        }
    };

    const onChange_table = (paginate, filter, sorter, extra) => {
        // console.log({paginate, filter, sorter, extra})
        paginate.total = Region.count;
        paginate.sort = {};

        if (extra.action == 'sort') {
            paginate.sort[`${sorter.field || '_id'}`] = sorter.order == 'ascend' ? 1 : -1;
        } else {
            paginate.sort = pagination.sort;
        }
        setPagination(paginate);
        console.log('paginate', paginate);
        dispatch(
            changeRegionParameter({
                pageNo: paginate.current - 1,
                limit: paginate.pageSize,
                sortBy: sorter.order == 'ascend' ? 1 : -1,
                sortField: sorter.field || '_id',
            }),
        );
        dispatch(
            fetchRegionRecords({
                pageNo: paginate.current - 1,
                limit: paginate.pageSize,
                sortBy: sorter.order == 'ascend' ? 1 : -1,
                sortField: sorter.field || '_id',
                keywords: Region.keywords,
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
            title: 'Tender Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a?.title - b?.title,
        },
        {
            title: 'Tender Description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => a?.description - b?.description,
        },
        {
            title: 'Project Title',
            dataIndex: 'project_title',
            key: 'project_title',
            sorter: (a, b) => a?.project_title - b?.project_title,
        },
        {
            title: 'Project Description',
            dataIndex: 'project_description',
            key: 'project_description',
            sorter: (a, b) => a?.project_description - b?.project_description,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => a.code - b.code,
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
                        submitHandler={handleRegionSubmit}
                        _region={record}
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
                <h1 className="text-xl">Regions</h1>
                {/* <input className={`${inputClass} w-1/2`} onChange={(e) => console.log(e.target.value)} placeholder='Search' /> */}
                <ManagerModel submitHandler={handleRegionSubmit} />
            </div>
            <Table
                loading={Region.loading}
                pagination={{
                    ...pagination,
                    pageSizeOptions: ['5', '10', '30', '50', '100'],
                    defaultPageSize: 5,
                    showSizeChanger: true,
                }}
                dataSource={Region.records}
                columns={columns}
                // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
                scroll={{ y: 430 }}
                onChange={onChange_table}
            />
        </div>
    );
}

function ManagerModel({ id, _region, submitHandler }) {
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
                title={(id ? 'Edit' : 'Add') + ' Region'}
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
                                defaultValue={_region?.name || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Tender Title <span className="text-red-600">*</span>
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
                                placeholder="tender title"
                                defaultValue={_region?.title || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Tender Description <span className="text-red-600">*</span>
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
                                placeholder="tender description"
                                defaultValue={_region?.description || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Project Title <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.title?.message}
                            </span>
                            <input
                                type="text"
                                className={inputClass}
                                name="project_title"
                                {...register('project_title', {
                                    required: 'field is required',
                                })}
                                aria-describedby="description"
                                placeholder="project title"
                                defaultValue={_region?.project_title || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Project Description{' '}
                                <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.description?.message}
                            </span>
                            <textarea
                                type="text"
                                className={inputClass}
                                name="project_description"
                                {...register('project_description', {
                                    required: 'field is required',
                                })}
                                aria-describedby="description"
                                placeholder="project description"
                                defaultValue={_region?.project_description || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Code <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.code?.message}
                            </span>
                            <input
                                type="text"
                                className={inputClass}
                                name="code"
                                {...register('code', { required: 'field is required' })}
                                aria-describedby="code"
                                placeholder="code"
                                defaultValue={_region?.code || ''}
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
