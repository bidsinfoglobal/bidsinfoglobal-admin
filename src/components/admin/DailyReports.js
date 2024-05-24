import { Button, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCustomerRecords, changeCustomerParameter, generateCustomerReport } from '../../redux/slice/customer-reports.slice'
import { useNavigate } from 'react-router-dom'
import { EditFilled, PlusOutlined } from '@ant-design/icons'
import { useForm } from 'react-hook-form'
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

export default function DailyReports() {
  const Customer = useSelector((state) => state.customer_report)
  const dispatch = useDispatch();
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
      sort: { [`${Customer.sortField}`]: Customer.sortBy }
    })
    fetchRecord({ pageNo: Customer.pageNo, limit: Customer.limit, sortBy: Customer.sortBy, sortField: Customer.sortField, keywords: Customer.keywords, from_date: Customer.from_date, to_date: Customer.to_date })
  }, [])

  useEffect(() => {
    setPagination({
      ...pagination,
      total: Customer.count
    })
  }, [Customer.count])

  function fetchRecord({ pageNo, limit, sortBy, sortField, keywords, from_date, to_date }) {
    dispatch(fetchCustomerRecords({ pageNo, limit, sortBy, sortField, keywords, type: "Daily" }));
  }


  const onChange_table = (paginate, filter, sorter, extra) => {
    // console.log({paginate, filter, sorter, extra})
    paginate.total = Customer.count;
    paginate.sort = {};

    if (extra.action == "sort") {
      paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
    }
    else {
      paginate.sort = pagination.sort;
    }
    setPagination(paginate);
    console.log('paginate', paginate);
    // dispatch(changeCustomerParameter({ pageNo: paginate.current-1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0] }))
    dispatch(fetchCustomerRecords({ pageNo: paginate.current - 1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], keywords: Customer.keywords }));
  }


  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      fixed: 'left',
      width: 200,
      sorter: (a, b) => a.type - b.type
    },
    {
      title: 'From Date',
      dataIndex: 'from_date',
      key: 'from_date',
      width: 150,
      sorter: (a, b) => a.from_date - b.from_date
    },
    {
      title: 'To Date',
      dataIndex: 'to_date',
      key: 'to_date',
      width: 150,
      sorter: (a, b) => a.to_date - b.to_date
    },
    {
      title: 'Generated At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a, b) => a.createdAt - b.createdAt
    },
    {
      title: 'Download',
      dataIndex: 'download_url',
      key: 'download_url',
      width: 150,
      sorter: (a, b) => a.download_url - b.download_url,
      render: (e, _) => <a href={e} target='_blank'>Download</a>
    },
  ];


  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-xl'>Daily Reports</h1>
      </div>
      <Table
        loading={Customer.loading}
        // pagination={{ ...pagination, pageSizeOptions: ['5', '10', '30', '50', '100'], defaultPageSize: 5, showSizeChanger: true }}
        dataSource={Customer.records}
        columns={columns}
        // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
        scroll={{ y: 430 }}
        onChange={onChange_table}
      />
    </div>
  )
}



// function ManagerModel({ id, _customer, submitHandler }) {
//   const [open, setOpen] = useState(false);
//   const { register, handleSubmit, formState: { errors }, setValue } = useForm();

//   const onSubmit = (body) => {
//     submitHandler(body, id, setOpen)
//   }

//   useEffect(() => {
//   }, [])

//   return (
//       <div className="">
//           <Button className={!id ? 'float-right mb-2' : ''} title={(id ? "Edit" : "Add")} icon={id ? <EditFilled /> : <PlusOutlined />} onClick={() => setOpen(true)}>{id ? '' : 'Add'}</Button>

