import { DeleteOutlined, EditFilled, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Switch, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsers } from '../../../redux/slice/user.slice'
import { useNavigate } from 'react-router-dom'

export default function Users() {
    const User = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                {/* <ManagerModel key={record._id} id={record._id} submitHandler={() => {}} _manager={record} /> */}
                <Button title="Edit" icon={<EditOutlined />} onClick={() => navigate('/users/add?id=' + record._id)}></Button>
                <Button title="Delete" icon={<DeleteOutlined />} onClick={() => handleDeleteSlide(record._id)}></Button>
            </div>
        }
    ];


  return (
    <div>
        <div className='flex items-center justify-between mb-4'>
            <h1 className='text-xl'>Users Manager</h1>
            {/* <ManagerModel submitHandler={() => {}} /> */}
            <Button title="Add" icon={<PlusOutlined />} onClick={() => navigate('/users/add')}>Add</Button>
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
