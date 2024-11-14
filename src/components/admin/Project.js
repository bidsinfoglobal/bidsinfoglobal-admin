import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Modal, Switch, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProjectRecords, insertProjectRecord, updatePorjectRecord, deleteProjectRecord, changeProjectParameter } from '../../redux/slice/project.slice'
import { fetchCPVCode } from '../../apis/master/cpvcode.api'
import { fetchSector } from '../../apis/master/sector.api'
import { fetchRegion } from '../../apis/master/region.api'
import { fetchFundingAgencies } from '../../apis/master/funding_agency'
import moment from 'moment'
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

export default function Project() {
    const Project = useSelector((state) => state.project)
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
        current: Project.pageNo+1,
        pageSize: Project.limit,
        total: Project.count,
        sort: { [`${Project.sortField}`]: Project.sortBy }
      })
        fetchRecord({pageNo: Project.pageNo, limit: Project.limit, sortBy: Project.sortBy, sortField: Project.sortField, keywords: Project.keywords})
    }, [])

    useEffect(() => {
      setPagination({
        ...pagination,
        total: Project.count
      })
    }, [Project.count])

    function fetchRecord({pageNo, limit, sortBy, sortField, keywords}) {
      dispatch(fetchProjectRecords({ pageNo, limit, sortBy, sortField, keywords }));

    }

    const handleDeleteSlide = (id) => {
        dispatch(deleteProjectRecord({ id }));
        setTimeout(() => {
          fetchRecord({pageNo: Project.pageNo, limit: Project.limit, sortBy: Project.sortBy, sortField: Project.sortField, keywords: Project.keywords})
        }, 100);
    }

    const handleProjectSubmit = async (data, id, setOpen) => {
      try {
          if(id) {
            data._id = id;
            await dispatch(updatePorjectRecord(data));
          }
          else {
            await dispatch(insertProjectRecord(data));
          }

          setTimeout(() => {
            fetchRecord({pageNo: Project.pageNo, limit: Project.limit, sortBy: Project.sortBy, sortField: Project.sortField, keywords: Project.keywords})
          }, 100);
          setOpen(() => false);
      }
      catch (err) {
          alert(err.message)
      }
    }

    const onChange_table = (paginate, filter, sorter, extra) => {
      // console.log({paginate, filter, sorter, extra})
      paginate.total = Project.count;
      paginate.sort = {};

      if(extra.action == "sort") {
        paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
      }
      else {
        paginate.sort = pagination.sort;
      }
      setPagination(paginate);
      console.log('paginate', paginate);
      dispatch(changeProjectParameter({ pageNo: paginate.current-1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0] }))
      dispatch(fetchProjectRecords({ pageNo: paginate.current-1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], keywords: Project.keywords }));
    }


    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            fixed: 'left',
            width: 170,
            height: 100,
            sorter: (a, b) => a.title - b.title
        },
        {
            title: 'Name',
            dataIndex: 'project_name',
            key: 'project_name',
            fixed: 'left',
            width: 170,
            height: 100,
            sorter: (a, b) => a.project_name - b.project_name
        },
        {
            title: 'Background',
            dataIndex: 'project_background',
            key: 'project_background',
            width: 150,
            sorter: (a, b) => a.project_background - b.project_background
          },
          {
            title: 'Location',
            dataIndex: 'project_location',
            key: 'project_location',
            width: 150,
            sorter: (a, b) => a.project_location - b.project_location
          },
          {
            title: 'Status',
            dataIndex: 'project_status',
            key: 'project_status',
            width: 150,
            sorter: (a, b) => a.project_status - b.project_status
          },
          {
            title: 'Publish Date',
            dataIndex: 'project_publishing_date',
            key: 'project_publishing_date',
            width: 150,
            sorter: (a, b) => a.project_publishing_date - b.project_publishing_date
          },
          {
            title: 'Estimate Date',
            dataIndex: 'estimated_project_completion_date',
            key: 'estimated_project_completion_date',
            width: 150,
            sorter: (a, b) => a.estimated_project_completion_date - b.estimated_project_completion_date
          },
          {
            title: 'Big Ref No',
            dataIndex: 'big_ref_no',
            key: 'big_ref_no',
            width: 150,
            sorter: (a, b) => a.big_ref_no - b.big_ref_no
          },
          {
            title: 'Client Name',
            dataIndex: 'client_name',
            key: 'client_name',
            width: 150,
            sorter: (a, b) => a.client_name - b.client_name
          },
          {
            title: 'Client Address',
            dataIndex: 'client_address',
            key: 'client_address',
            width: 150,
            sorter: (a, b) => a.client_address - b.client_address
          },
          {
            title: 'Sectors',
            dataIndex: 'sectors',
            key: 'sectors',
            width: 150,
            sorter: (a, b) => a.sectors - b.sectors
          },
          {
            title: 'CPV Code',
            dataIndex: 'cpv_codes',
            key: 'cpv_codes',
            width: 150,
            sorter: (a, b) => a.cpv_codes - b.cpv_codes
          },
          {
            title: 'Funding Agency',
            dataIndex: 'funding_agency',
            key: 'funding_agency',
            width: 150,
            sorter: (a, b) => a.funding_agency - b.funding_agency
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
          width: '150px',
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
        width: '150px',
        fixed: 'right',
        render: (e, record) => <div className="flex gap-2" key={record._id}>
            <ManagerModel key={record._id} id={record._id} submitHandler={handleProjectSubmit} _project={record} />
            <Button title="Delete" icon={<DeleteOutlined />} onClick={() => handleDeleteSlide(record._id)}></Button>
        </div>
      } : []
    );


  return (
    <div>
        <div className='flex items-center justify-between mb-4'>
            <h1 className='text-xl'>Projects</h1>
            {/* <input className={`${inputClass} w-1/2`} onChange={(e) => console.log(e.target.value)} placeholder='Search' /> */}
            <ManagerModel submitHandler={handleProjectSubmit} />
        </div>
        <Table
        loading={Project.loading}
        pagination={{ ...pagination, pageSizeOptions: ['5', '10', '30', '50', '100'], defaultPageSize: 5, showSizeChanger: true }}
        dataSource={Project.records}
        columns={columns}
        // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
        scroll={{ y: 430 }}
        onChange={onChange_table}
        />
    </div>
  )
}