//           <Modal centered title={(id ? "Edit" : "Add") + " Customer"} open={open} onOk={() => setOpen(false)} footer={false} onCancel={() => setOpen(false)} width={1000}>
//               <div>
//                   <form onSubmit={handleSubmit(onSubmit)}>
//                       <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
//                         <div className="form-group mb-6">
//                             <label className="font-bold">Full Name <span className='text-red-600'>*</span></label>
//                             <span className='text-red-600 md:ml-4'>{errors?.full_name?.message}</span>
//                             <input type="text" className={inputClass} name="full_name" {...register("full_name", { required: 'field is required' })}
//                                 aria-describedby="full_name" placeholder="full name" defaultValue={_customer?.full_name || ''} />
//                         </div>
//                         <div className="form-group mb-6">
//                             <label className="font-bold">Mobile <span className='text-red-600'>*</span></label>
//                             <span className='text-red-600 md:ml-4'>{errors?.phone_no?.message}</span>
//                             <input type="text" className={inputClass} name="phone_no" {...register("phone_no", { required: 'field is required' })}
//                                 aria-describedby="phone_no" placeholder="mobile" defaultValue={_customer?.phone_no || ''} />
//                         </div>
//                         <div className="form-group mb-6">
//                             <label className="font-bold">Email <span className='text-red-600'>*</span></label>
//                             <span className='text-red-600 md:ml-4'>{errors?.email?.message}</span>
//                             <input type="text" className={inputClass} name="email" {...register("email", { required: 'field is required' })}
//                                 aria-describedby="email" placeholder="email" defaultValue={_customer?.email || ''} />
//                           </div>
//                           <div className="form-group mb-6">
//                             <label className="font-bold">Organization Name <span className='text-red-600'>*</span></label>
//                             <span className='text-red-600 md:ml-4'>{errors?.organization_name?.message}</span>
//                             <input type="text" className={inputClass} name="organization_name" {...register("organization_name", { required: 'field is required' })}
//                                 aria-describedby="organization_name" placeholder="organization name" defaultValue={_customer?.organization_name || ''} />
//                           </div>
//                           <div className="form-group mb-6">
//                               <label className="font-bold">Website Url</label>
//                               <span className='text-red-600 md:ml-4'>{errors?.website_url?.message}</span>
//                               <input type="text" className={inputClass} name="website_url" {...register("website_url")}
//                                   aria-describedby="website_url" placeholder="website url" defaultValue={_customer?.website_url || ''} />
//                           </div>
//                           <div className="form-group mb-6">
//                               <label className="font-bold">Country</label>
//                               <span className='text-red-600 md:ml-4'>{errors?.country?.message}</span>
//                               <input type="text" className={inputClass} name="country" {...register("country")}
//                                   aria-describedby="country" placeholder="country" defaultValue={_customer?.country || ''} />
//                           </div>
//                           {id && <>
//                           <div className="form-group mb-6">
//                               <label className="font-bold">Address <span className='text-red-600'>*</span></label>
//                               <span className='text-red-600 md:ml-4'>{errors?.address?.message}</span>
//                               <input type="text" className={inputClass} name="address" {...register("address", { required: 'field is required' })}
//                                   aria-describedby="address" placeholder="address" defaultValue={_customer?.address || ''} />
//                           </div>
//                           <div className="form-group mb-6">
//                               <label className="font-bold">City</label>
//                               <span className='text-red-600 md:ml-4'>{errors?.city?.message}</span>
//                               <input type="text" className={inputClass} name="city" {...register("city")}
//                                   aria-describedby="city" placeholder="city" defaultValue={_customer?.city || ''} />
//                           </div>
//                           <div className="form-group mb-6">
//                               <label className="font-bold">Location</label>
//                               <span className='text-red-600 md:ml-4'>{errors?.location?.message}</span>
//                               <input type="text" className={inputClass} name="location" {...register("location")}
//                                   aria-describedby="location" placeholder="location" defaultValue={_customer?.location || ''} />
//                           </div>
//                           <div className="form-group mb-6">
//                               <label className="font-bold">Pincode</label>
//                               <span className='text-red-600 md:ml-4'>{errors?.pincode?.message}</span>
//                               <input type="text" className={inputClass} name="pincode" {...register("pincode")}
//                                   aria-describedby="pincode" placeholder="pincode" defaultValue={_customer?.pincode || ''} />
//                           </div>
//                           <div className="form-group mb-6">
//                               <label className="font-bold">Telephone</label>
//                               <span className='text-red-600 md:ml-4'>{errors?.telephone_no?.message}</span>
//                               <input type="text" className={inputClass} name="telephone_no" {...register("telephone_no")}
//                                   aria-describedby="telephone_no" placeholder="telephone" defaultValue={_customer?.telephone_no || ''} />
//                           </div>
//                           <div className="form-group mb-6">
//                               <label className="font-bold">Products Services</label>
//                               <span className='text-red-600 md:ml-4'>{errors?.products_services?.message}</span>
//                               <input type="text" className={inputClass} name="products_services" {...register("products_services")}
//                                   aria-describedby="products_services" placeholder="products services" defaultValue={_customer?.products_services || ''} />
//                           </div>
//                           <div className="form-group mb-6">
//                               <label className="font-bold">Operation</label>
//                               <span className='text-red-600 md:ml-4'>{errors?.operation?.message}</span>
//                               <input type="text" className={inputClass} name="operation" {...register("operation")}
//                                   aria-describedby="operation" placeholder="operation" defaultValue={_customer?.operation || ''} />
//                           </div>
//                           </>}
//                       </div>
//                       <div>
//                           <button type="submit" className="px-4 py-2 rounded shadow hover:bg-gray-200">Submit</button>
//                       </div>
//                   </form>
//               </div>
//           </Modal>
//       </div>
//   )
// }