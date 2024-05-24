import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Modal, Switch, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGrantRecords, insertGrantRecord, updateGrantRecord, deleteGrantRecord, changeGrantParameter } from '../../redux/slice/grant.slice'
import { fetchSector } from '../../apis/master/sector.api'
import moment from 'moment/moment'
import { fetchCPVCode } from '../../apis/master/cpvcode.api'
import { fetchRegion } from '../../apis/master/region.api'
import { fetchFundingAgencies } from '../../apis/master/funding_agency'
import { userRoles } from '../../utils/roles'
import { useCookies } from 'react-cookie'

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

export default function Grant() {
    const Grant = useSelector((state) => state.grant)
    const dispatch = useDispatch()
    const [cookies] = useCookies(['role']);

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 5,
        total: 0,
        sort: { '_id': -1 }
    });

    useEffect(() => {
      setPagination({
        current: Grant.pageNo+1,
        pageSize: Grant.limit,
        total: Grant.count,
        sort: { [`${Grant.sortField}`]: Grant.sortBy }
      })
        fetchRecord({pageNo: Grant.pageNo, limit: Grant.limit, sortBy: Grant.sortBy, sortField: Grant.sortField, keywords: Grant.keywords})
    }, [])

    useEffect(() => {
      setPagination({
        ...pagination,
        total: Grant.count
      })
    }, [Grant.count])

    function fetchRecord({pageNo, limit, sortBy, sortField, keywords}) {
      dispatch(fetchGrantRecords({ pageNo, limit, sortBy, sortField, keywords }));

    }

    const handleDeleteSlide = (id) => {
        dispatch(deleteGrantRecord({ id }));
        setTimeout(() => {
          fetchRecord({pageNo: Grant.pageNo, limit: Grant.limit, sortBy: Grant.sortBy, sortField: Grant.sortField, keywords: Grant.keywords})
        }, 100);
    }

    const handleGrantSubmit = async (data, id, setOpen) => {
      try {
          if(id) {
            data._id = id;
            await dispatch(updateGrantRecord(data));
          }
          else {
            await dispatch(insertGrantRecord(data));
          }

          setTimeout(() => {
            fetchRecord({pageNo: Grant.pageNo, limit: Grant.limit, sortBy: Grant.sortBy, sortField: Grant.sortField, keywords: Grant.keywords})
          }, 100);
          setOpen(() => false);
      }
      catch (err) {
          alert(err.message)
      }
  }

    const handleStatusChange = async (checked, id) => {
        try {
            // var _slides = Grant.records.map(s => {
            //     if(s._id == id) {
            //         s.status = checked;
            //     }
            //     return s;
            // })
            // setSlides(_slides);
        }
        catch (err) {
            alert(err.message)
        }
    }

    const onChange_table = (paginate, filter, sorter, extra) => {
        // console.log({paginate, filter, sorter, extra})
        paginate.total = Grant.count;
        paginate.sort = {};
  
        if(extra.action == "sort") {
          paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
        }
        else {
          paginate.sort = pagination.sort;
        }
        setPagination(paginate);
        console.log('paginate', paginate);
        dispatch(changeGrantParameter({ pageNo: paginate.current-1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0] }))
        dispatch(fetchGrantRecords({ pageNo: paginate.current-1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], keywords: Grant.keywords }));
      }


    const columns = [
        {
            title: 'Donor',
            dataIndex: 'donor',
            key: 'donor',
            fixed: 'left',
            width: 100,
            sorter: (a, b) => a.donor - b.donor
        },
        {
            title: 'Contact Information',
            dataIndex: 'contact_information',
            key: 'contact_information',
            fixed: 'left',
            width: 150,
            sorter: (a, b) => a.contact_information - b.contact_information
        },
        {
          title: 'Location',
          dataIndex: 'location',
          key: 'location',
          width: 150,
          sorter: (a, b) => a.location - b.location
        },
        {
            title: 'Big Ref No',
            dataIndex: 'big_ref_no',
            key: 'big_ref_no',
            width: 150,
            sorter: (a, b) => a.big_ref_no - b.big_ref_no
          },
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 150,
            sorter: (a, b) => a.title - b.title
          },
          {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 150,
            sorter: (a, b) => a.type - b.type
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            sorter: (a, b) => a.status - b.status
          },
          {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            width: 150,
            sorter: (a, b) => a.value - b.value
          },
          {
            title: 'Type Of Services',
            dataIndex: 'type_of_services',
            key: 'type_of_services',
            width: 150,
            sorter: (a, b) => a.type_of_services - b.type_of_services
          },
          {
            title: 'Sectors',
            dataIndex: 'sectors',
            key: 'sectors',
            width: 150,
            sorter: (a, b) => a.sectors - b.sectors
          },
          {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            width: 150,
            sorter: (a, b) => a.deadline - b.deadline
          },
          {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            width: 150,
            sorter: (a, b) => a.duration - b.duration
          },
          {
            title: 'Attachment',
            dataIndex: 'attachment',
            key: 'attachment',
            width: 150,
            sorter: (a, b) => a.attachment - b.attachment
          },
          {
            title: 'Post Date',
            dataIndex: 'post_date',
            key: 'post_date',
            width: 150,
            render: (e) => moment(e).format('ll'),
            sorter: (a, b) => a.post_date - b.post_date
          },
          {
            title: 'Funding Agency',
            dataIndex: 'funding_agency',
            key: 'funding_agency',
            width: 150,
            sorter: (a, b) => a.funding_agency - b.funding_agency
          },
          {
            title: 'Cpv Code',
            dataIndex: 'cpv_codes',
            key: 'cpv_codes',
            width: 150,
            sorter: (a, b) => a.cpv_codes - b.cpv_codes
          },
          {
            title: 'Regions',
            dataIndex: 'regions',
            key: 'regions',
            width: 150,
            sorter: (a, b) => a.regions - b.regions
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
          fixed: 'right',
          width: 150,
          render: (e, record) => moment(e).format('lll'),
          sorter: (a, b) => a.createdAt - b.createdAt
        }
    ]
    .concat(
      [userRoles.SUPER_ADMIN, userRoles.CONTENT_DEPARTMENT].includes(cookies.role) ?
      {
        title: 'Action',
        dataIndex: 'Action',  
        key: 'Action',
        width: 150,
        fixed: 'right',
        render: (e, record) => <div className="flex gap-2" key={record._id}>
            <ManagerModel key={record._id} id={record._id} submitHandler={handleGrantSubmit} _grant={record} />
            <Button title="Delete" icon={<DeleteOutlined />} onClick={() => handleDeleteSlide(record._id)}></Button>
        </div>
      }
      : []);


  return (
    <div>
        <div className='flex items-center justify-between mb-4'>
            <h1 className='text-xl'>Grants</h1>
            {/* <input className={`${inputClass} w-1/2`} onChange={(e) => console.log(e.target.value)} placeholder='Search' /> */}
            <ManagerModel submitHandler={handleGrantSubmit} />
        </div>
        <Table
        loading={Grant.loading}
        pagination={{ ...pagination, pageSizeOptions: ['5', '10', '30', '50', '100'], defaultPageSize: 5, showSizeChanger: true }}
        dataSource={Grant.records}
        columns={columns}
        // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
        scroll={{ y: 430 }}
        onChange={onChange_table}
        />
    </div>
  )
}


