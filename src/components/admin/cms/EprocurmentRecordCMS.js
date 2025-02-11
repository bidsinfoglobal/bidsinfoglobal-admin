import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast_popup } from '../../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Table } from 'antd';
import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import {
    fetchProcurmentRecords,
    updateProcurmentRecord,
} from '../../../redux/slice/eprocurment.slice';

var inputclass = `form-control
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

export default function EprocurmentRecordCMS() {
    const Service = useSelector((state) => state.eprocurment);
    const dispatch = useDispatch();

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 5,
        total: 0,
        sort: { title: -1, description: -1 },
    });

    useEffect(() => {
        dispatch(fetchProcurmentRecords());
    }, []);

    const handleDeleteSlide = (id) => {
        dispatch(
            updateProcurmentRecord({ _id: id, delete: true, label: 'l', icon: 'i' }),
        );
        setTimeout(() => {
            dispatch(fetchProcurmentRecords());
        }, 100);
    };

    const onChange_table = (paginate, filter, sorter, extra) => {
        paginate.total = 10;
        paginate.sort = {};

        if (extra.action == 'sort') {
            paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
        } else {
            paginate.sort = pagination.sort;
        }
        setPagination(paginate);
        console.log('paginate', paginate);
    };

    const updateHandler = (e, setOpen) => {
        try {
            dispatch(updateProcurmentRecord(e));
            setTimeout(() => {
                dispatch(fetchProcurmentRecords());
            }, 100);
            setOpen(false);
            // toast_popup('Submitted Successfully', 'success')
        } catch (err) {
            toast_popup(err?.response?.data?.message || err.message, 'error');
        }
    };

    const columns = [
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
        },
        {
            title: 'Icon',
            dataIndex: 'icon',
            key: 'icon',
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            key: 'Action',
            width: '150px',
            render: (e, record) => (
                <div className="flex gap-2" key={record._id}>
                    <EprocurmentModel
                        key={record._id}
                        id={record._id}
                        submitHandler={updateHandler}
                        _service={record}
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
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold font-bold">
                    Eprocument Record
                </h1>
                <EprocurmentModel submitHandler={updateHandler} />
            </div>
            <Table
                loading={Service.loading}
                dataSource={Service.records}
                columns={columns}
                pagination={false}
                scroll={{ y: 430 }}
                onChange={onChange_table}
            />
        </div>
    );
}

function EprocurmentModel({ id, _service, submitHandler }) {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (body) => {
        if (id) {
            body._id = id;
        }
        submitHandler(body, setOpen);
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
                title={(id ? 'Edit' : 'Add') + ' Eprocument Record'}
                open={open}
                onOk={() => setOpen(false)}
                footer={false}
                onCancel={() => setOpen(false)}
            >
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {id && <input type="hidden" name="id" value={id} />}
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Label <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.label?.message}
                            </span>
                            <input
                                type="text"
                                className={inputclass}
                                name="label"
                                {...register('label', { required: 'field is required' })}
                                aria-describedby="label"
                                placeholder="label"
                                defaultValue={_service?.label || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Icon <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.icon?.message}
                            </span>
                            <input
                                type="text"
                                className={inputclass}
                                name="icon"
                                {...register('icon', { required: 'field is required' })}
                                aria-describedby="icon"
                                placeholder="icon"
                                defaultValue={_service?.icon || ''}
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