function ManagerModel({ id, _project, submitHandler }) {
    const [fundingAgencies, setFundingAgencies] = useState([]);
    const [funding_timeout, setFunding_timeout] = useState(0);

    const [cpv_codes, setCpv_codes] = useState([]);
    const [cpv_timeout, setCpv_timeout] = useState(0);

    const [regions, setRegions] = useState([]);
    const [region_timeout, setRegion_timeout] = useState(0);

    const [sectors, setSectors] = useState([]);
    const [sector_timeout, setSector_timeout] = useState(0);

    const [open, setOpen] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [cookies] = useCookies(['role']);

    useEffect(() => {
      setValue('sectors', _project?.sectors)
      setValue('cpv_codes', _project?.cpv_codes)
      setValue('funding_agency', _project?.funding_agency)
      setValue('regions', _project?.regions)
    }, [])

    const onSubmit = (body) => {
      console.log(body)
        submitHandler(body, id, setOpen)
    }

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

            <Modal centered width={1000} title={(id ? "Edit" : "Add") + " Project"} open={open} onOk={() => setOpen(false)} footer={false} onCancel={() => setOpen(false)}>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
                        <div className="form-group mb-6">
                            <label className="font-bold">Title <span className='text-red-600'>*</span></label>
                            <span className='text-red-600 md:ml-4'>{errors?.title?.message}</span>
                            <input type="text" className={inputClass} name="title" {...register("title", { required: 'field is required' })}
                                aria-describedby="title" placeholder="title" defaultValue={_project?.title || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Project Name <span className='text-red-600'>*</span></label>
                            <span className='text-red-600 md:ml-4'>{errors?.project_name?.message}</span>
                            <input type="text" className={inputClass} name="project_name" {...register("project_name", { required: 'field is required' })}
                                aria-describedby="project_name" placeholder="project_name" defaultValue={_project?.project_name || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Project Background</label>
                            <span className='text-red-600 md:ml-4'>{errors?.project_background?.message}</span>
                            <input type="text" className={inputClass} name="project_background" {...register("project_background")}
                                aria-describedby="project_background" placeholder="project_background" defaultValue={_project?.project_background || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Project Location</label>
                            <span className='text-red-600 md:ml-4'>{errors?.project_location?.message}</span>
                            <input type="text" className={inputClass} name="project_location" {...register("project_location")}
                                aria-describedby="project_location" placeholder="project_location" defaultValue={_project?.project_location || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Project Status</label>
                            <span className='text-red-600 md:ml-4'>{errors?.project_status?.message}</span>
                            <input type="text" className={inputClass} name="project_status" {...register("project_status")}
                                aria-describedby="project_status" placeholder="project_status" defaultValue={_project?.project_status || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Publishing Date</label>
                            <span className='text-red-600 md:ml-4'>{errors?.project_publishing_date?.message}</span>
                            <input type="Date" className={inputClass} name="project_publishing_date" {...register("project_publishing_date")}
                                aria-describedby="project_publishing_date" placeholder="project_publishing_date" defaultValue={_project?.project_publishing_date || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Estimate Completion Date</label>
                            <span className='text-red-600 md:ml-4'>{errors?.estimated_project_completion_date?.message}</span>
                            <input type="Date" className={inputClass} name="estimated_project_completion_date" {...register("estimated_project_completion_date")}
                                aria-describedby="estimated_project_completion_date" placeholder="estimated_project_completion_date" defaultValue={_project?.estimated_project_completion_date || ''} />
                        </div>
                        </div>
                        <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
                        <div className="form-group mb-6">
                            <label className="font-bold">Big Ref Number</label>
                            <span className='text-red-600 md:ml-4'>{errors?.big_ref_no?.message}</span>
                            <input type="text" className={inputClass} name="big_ref_no" {...register("big_ref_no")} 
                                aria-describedby="big_ref_no" placeholder="big_ref_no" defaultValue={_project?.big_ref_no || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Client Name</label>
                            <span className='text-red-600 md:ml-4'>{errors?.client_name?.message}</span>
                            <input type="text" className={inputClass} name="client_name" {...register("client_name")}
                                aria-describedby="client_name" placeholder="client_name" defaultValue={_project?.client_name || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Client Address</label>
                            <span className='text-red-600 md:ml-4'>{errors?.client_address?.message}</span>
                            <input type="text" className={inputClass} name="client_address" {...register("client_address")}
                                aria-describedby="client_address" placeholder="client_address" defaultValue={_project?.client_address || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Sector</label>
                            <span className='text-red-600 md:ml-4'>{errors?.sectors?.message}</span>
                            {/* <input type="text" className={inputClass} name="sector" {...register("sector")}
                                aria-describedby="sector" placeholder="sector" defaultValue={_project?.sector || ''} /> */}
                            <AutoComplete
                                {...register("sectors")}
                                // className={inputClass}
                                className={'w-full'}
                                onSearch={handleSectorSearch}
                                placeholder="input here"
                                options={sectors}
                                defaultValue={_project?.sectors || ''}
                                onSelect={e => setValue('sectors', e)}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Region</label>
                            <span className='text-red-600 md:ml-4'>{errors?.regions?.message}</span>
                            {/* <input type="text" className={inputClass} name="regions" {...register("regions")}
                                aria-describedby="regions" placeholder="regions" defaultValue={_project?.regions || ''} /> */}
                            <AutoComplete
                                {...register("regions")}
                                // className={inputClass}
                                className={'w-full'}
                                onSearch={handleRegionSearch}
                                placeholder="input here"
                                options={regions}
                                defaultValue={_project?.regions || ''}
                                onSelect={e => setValue('regions', e)}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">CPV Code</label>
                            <span className='text-red-600 md:ml-4'>{errors?.cpv_codes?.message}</span>
                            {/* <input type="text" className={inputClass} name="cpv_codes" {...register("cpv_codes")}
                                aria-describedby="cpv_codes" placeholder="cpv_codes" defaultValue={_project?.cpv_codes || ''} /> */}
                            <AutoComplete
                                {...register("cpv_codes")}
                                // className={inputClass}
                                className={'w-full'}
                                onSearch={handleCPVSearch}
                                placeholder="input here"
                                options={cpv_codes}
                                defaultValue={_project?.cpv_codes || ''}
                                onSelect={e => setValue('cpv_codes', e)}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Funding Agency</label>
                            <span className='text-red-600 md:ml-4'>{errors?.funding_agency?.message}</span>
                            {/* <input type="text" className={inputClass} name="funding_agency" {...register("funding_agency")}
                                aria-describedby="funding_agency" placeholder="funding_agency" defaultValue={_project?.funding_agency || ''} /> */}
                            <AutoComplete
                                {...register("funding_agency")}
                                // className={inputClass}
                                className={'w-full'}
                                onSearch={handleFundingSearch}
                                placeholder="input here"
                                options={fundingAgencies}
                                defaultValue={_project?.funding_agency || ''}
                                onSelect={e => setValue('funding_agency', e)}
                              />
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