import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchSectorRecords,
    insertSectorRecord,
    updateSectorRecord,
    deleteSectorRecord,
    changeSectorParameter,
} from '../../../redux/slice/sector.slice';
import moment from 'moment';
import ImageViewer from '../../Common/ImageViewer';

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

export default function SectorMaster() {
    const Sector = useSelector((state) => state.sector);
    const dispatch = useDispatch();

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 5,
        total: 0,
        sort: { _id: -1 },
    });

    useEffect(() => {
        setPagination({
            current: Sector.pageNo + 1,
            pageSize: Sector.limit,
            total: Sector.count,
            sort: { [`${Sector.sortField || '_id'}`]: Sector.sortBy },
        });
        fetchRecord({
            pageNo: Sector.pageNo,
            limit: Sector.limit,
            sortBy: Sector.sortBy,
            sortField: Sector.sortField || '_id',
            keywords: Sector.keywords,
        });
    }, []);

    useEffect(() => {
        setPagination({
            ...pagination,
            total: Sector.count,
        });
    }, [Sector.count]);

    function fetchRecord({ pageNo, limit, sortBy, sortField, keywords }) {
        dispatch(fetchSectorRecords({ pageNo, limit, sortBy, sortField, keywords }));
    }

    const handleDeleteSlide = (id) => {
        dispatch(deleteSectorRecord({ id }));
        setTimeout(() => {
            fetchRecord({
                pageNo: Sector.pageNo,
                limit: Sector.limit,
                sortBy: Sector.sortBy,
                sortField: Sector.sortField || '_id',
                keywords: Sector.keywords,
            });
        }, 100);
    };

    const handleSectorSubmit = async (data, id, setOpen) => {
        try {
            if (id) {
                data.append('_id', id);
                await dispatch(updateSectorRecord(data));
            } else {
                await dispatch(insertSectorRecord(data));
            }

            setTimeout(() => {
                fetchRecord({
                    pageNo: Sector.pageNo,
                    limit: Sector.limit,
                    sortBy: Sector.sortBy,
                    sortField: Sector.sortField || '_id',
                    keywords: Sector.keywords,
                });
            }, 100);
            setOpen(() => false);
        } catch (err) {
            alert(err.message);
        }
    };

    const onChange_table = (paginate, filter, sorter, extra) => {
        // console.log({paginate, filter, sorter, extra})
        paginate.total = Sector.count;
        paginate.sort = {};

        console.log(paginate, 'paginate');
        console.log(extra, 'extra');
        console.log(sorter, 'sorter');

        if (extra.action == 'sort') {
            paginate.sort[`${sorter.field || '_id'}`] = sorter.order == 'ascend' ? 1 : -1;
        } else {
            paginate.sort = pagination.sort;
        }
        setPagination(paginate);
        dispatch(
            changeSectorParameter({
                pageNo: paginate.current - 1,
                limit: paginate.pageSize,
                sortBy: sorter.order == 'ascend' ? 1 : -1,
                sortField: sorter.field || '_id',
            }),
        );
        dispatch(
            fetchSectorRecords({
                pageNo: paginate.current - 1,
                limit: paginate.pageSize,
                sortBy: sorter.order == 'ascend' ? 1 : -1,
                sortField: sorter.field || '_id',
                keywords: Sector.keywords,
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
            title: 'Icon',
            dataIndex: 'icon',
            key: 'icon',
            sorter: (a, b) => a.icon - b.icon,
            render: (e, record) => <ImageViewer key={record._id} image={e}></ImageViewer>,
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
                        submitHandler={handleSectorSubmit}
                        _sector={record}
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
                <h1 className="text-xl">Sectors</h1>
                {/* <input className={`${inputClass} w-1/2`} onChange={(e) => console.log(e.target.value)} placeholder='Search' /> */}
                <ManagerModel submitHandler={handleSectorSubmit} />
            </div>
            <Table
                loading={Sector.loading}
                pagination={{
                    ...pagination,
                    pageSizeOptions: ['5', '10', '30', '50', '100'],
                    defaultPageSize: 5,
                    showSizeChanger: true,
                }}
                dataSource={Sector.records}
                columns={columns}
                // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
                scroll={{ y: 430 }}
                onChange={onChange_table}
            />
        </div>
    );
}

function ManagerModel({ id, _sector, submitHandler }) {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm();
    const [currentIcon, setCurrentIcon] = useState(_sector?.icon || null); // Store the default icon if available
    const iconFile = watch('icon'); // Watch the 'icon' field for changes

    const onSubmit = async (body) => {
        var form_data = new FormData();

        // Append all fields except 'icon' to FormData
        for (var key in body) {
            if (key !== 'icon') {
                form_data.append(key, body[key]);
            }
        }

        if (iconFile && iconFile[0]) {
            // Append new icon file if user has selected a new one
            form_data.append('image', iconFile[0]);
        } else if (currentIcon) {
            // Fetch the binary data of the default icon if no new file is uploaded
            try {
                const response = await fetch(currentIcon);
                const blob = await response.blob();
                form_data.append('image', blob, 'default_icon.png');
            } catch (error) {
                console.error('Error fetching the default icon:', error);
            }
        }

        // Logging to ensure form_data is correct
        for (let pair of form_data.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Call submitHandler with the form data
        submitHandler(form_data, id, setOpen);
        reset();
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
                title={(id ? 'Edit' : 'Add') + ' Sector'}
                open={open}
                onOk={() => setOpen(false)}
                footer={false}
                onCancel={() => setOpen(false)}
            >
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} id="sector_form">
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
                                defaultValue={_sector?.name || ''}
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
                                placeholder="title"
                                defaultValue={_sector?.title || ''}
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
                                placeholder="description"
                                defaultValue={_sector?.description || ''}
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
                                name="title"
                                {...register('project_title', {
                                    required: 'field is required',
                                })}
                                aria-describedby="description"
                                placeholder="title"
                                defaultValue={_sector?.project_title || ''}
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
                                name="description"
                                {...register('project_description', {
                                    required: 'field is required',
                                })}
                                aria-describedby="description"
                                placeholder="description"
                                defaultValue={_sector?.project_description || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Icon <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.icon?.message}
                            </span>

                            {currentIcon && (
                                <div className="mb-4">
                                    <img
                                        src={currentIcon}
                                        alt="Current Icon"
                                        className="h-16 w-16 rounded"
                                    />
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/jpeg, image/png, image/jpg"
                                className={inputClass}
                                name="icon"
                                {...register('icon', {
                                    required: !_sector?.icon
                                        ? 'field is required'
                                        : false,
                                })}
                                aria-describedby="icon"
                                placeholder="icon"
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
                                defaultValue={_sector?.code || ''}
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
