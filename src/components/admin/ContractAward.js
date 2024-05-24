import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Modal, Switch, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { fetchContractAwardRecords, insertContractAwardRecord, updateContractAwardRecord, deleteContractAwardRecord, changeContractAwardParameter } from '../../redux/slice/contractaward.slice'
import { fetchSector } from '../../apis/master/sector.api'
import { fetchCPVCode } from '../../apis/master/cpvcode.api'
import moment from 'moment'
import { fetchRegion } from '../../apis/master/region.api'
import { fetchFundingAgencies } from '../../apis/master/funding_agency'
import { useCookies } from 'react-cookie'
import { userRoles } from '../../utils/roles'

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

export default function ContractAward() {
    const Contract = useSelector((state) => state.contract)
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
        current: Contract.pageNo+1,
        pageSize: Contract.limit,
        total: Contract.count,
        sort: { [`${Contract.sortField}`]: Contract.sortBy }
      })
        fetchRecord({pageNo: Contract.pageNo, limit: Contract.limit, sortBy: Contract.sortBy, sortField: Contract.sortField, keywords: Contract.keywords})
    }, [])

    useEffect(() => {
      setPagination({
        ...pagination,
        total: Contract.count
      })
    }, [Contract.count])

    function fetchRecord({pageNo, limit, sortBy, sortField, keywords}) {
      dispatch(fetchContractAwardRecords({ pageNo, limit, sortBy, sortField, keywords }));

    }

    const handleDeleteSlide = (id) => {
        dispatch(deleteContractAwardRecord({ id }));
        setTimeout(() => {
          fetchRecord({pageNo: Contract.pageNo, limit: Contract.limit, sortBy: Contract.sortBy, sortField: Contract.sortField, keywords: Contract.keywords})
        }, 100);
    }

    const handleContractAwardSubmit = async (data, id, setOpen) => {
      try {
          if(id) {
            data._id = id;
            await dispatch(updateContractAwardRecord(data));
          }
          else {
            await dispatch(insertContractAwardRecord(data));
          }

          setTimeout(() => {
            fetchRecord({pageNo: Contract.pageNo, limit: Contract.limit, sortBy: Contract.sortBy, sortField: Contract.sortField, keywords: Contract.keywords})
          }, 100);
          setOpen(() => false);
      }
      catch (err) {
          alert(err.message)
      }
    }


    const onChange_table = (paginate, filter, sorter, extra) => {
        // console.log({paginate, filter, sorter, extra})
        paginate.total = Contract.count;
        paginate.sort = {};
  
        if(extra.action == "sort") {
          paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
        }
        else {
          paginate.sort = pagination.sort;
        }
        setPagination(paginate);
        console.log('paginate', paginate);
        dispatch(changeContractAwardParameter({ pageNo: paginate.current-1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0] }))
        dispatch(fetchContractAwardRecords({ pageNo: paginate.current-1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], keywords: Contract.keywords }));
      }


    const columns = [
        {
            title: 'Org Name',
            dataIndex: 'org_name',
            key: 'org_name',
            fixed: 'left',
            width: 170,
            height: 100,
            sorter: (a, b) => a.org_name - b.org_name
        },
        {
            title: 'Org Address',
            dataIndex: 'org_address',
            key: 'org_address',
            width: 150,
            sorter: (a, b) => a.org_address - b.org_address
          },
          {
            title: 'Phone',
            dataIndex: 'telephone_no',
            key: 'telephone_no',
            width: 150,
            sorter: (a, b) => a.telephone_no - b.telephone_no
          },
          {
            title: 'Fax Number',
            dataIndex: 'fax_number',
            key: 'fax_number',
            width: 150,
            sorter: (a, b) => a.fax_number - b.fax_number
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 150,
            sorter: (a, b) => a.email - b.email
          },
          {
            title: 'Contact Person',
            dataIndex: 'contact_person',
            key: 'contact_person',
            width: 150,
            sorter: (a, b) => a.contact_person - b.contact_person
          },
          {
            title: 'Big Ref No',
            dataIndex: 'big_ref_no',
            key: 'big_ref_no',
            width: 150,
            sorter: (a, b) => a.big_ref_no - b.big_ref_no
          },
          {
            title: 'Document No',
            dataIndex: 'document_no',
            key: 'document_no',
            width: 150,
            sorter: (a, b) => a.document_no - b.document_no
          },
          {
            title: 'Bidding Type',
            dataIndex: 'bidding_type',
            key: 'bidding_type',
            width: 150,
            sorter: (a, b) => a.bidding_type - b.bidding_type
          },
          {
            title: 'Project Location',
            dataIndex: 'project_location',
            key: 'project_location',
            width: 150,
            sorter: (a, b) => a.project_location - b.project_location
          },
          {
            title: 'Contractor Details',
            dataIndex: 'contractor_details',
            key: 'contractor_details',
            width: 150,
            sorter: (a, b) => a.contractor_details - b.contractor_details
          },
          {
            title: 'Tender Notice No',
            dataIndex: 'tender_notice_no',
            key: 'tender_notice_no',
            width: 150,
            sorter: (a, b) => a.tender_notice_no - b.tender_notice_no
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 150,
            sorter: (a, b) => a.description - b.description
          },
          {
            title: 'Sectors',
            dataIndex: 'sectors',
            key: 'sectors',
            width: 150,
            sorter: (a, b) => a.sectors - b.sectors
          },
          {
            title: 'Awards Publish Date',
            dataIndex: 'awards_publish_date',
            key: 'awards_publish_date',
            width: 150,
            sorter: (a, b) => a.awards_publish_date - b.awards_publish_date
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
            <ManagerModel key={record._id} id={record._id} submitHandler={handleContractAwardSubmit} _contract={record} />
            <Button title="Delete" icon={<DeleteOutlined />} onClick={() => handleDeleteSlide(record._id)}></Button>
        </div>
      }
      : []
    );


  return (
    <div>
        <div className='flex items-center justify-between mb-4'>
            <h1 className='text-xl'>Contract Awards</h1>
            {/* <input className={`${inputClass} w-1/2`} onChange={(e) => console.log(e.target.value)} placeholder='Search' /> */}
            <ManagerModel submitHandler={handleContractAwardSubmit} />
        </div>
        <Table
        loading={Contract.loading}
        pagination={{ ...pagination, pageSizeOptions: ['5', '10', '30', '50', '100'], defaultPageSize: 5, showSizeChanger: true }}
        dataSource={Contract.records}
        columns={columns}
        // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
        scroll={{ y: 430 }}
        onChange={onChange_table}
        />
    </div>
  )
}


