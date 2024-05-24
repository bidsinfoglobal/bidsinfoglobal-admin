import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Switch, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsers } from '../../redux/slice/user.slice'

export default function Manager() {
    const User = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [slides, setSlides] = useState([...User.users]);
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 5,
        total: 0,
        sort: { 'name': -1, 'email': -1 }
    });

    useEffect(() => {
        dispatch(fetchUsers());
    }, [])

    useEffect(() => {
        setSlides(User.users)
    }, [User.users])

    const handleDeleteSlide = (id) => {
        setSlides(_slides => _slides.filter(s => s._id !== id))
    }

    const handleStatusChange = async (checked, id) => {
        try {
            var _slides = slides.map(s => {
                if(s._id == id) {
                    s.status = checked;
                }
                return s;
            })
            setSlides(_slides);
        }
        catch (err) {
            alert(err.message)
        }
    }

    const onChange_table = (paginate, filter, sorter, extra) => {
        // console.log({paginate, filter, sorter, extra})
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
        // dispatch(fetch_users_paging({ pageSize: paginate.pageSize, index: paginate.current, sort: paginate.sort }));
      }


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: {
                compare: (a, b) => a.name - b.name,
                multiple: 3
            },
            // render: (e, record) => <div key={record._id}>{e.name}</div>,
            // filters: companies,
            // onFilter: (value, record) => record.company._id == value,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email - b.email
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '100px',
            render: (e, record) => <div key={record._id}>
                <Switch key={record._id} checked={record.status} onChange={(c) => handleStatusChange(c, record._id)} />
            </div>
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            key: 'Action',
            width: '150px',
            render: (e, record) => <div className="flex gap-2" key={record._id}>
                <ManagerModel key={record._id} id={record._id} submitHandler={() => {}} _manager={record} />
                <Button title="Delete" icon={<DeleteOutlined />} onClick={() => handleDeleteSlide(record._id)}></Button>
            </div>
        }
    ];


  return (
    <div>
        <div className='flex items-center justify-between mb-4'>
            <h1 className='text-xl'>Manager</h1>
            <ManagerModel submitHandler={() => {}} />
        </div>
        <Table
        loading={User.loading}
        pagination={{ ...pagination, total: 10, pageSizeOptions: ['5', '10', '20', '30'], defaultPageSize: 5 }}
        dataSource={slides}
        columns={columns}
        // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
        scroll={{ y: 430 }}
        onChange={onChange_table}
        />
    </div>
  )
}


function ManagerModel({ id, _manager, submitHandler }) {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit } = useForm();

    const onSubmit = (body) => {
        submitHandler(body, id)
    }

    return (
        <div className="">
            <Button className={!id ? 'float-right mb-2' : ''} title={(id ? "Edit" : "Add")} icon={id ? <EditFilled /> : <PlusOutlined />} onClick={() => setOpen(true)}>{id ? '' : 'Add'}</Button>

            <Modal centered title={(id ? "Edit" : "Add") + " Manager"} open={open} onOk={() => setOpen(false)} footer={false} onCancel={() => setOpen(false)}>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-6">
                            <label className="font-bold">Name</label>
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="name" {...register("name")}
                                aria-describedby="name" placeholder="name" required defaultValue={_manager?.name || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Email</label>
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="email" {...register("email")}
                                aria-describedby="email" placeholder="email" required defaultValue={_manager?.email || ''} />
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