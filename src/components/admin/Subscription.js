import { Button, Modal, Switch, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ActivatePlanRequest, fetchSubscriptionRecords } from '../../redux/slice/subscription.slice'
import { userRoles } from '../../utils/roles'
import { EditFilled, PlusOutlined } from '@ant-design/icons'
import { useForm } from 'react-hook-form'
import { useCookies } from 'react-cookie'


export default function Subscription() {
  const Subscription = useSelector((state) => state.subscription)
  const dispatch = useDispatch();

  useEffect(() => {
    fetchRecord()
  }, [])

  function fetchRecord() {
    dispatch(fetchSubscriptionRecords());
  }

  const handleStatusChange = async (checked, id) => {
    try {
      dispatch(ActivatePlanRequest({ plan_request_id: id }));

      setTimeout(() => {
        fetchRecord();
      }, 400);
    }
    catch (err) {
      alert(err.message)
    }
  }

  const handlePlanChange = async (checked, id) => {
    try {
      dispatch(ActivatePlanRequest({ plan_request_id: id }));

      setTimeout(() => {
        fetchRecord();
      }, 400);
    }
    catch (err) {
      alert(err.message)
    }
  }

  const columns = [
    {
      title: 'Plan Details',
      dataIndex: 'plans',
      key: 'plans',
      fixed: 'left',
      width: 200,
      sorter: false,
      render: (e, record) => (
        <div>
          <p>Plan Id: {record?.planData?.plan_id}</p>
          <p>Plan Name: {record?.planData?.plan_name}</p>
          <p>Expire Date: {record?.planData?.title}</p>
          <p> {record?.categories?.length > 0 ? "Selected Category: " + record?.categories.join(", ") : null}</p>
        </div>
      )
    },
    {
      title: 'Customer Details',
      dataIndex: 'customer_details',
      key: 'customer_details',
      fixed: 'left',
      width: 200,
      sorter: false,
      render: (e, record) => (
        <div>
          <p>Customer Id: {record?.customerData?.customer_id}</p>
          <p>Name: {record?.customerData?.full_name}</p>
          <p>Email: {record?.customerData?.email}</p>
          <p>Phone: {record?.customerData?.phone_no}</p>
        </div>
      )
    },
    {
      title: 'Request Date',
      dataIndex: 'request_date',
      key: 'request_date',
      width: 150,
      sorter: (a, b) => a.request_date - b.request_date
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      sorter: (a, b) => a.status - b.status
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '100px',
      render: (e, record) => <div key={record._id}>
        {
          record.status !== "Processed"
            ?
            <Switch style={{ backgroundColor: "#000" }} key={record._id} onChange={(c) => handleStatusChange(c, record._id)} />
            :
            null
        }
      </div>
    }
  ];


  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-xl'>Subscription</h1>
      </div>
      <Table
        loading={Subscription.loading}
        dataSource={Subscription.records}
        columns={columns}
        scroll={{ y: 430 }}
        pagination={false}
      />
    </div>
  )
}