function ManagerModel({ id, _contract, submitHandler }) {
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

    useEffect(() => {
      setValue('sectors', _contract?.sectors)
      setValue('cpv_code', _contract?.cpv_code)
      setValue('funding_agency', _contract?.funding_agency)
      setValue('regions', _contract?.regions)
    }, [])

    const onSubmit = (body) => {
      console.log(body)
        submitHandler(body, id, setOpen)
    }

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

            <Modal centered width={1000} title={(id ? "Edit" : "Add") + " Contract"} open={open} onOk={() => setOpen(false)} footer={false} onCancel={() => setOpen(false)}>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
                        <div className="form-group mb-6">
                            <label className="font-bold">Organisation Name <span className='text-red-600'>*</span></label>
                            <span className='text-red-600 md:ml-4'>{errors?.org_name?.message}</span>
                            <input type="text" className={inputClass} name="org_name" {...register("org_name", { required: 'field is required' })}
                                aria-describedby="org_name" placeholder="org_name" defaultValue={_contract?.org_name || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Organisation Address</label>
                            <span className='text-red-600 md:ml-4'>{errors?.org_address?.message}</span>
                            <input type="text" className={inputClass} name="org_address" {...register("org_address")}
                                aria-describedby="org_address" placeholder="org_address" defaultValue={_contract?.org_address || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Phone</label>
                            <span className='text-red-600 md:ml-4'>{errors?.telephone_no?.message}</span>
                            <input type="text" className={inputClass} name="telephone_no" {...register("telephone_no")}
                                aria-describedby="telephone_no" placeholder="telephone_no" defaultValue={_contract?.telephone_no || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Fax Number</label>
                            <span className='text-red-600 md:ml-4'>{errors?.fax_number?.message}</span>
                            <input type="text" className={inputClass} name="fax_number" {...register("fax_number")}
                                aria-describedby="fax_number" placeholder="fax_number" defaultValue={_contract?.fax_number || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Email</label>
                            <span className='text-red-600 md:ml-4'>{errors?.email?.message}</span>
                            <input type="text" className={inputClass} name="email" {...register("email")}
                                aria-describedby="email" placeholder="email" defaultValue={_contract?.email || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Contact Person</label>
                            <span className='text-red-600 md:ml-4'>{errors?.contact_person?.message}</span>
                            <input type="text" className={inputClass} name="contact_person" {...register("contact_person")}
                                aria-describedby="contact_person" placeholder="contact_person" defaultValue={_contract?.contact_person || ''} />
                        </div>
                        </div>
                        <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
                        <div className="form-group mb-6">
                            <label className="font-bold">Big Ref Number</label>
                            <span className='text-red-600 md:ml-4'>{errors?.big_ref_no?.message}</span>
                            <input type="text" className={inputClass} name="big_ref_no" {...register("big_ref_no")}
                                aria-describedby="big_ref_no" placeholder="big_ref_no" defaultValue={_contract?.big_ref_no || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Document Number</label>
                            <span className='text-red-600 md:ml-4'>{errors?.document_no?.message}</span>
                            <input type="text" className={inputClass} name="document_no" {...register("document_no")}
                                aria-describedby="document_no" placeholder="document_no" defaultValue={_contract?.document_no || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Bidding Type</label>
                            <span className='text-red-600 md:ml-4'>{errors?.bidding_type?.message}</span>
                            <input type="text" className={inputClass} name="bidding_type" {...register("bidding_type")}
                                aria-describedby="bidding_type" placeholder="bidding_type" defaultValue={_contract?.bidding_type || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Project Location</label>
                            <span className='text-red-600 md:ml-4'>{errors?.project_location?.message}</span>
                            <input type="text" className={inputClass} name="project_location" {...register("project_location")}
                                aria-describedby="project_location" placeholder="project_location" defaultValue={_contract?.project_location || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Contract Details</label>
                            <span className='text-red-600 md:ml-4'>{errors?.contractor_details?.message}</span>
                            <input type="text" className={inputClass} name="contractor_details" {...register("contractor_details")}
                                aria-describedby="contractor_details" placeholder="contractor_details" defaultValue={_contract?.contractor_details || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Tender Notice Number</label>
                            <span className='text-red-600 md:ml-4'>{errors?.tender_notice_no?.message}</span>
                            <input type="text" className={inputClass} name="tender_notice_no" {...register("tender_notice_no")}
                                aria-describedby="tender_notice_no" placeholder="tender_notice_no" defaultValue={_contract?.tender_notice_no || ''} />
                        </div>
                        </div>
                        <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
                        <div className="form-group mb-6">
                            <label className="font-bold">Description</label>
                            <span className='text-red-600 md:ml-4'>{errors?.description?.message}</span>
                            <input type="text" className={inputClass} name="description" {...register("description")}
                                aria-describedby="description" placeholder="description" defaultValue={_contract?.description || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Publish Date</label>
                            <span className='text-red-600 md:ml-4'>{errors?.awards_publish_date?.message}</span>
                            <input type="date" className={inputClass} name="awards_publish_date" {...register("awards_publish_date")}
                                aria-describedby="awards_publish_date" placeholder="awards_publish_date" defaultValue={moment(_contract?.awards_publish_date).format('YYYY-MM-DD') || ''} />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Cpv Code</label>
                            <span className='text-red-600 md:ml-4'>{errors?.cpv_codes?.message}</span>
                            {/* <input type="text" className={inputClass} name="cpv_codes" {...register("cpv_codes")}
                                aria-describedby="cpv_codes" placeholder="cpv_codes" defaultValue={_contract?.cpv_codes || ''} /> */}
                            <AutoComplete
                                {...register("cpv_codes")}
                                // className={inputClass}
                                className='w-full'
                                onSearch={handleCPVSearch}
                                placeholder="input here"
                                options={cpv_codes}
                                defaultValue={_contract?.cpv_codes || ''}
                                onSelect={e => setValue('cpv_codes', e)}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Sectors</label>
                            <span className='text-red-600 md:ml-4'>{errors?.sectors?.message}</span>
                            {/* <input type="text" className={inputClass} name="sectors" {...register("sectors")}
                                aria-describedby="sectors" placeholder="sectors" defaultValue={_contract?.sectors || ''} /> */}
                            <AutoComplete
                                {...register("sectors")}
                                // className={inputClass}
                                className='w-full'
                                onSearch={handleSectorSearch}
                                placeholder="input here"
                                options={sectors}
                                defaultValue={_contract?.sectors || ''}
                                onSelect={e => setValue('sectors', e)}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Funding Agency</label>
                            <span className='text-red-600 md:ml-4'>{errors?.funding_agency?.message}</span>
                            {/* <input type="text" className={inputClass} name="funding_agency" {...register("funding_agency")}
                                aria-describedby="funding_agency" placeholder="funding_agency" defaultValue={_contract?.funding_agency || ''} /> */}
                            <AutoComplete
                                {...register("funding_agency")}
                                // className={inputClass}
                                className={'w-full'}
                                onSearch={handleFundingSearch}
                                placeholder="input here"
                                options={fundingAgencies}
                                defaultValue={_contract?.funding_agency || ''}
                                onSelect={e => setValue('funding_agency', e)}
                              />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Region</label>
                            <span className='text-red-600 md:ml-4'>{errors?.regions?.message}</span>
                            {/* <input type="text" className={inputClass} name="regions" {...register("regions")}
                                aria-describedby="regions" placeholder="regions" defaultValue={_contract?.regions || ''} /> */}
                            <AutoComplete
                                {...register("regions")}
                                // className={inputClass}
                                className={'w-full'}
                                onSearch={handleRegionSearch}
                                placeholder="input here"
                                options={regions}
                                defaultValue={_contract?.regions || ''}
                                onSelect={e => setValue('regions', e)}
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