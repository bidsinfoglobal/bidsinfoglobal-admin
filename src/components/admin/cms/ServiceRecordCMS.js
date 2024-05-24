import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { fetchServiceRecords, updateServiceRecord } from '../../../redux/slice/service.slice'
import ImageViewer from '../../Common/ImageViewer'
import { toast_popup } from '../../../utils/toast'

export default function ServiceRecordCMS() {
    const Service = useSelector((state) => state.service)
    const dispatch = useDispatch()

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 5,
        total: 0,
        sort: { 'title': -1, 'description': -1 }
    });

    useEffect(() => {
        dispatch(fetchServiceRecords());
    }, [])

    const handleDeleteSlide = (id) => {
        dispatch(updateServiceRecord({ id, delete: true }));
        setTimeout(() => {
            dispatch(fetchServiceRecords());
        }, 100);
    }

    const onChange_table = (paginate, filter, sorter, extra) => {
        paginate.total = 10;
        paginate.sort = {};
  
        if(extra.action == "sort") {
          paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
        }
        else {
          paginate.sort = pagination.sort;
        }
        setPagination(paginate);
        console.log('paginate', paginate);
    }

    const updateHandler = (e, setOpen) => {
        try {
            e.preventDefault();
            var formdata = new FormData(e.currentTarget);
            dispatch(updateServiceRecord(formdata));
            setTimeout(() => {
                dispatch(fetchServiceRecords());
            }, 100);
            setOpen(false);
            // toast_popup('Submitted Successfully', 'success')
        }
        catch(err) {
            toast_popup(err?.response?.data?.message || err.message, 'error')
        }
    }


    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (e, record) => <ImageViewer image={e} key={e} />
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Descriptiion',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            key: 'Action',
            width: '150px',
            render: (e, record) => <div className="flex gap-2" key={record._id}>
                <ServiceModel key={record._id} id={record._id} submitHandler={updateHandler} _service={record} />
                <Button title="Delete" icon={<DeleteOutlined />} onClick={() => handleDeleteSlide(record._id)}></Button>
            </div>
        }
    ];


  return (
    <div>
        <div className='flex items-center justify-between mb-4'>
            <h1 className='text-xl md:text-2xl lg:text-3xl font-bold font-bold'>Service Record</h1>
            <ServiceModel submitHandler={updateHandler} />
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
  )
}


function ServiceModel({ id, _service, submitHandler }) {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit } = useForm();

    return (
        <div className="">
            <Button className={!id ? 'float-right mb-2' : ''} title={(id ? "Edit" : "Add")} icon={id ? <EditFilled /> : <PlusOutlined />} onClick={() => setOpen(true)}>{id ? '' : 'Add'}</Button>

            <Modal centered title={(id ? "Edit" : "Add") + " Service Record"} open={open} onOk={() => setOpen(false)} footer={false} onCancel={() => setOpen(false)}>
                <div>
                    <form onSubmit={(e) => submitHandler(e, setOpen)} encType='multipart/form-data'>
                        {id && <input type='hidden' name='id' value={id} />}
                        <div className="form-group mb-6">
                            <label className="font-bold">Title</label>
                            <input type="text" className="form-control
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="title" {...register("title")}
                                aria-describedby="title" placeholder="title" required defaultValue={_service?.title || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Description</label>
                            <textarea type="text" className="form-control
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="description" {...register("description")}
                                aria-describedby="description" placeholder="description" required >{_service?.description || ''}</textarea>
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Image</label>
                            <input type="file" className="form-control
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" accept='immage/*' name="image" {...register("image")}
                                aria-describedby="image" placeholder="image" required={!id} />
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