function ManagerModel({ id, _grant, submitHandler }) {
    const [fundingAgencies, setFundingAgencies] = useState([]);
    const [funding_timeout, setFunding_timeout] = useState(0);

    const [regions, setRegions] = useState([]);
    const [region_timeout, setRegion_timeout] = useState(0);

    const [cpv_codes, setCpv_codes] = useState([]);
    const [cpv_timeout, setCpv_timeout] = useState(0);

    const [sectors, setSectors] = useState([]);
    const [sector_timeout, setSector_timeout] = useState(0);
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [cookies] = useCookies(['role']);

    const onSubmit = (body) => {
      submitHandler(body, id, setOpen)
    }

    useEffect(() => {
      setValue('sectors', _grant?.sectors)
      setValue('cpv_codes', _grant?.cpv_codes)
      setValue('funding_agency', _grant?.funding_agency)
      setValue('regions', _grant?.regions)
      console.log('date', _grant?.post_date)
    }, [])

    const handleSectorSearch = async (value) => {
      if(sector_timeout) clearTimeout(sector_timeout);
      if (!value || !value.trim()) {
        setValue('sectors', '');
        setSectors([])
      } else {

        var timeoutRef = setTimeout(async () => {
          var _sectors = await fetchSector({ pageNo: 0, limit: 15, sortBy: 1, sortField: 'name', keywords: value.trim() })
          
          var resp = _sectors.data;
          console.log('sector data', resp.result.result)
          if(resp.success) {
            var result = resp.result.result.map(s => ({
              label: s.name,
              value: s.name
            }))
            setSectors(() => result);
          }
          else {
            setSectors([]);
          }
        }, 800);
        setSector_timeout(timeoutRef);
      }
    };

    const handleFundingSearch = async (value) => {
      if(funding_timeout) clearTimeout(funding_timeout);
      if (!value || !value.trim()) {
        setValue('funding_agency', '');
        setFundingAgencies([])
      } else {

        var timeoutRef = setTimeout(async () => {
          var _funding = await fetchFundingAgencies({ pageNo: 0, limit: 15, sortBy: 1, sortField: 'title', keywords: value.trim() })
          
          var resp = _funding.data;
          console.log('funding agency data', resp.result.result)
          if(resp.success) {
            var result = resp.result.result.map(s => ({
              label: s.title,
              value: s.title
            }))
            setFundingAgencies(() => result);
          }
          else {
            setFundingAgencies([]);
          }
        }, 800);
        setFunding_timeout(timeoutRef);
      }
    };

    const handleRegionSearch = async (value) => {
      if(region_timeout) clearTimeout(region_timeout);
      if (!value || !value.trim()) {
        setValue('regions', '');
        setRegions([])
      } else {

        var timeoutRef = setTimeout(async () => {
          var _regions = await fetchRegion({ pageNo: 0, limit: 15, sortBy: 1, sortField: 'name', keywords: value.trim() })
          
          var resp = _regions.data;
          // console.log('regions data', resp.result.result)
          if(resp.success) {
            var result = resp.result.result.map(s => ({
              label: s.name,
              value: s.name
            }))
            setRegions(() => result);
          }
          else {
            setRegions([]);
          }
        }, 800);
        setRegion_timeout(timeoutRef);
      }
    };

    const handleCPVSearch = async (value) => {
      if(cpv_timeout) clearTimeout(cpv_timeout);
      if (!value || !value.trim()) {
        setValue('cpv_codes', '');
        setCpv_codes([])
      } else {

        var timeoutRef = setTimeout(async () => {
          var _cpvcode = await fetchCPVCode({ pageNo: 0, limit: 15, sortBy: 1, sortField: 'code', keywords: value.trim() })
          
          var resp = _cpvcode.data;
          console.log('cpv data', resp.result.result)
          if(resp.success) {
            var result = resp.result.result.map(s => ({
              label: s.code,
              value: s.code
            }))
            setCpv_codes(() => result);
          }
          else {
            setCpv_codes([]);
          }
        }, 800);
        setCpv_timeout(timeoutRef);
      }
    };

    return (
        <div className="">
            {[userRoles.SUPER_ADMIN, userRoles.CONTENT_DEPARTMENT].includes(cookies.role) &&
            <Button className={!id ? 'float-right mb-2' : ''} title={(id ? "Edit" : "Add")} icon={id ? <EditFilled /> : <PlusOutlined />} onClick={() => setOpen(true)}>{id ? '' : 'Add'}</Button>}

            <Modal centered title={(id ? "Edit" : "Add") + " Grant"} open={open} onOk={() => setOpen(false)} footer={false} onCancel={() => setOpen(false)} width={1000}>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
                          <div className="form-group mb-6">
                              <label className="font-bold">Donor <span className='text-red-600'>*</span></label>
                              <span className='text-red-600 md:ml-4'>{errors?.donor?.message}</span>
                              <input type="text" className={inputClass} name="donor" {...register("donor", { required: 'field is required' })}
                                  aria-describedby="donor" placeholder="donor" defaultValue={_grant?.donor || ''} />
                          </div>
                          <div className="form-group mb-6">
                              <label className="font-bold">Contact Information</label>
                              <span className='text-red-600 md:ml-4'>{errors?.contact_information?.message}</span>
                              <input type="text" className={inputClass} name="contact_information" {...register("contact_information")}
                                  aria-describedby="contact_information" placeholder="contact_information" defaultValue={_grant?.contact_information || ''} />
                          </div>
                          <div className="form-group mb-6">
                              <label className="font-bold">Location</label>
                              <span className='text-red-600 md:ml-4'>{errors?.location?.message}</span>
                              <input type="text" className={inputClass} name="location" {...register("location")}
                                  aria-describedby="location" placeholder="location" defaultValue={_grant?.location || ''} />
                          </div>
                          <div className="form-group mb-6">
                              <label className="font-bold">Big Ref No</label>
                              <span className='text-red-600 md:ml-4'>{errors?.big_ref_no?.message}</span>
                              <input type="text" className={inputClass} name="big_ref_no" {...register("big_ref_no")}
                                  aria-describedby="big_ref_no" placeholder="big_ref_no" defaultValue={_grant?.big_ref_no || ''} />
                          </div>
                          <div className="form-group mb-6">
                              <label className="font-bold">Title</label>
                              <span className='text-red-600 md:ml-4'>{errors?.title?.message}</span>
                              <input type="text" className={inputClass} name="title" {...register("title")}
                                  aria-describedby="title" placeholder="title" defaultValue={_grant?.title || ''} />
                          </div>
                          <div className="form-group mb-6">
                              <label className="font-bold">Type</label>
                              <span className='text-red-600 md:ml-4'>{errors?.type?.message}</span>
                              <input type="text" className={inputClass} name="type" {...register("type")}
                                  aria-describedby="type" placeholder="type" defaultValue={_grant?.type || ''} />
                          </div>
                        </div>

                        <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
                          <div className="form-group mb-6">
                              <label className="font-bold">Status</label>
                              <span className='text-red-600 md:ml-4'>{errors?.status?.message}</span>
                              <input type="text" className={inputClass} name="status" {...register("status")}
                                  aria-describedby="status" placeholder="status" defaultValue={_grant?.status || ''} />
                          </div>
                          <div className="form-group mb-6">
                              <label className="font-bold">Value</label>
                              <span className='text-red-600 md:ml-4'>{errors?.value?.message}</span>
                              <input type="text" className={inputClass} name="value" {...register("value")}
                                  aria-describedby="value" placeholder="value" defaultValue={_grant?.value || ''} />
                          </div>
                          <div className="form-group mb-6">
                              <label className="font-bold">Type Of Services</label>
                              <span className='text-red-600 md:ml-4'>{errors?.type_of_services?.message}</span>
                              <input type="text" className={inputClass} name="type_of_services" {...register("type_of_services")}
                                  aria-describedby="type_of_services" placeholder="type_of_services" defaultValue={_grant?.type_of_services || ''} />
                          </div>
                          <div className="form-group mb-6">
                              <label className="font-bold">Sector</label>
                              <span className='text-red-600 md:ml-4'>{errors?.sector?.message}</span>
                              {/* <input type="text" className={inputClass} name="sector" {...register("sector")}
                                  aria-describedby="sector" placeholder="sector" defaultValue={_grant?.sectors || ''} /> */}
                              <AutoComplete
                                {...register("sectors")}
                                // className={inputClass}
                                className='w-full'
                                onSearch={handleSectorSearch}
                                placeholder="input here"
                                options={sectors}
                                defaultValue={_grant?.sectors || ''}
                                onSelect={e => setValue('sectors', e)}
                              />
                          </div>
                          <div className="form-group mb-6">
                              <label className="font-bold">Deadline</label>
                              <span className='text-red-600 md:ml-4'>{errors?.deadline?.message}</span>
                              <input type="text" className={inputClass} name="deadline" {...register("deadline")}
                                  aria-describedby="deadline" placeholder="deadline" defaultValue={_grant?.deadline || ''} />
                          </div>
                          <div className="form-group mb-6">
                              <label className="font-bold">Duration</label>
                              <span className='text-red-600 md:ml-4'>{errors?.duration?.message}</span>
                              <input type="text" className={inputClass} name="duration" {...register("duration")}
                                  aria-describedby="duration" placeholder="duration" defaultValue={_grant?.duration || ''} />
                          </div>
                        </div>
                        <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
                        <div className="form-group mb-6">
                            <label className="font-bold">Cpv Code</label>
                            <span className='text-red-600 md:ml-4'>{errors?.cpv_codes?.message}</span>
                            {/* <input type="text" className={inputClass} name="cpv_codes" {...register("cpv_codes")}
                                aria-describedby="cpv_codes" placeholder="cpv_codes" defaultValue={_grant?.cpv_codes || ''} /> */}
                            <AutoComplete
                                {...register("cpv_codes")}
                                // className={inputClass}
                                className='w-full'
                                onSearch={handleCPVSearch}
                                placeholder="input here"
                                options={cpv_codes}
                                defaultValue={_grant?.cpv_codes || ''}
                                onSelect={e => setValue('cpv_codes', e)}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Funding Agency</label>
                            <span className='text-red-600 md:ml-4'>{errors?.funding_agency?.message}</span>
                            {/* <input type="text" className={inputClass} name="funding_agency" {...register("funding_agency")}
                                aria-describedby="funding_agency" placeholder="funding_agency" defaultValue={_grant?.funding_agency || ''} /> */}
                            <AutoComplete
                                {...register("funding_agency")}
                                // className={inputClass}
                                className={'w-full'}
                                onSearch={handleFundingSearch}
                                placeholder="input here"
                                options={fundingAgencies}
                                defaultValue={_grant?.funding_agency || ''}
                                onSelect={e => setValue('funding_agency', e)}
                              />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Region</label>
                            <span className='text-red-600 md:ml-4'>{errors?.regions?.message}</span>
                            {/* <input type="text" className={inputClass} name="regions" {...register("regions")}
                                aria-describedby="regions" placeholder="regions" defaultValue={_grant?.regions || ''} /> */}
                            <AutoComplete
                                {...register("regions")}
                                // className={inputClass}
                                className={'w-full'}
                                onSearch={handleRegionSearch}
                                placeholder="input here"
                                options={regions}
                                defaultValue={_grant?.regions || ''}
                                onSelect={e => setValue('regions', e)}
                            />
                        </div>
                        </div>
                        <div className='grid md:grid-cols-2 md:gap-3'>
                          <div className="form-group mb-6">
                              <label className="font-bold">Attachment</label>
                              <span className='text-red-600 md:ml-4'>{errors?.attachment?.message}</span>
                              <input type="text" className={inputClass} name="attachment" {...register("attachment")}
                                  aria-describedby="attachment" placeholder="attachment" defaultValue={_grant?.attachment || ''} />
                          </div>
                          <div className="form-group mb-6">
                              <label className="font-bold">Post Date</label>
                              <span className='text-red-600 md:ml-4'>{errors?.post_date?.message}</span>
                              <input type="date" className={inputClass} name="post_date" {...register("post_date")}
                                  aria-describedby="post_date" placeholder="post_date" defaultValue={moment(_grant?.post_date).format('YYYY-MM-DD') || ''} />
                          </div>
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