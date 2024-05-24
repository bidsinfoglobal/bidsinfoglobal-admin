import { Button, Modal, Table, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTenderRecords, changeTenderParameter } from '../../redux/slice/tender.slice'
import { fetchSector } from '../../apis/master/sector.api'
import { fetchFundingAgencies } from '../../apis/master/funding_agency'
import { fetchRegion } from '../../apis/master/region.api'
import { fetchCPVCode } from '../../apis/master/cpvcode.api'
import { fetchCustomerRecords, changeCustomerParameter } from '../../redux/slice/customer.slice'
import { SendEmailToCustomers } from '../../apis/common.api'
import { useNavigate } from 'react-router-dom'

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

export default function ActivationPanel111() {
    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm();
    const Customer = useSelector((state) => state.customer)
    const [cpv_codes, set_cpv_codes] = useState([])
    const [sectors, set_sectors] = useState([])
    const [regions, set_regions] = useState([])
    const [funding, set_funding] = useState([])

    const Tender = useSelector((state) => state.tender)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 5,
        total: 0,
        sort: { '_id': 1 }
    });

    async function fetchCPV() {
      var res = await fetchCPVCode({
        pageNo: 0, limit: 1000, sortBy: '1', sortField: '_id', keywords: ''
      });

      res = res.data.result.result;

      set_cpv_codes(res.map(c => ({
        label: c.code+":"+c.description,
        value: c.code
      })))
    }

    async function fetchAllSectors() {
      var res = await fetchSector({
        pageNo: 0, limit: 1000, sortBy: '1', sortField: '_id', keywords: ''
      });

      res = res.data.result.result;

      set_sectors(res.map(c => ({
        label: c.name,
        value: c.name
      })))
    }

    async function fetchAllRegions() {
      var res = await fetchRegion({
        pageNo: 0, limit: 1000, sortBy: '1', sortField: '_id', keywords: ''
      });

      res = res.data.result.result;

      set_regions(res.map(c => ({
        label: c.name,
        value: c.name
      })))
    }

    async function fetchAllFundingAgency() {
      var res = await fetchFundingAgencies({
        pageNo: 0, limit: 1000, sortBy: '1', sortField: '_id', keywords: ''
      });

      res = res.data.result.result;

      console.log('funding', res);
      set_funding(res.map(c => ({
        label: c.title,
        value: c.title
      })))
    }

    useEffect(() => {
      fetchCPV();
      fetchAllSectors();
      fetchAllRegions();
      fetchAllFundingAgency();
      dispatch(changeTenderParameter({ records: [] }))
      dispatch(changeCustomerParameter({ records: [] }))
      setPagination({
        current: Tender.pageNo+1,
        pageSize: Tender.limit,
        total: Tender.count,
        sort: { [`${Tender.sortField}`]: Tender.sortBy }
      })
      
    }, [])

    useEffect(() => {
      setPagination({
        ...pagination,
        total: Tender.count
      })
    }, [Tender.count])

    function fetchRecord({pageNo, limit, sortBy, sortField, keywords, cpv_codes, sectors, regions, funding_agency}) {
      dispatch(fetchTenderRecords({ pageNo, limit, sortBy, sortField, keywords: keywords, cpv_codes, sectors, regions, funding_agency }));
    }

    const handleTenderSearch = async (body) => {
      try {
        body.cpv_codes = body.cpv_codes || ''
        console.log({
          pageNo: Tender.pageNo, limit: Tender.limit, sortBy: Tender.sortBy, sortField: Tender.sortField, keywords: Tender.keywords,
          ...body
        });
        fetchRecord({
          pageNo: Tender.pageNo, limit: 1000, sortBy: Tender.sortBy, sortField: Tender.sortField,
          ...body
        })
  
        
      } catch (error) {
        
      }
    }

    const handleTenderSubmit = async (body, setOpen) => {
      try {
          console.log(body)
          SendEmailToCustomers(body);
          setOpen(() => false);
          navigate('/customers')
      }
      catch (err) {
          alert(err.message)
      }
  }
  
  const fetchCustomers = async () => {
    dispatch(fetchCustomerRecords({ pageNo: Customer.pageNo, limit: 1000, sortBy: Customer.sortBy, sortField: Customer.sortField, keywords: null }));
  }

    const onChange_table = (paginate, filter, sorter, extra) => {
        // console.log({paginate, filter, sorter, extra})
        paginate.total = Tender.count;
        paginate.sort = {};
  
        if(extra.action == "sort") {
          paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
        }
        else {
          paginate.sort = pagination.sort;
        }
        setPagination(paginate);
        console.log('paginate', paginate);
        dispatch(changeTenderParameter({ pageNo: paginate.current-1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0] }))
        dispatch(fetchTenderRecords({ pageNo: paginate.current-1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], keywords: Tender.keywords }));
    }


    const columns = [
        {
            title: 'Authority Name',
            dataIndex: 'authority_name',
            key: 'authority_name',
            fixed: 'left',
            width: 170,
            height: 100,
            // sorter: (a, b) => a.authority_name - b.authority_name
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 150,
            // sorter: (a, b) => a.address - b.address
          },
          {
            title: 'Phone',
            dataIndex: 'telephone',
            key: 'telephone',
            width: 150,
            // sorter: (a, b) => a.telephone - b.telephone
          },
          {
            title: 'Fax Number',
            dataIndex: 'fax_number',
            key: 'fax_number',
            width: 150,
            // sorter: (a, b) => a.fax_number - b.fax_number
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 150,
            // sorter: (a, b) => a.email - b.email
          },
          {
            title: 'Contact Person',
            dataIndex: 'contact_person',
            key: 'contact_person',
            width: 150,
            // sorter: (a, b) => a.contact_person - b.contact_person
          },
          {
            title: 'Big Ref No',
            dataIndex: 'big_ref_no',
            key: 'big_ref_no',
            width: 150,
            // sorter: (a, b) => a.big_ref_no - b.big_ref_no
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 150,
            // sorter: (a, b) => a.description - b.description
          },
          {
            title: 'Tender Type',
            dataIndex: 'tender_type',
            key: 'tender_type',
            width: 150,
            // sorter: (a, b) => a.tender_type - b.tender_type
          },
          {
            title: 'Tender No',
            dataIndex: 'tender_no',
            key: 'tender_no',
            width: 150,
            // sorter: (a, b) => a.tender_no - b.tender_no
          },
          {
            title: 'Funding Agency',
            dataIndex: 'funding_agency',
            key: 'funding_agency',
            width: 150,
            // sorter: (a, b) => a.funding_agency - b.funding_agency
          },
          {
            title: 'Tender Competition',
            dataIndex: 'tender_competition',
            key: 'tender_competition',
            width: 150,
            // sorter: (a, b) => a.tender_competition - b.tender_competition
          },
          {
            title: 'Publishing Date',
            dataIndex: 'published_date',
            key: 'published_date',
            width: 150,
            // sorter: (a, b) => a.published_date - b.published_date
          },
          {
            title: 'Closing Date',
            dataIndex: 'closing_date',
            key: 'closing_date',
            width: 150,
            // sorter: (a, b) => a.closing_date - b.closing_date
          },
          {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            width: 150,
            // sorter: (a, b) => a.country - b.country
          },
          {
            title: 'Emd',
            dataIndex: 'emd',
            key: 'emd',
            width: 150,
            // sorter: (a, b) => a.emd - b.emd
          },
          {
            title: 'Estimated Cost',
            dataIndex: 'estimated_cost',
            key: 'estimated_cost',
            width: 150,
            // sorter: (a, b) => a.estimated_cost - b.estimated_cost
          },
          {
            title: 'Documents',
            dataIndex: 'documents',
            key: 'documents',
            width: 150,
            // sorter: (a, b) => a.documents - b.documents
          },
          {
            title: 'Sectors',
            dataIndex: 'sectors',
            key: 'sectors',
            width: 150,
            // sorter: (a, b) => a.sectors - b.sectors
          },
          {
            title: 'Cpv Code',
            dataIndex: 'cpv_codes',
            key: 'cpv_codes',
            width: 150,
            // sorter: (a, b) => a.cpv_codes - b.cpv_codes
          },
          {
            title: 'Regions',
            dataIndex: 'regions',
            key: 'regions',
            width: 150,
            // sorter: (a, b) => a.regions - b.regions
          },
        // {
        //   title: 'Date',
        //   dataIndex: 'createdAt',
        //   key: 'createdAt',
        //   fixed: 'right',
        //   render: (e, record) => new Date(e).toLocaleString(),
        // //   sorter: (a, b) => a.createdAt - b.createdAt
        // },
    ];


  return (
    <div>
        <div className='flex items-center justify-between mb-4'>
            <h1 className='text-xl'>Activation Panel</h1>
            {/* <input className={`${inputClass} w-1/2`} onChange={(e) => console.log(e.target.value)} placeholder='Search' /> */}
            <ManagerModel submitHandler={handleTenderSubmit} fetchCustomers={fetchCustomers} tender_ids={Tender.records.map(r => r._id)} />
        </div>
        <div className='ring-1 rounded my-2 px-4 py-2 ring-gray-100 shadow'>
            <h1 className='font-semibold text-lg'>Filter Record</h1>
            <form onSubmit={handleSubmit(handleTenderSearch)}>
                <div className='grid md:grid-cols-3 lg:grid-cols-6 md:gap-3 items-end'>
                    <div className="form-group mb-6">
                        <label className="font-bold">Search</label>
                        {/* <span className='text-red-600 md:ml-4'>{errors?.keywords?.message}</span> */}
                        <input type="text" className={inputClass} name="keywords" {...register("keywords")}
                            aria-describedby="keywords" placeholder="search" />
                    </div>
                    {/* <div className="form-group mb-6">
                        <label className="font-bold">CPV</label>
                        <input type="text" className={inputClass} name="cpv_codes" {...register("cpv_codes")}
                            aria-describedby="cpv_codes" placeholder="cpv" />
                    </div> */}
                    <Controller
                      control={control}
                      name="cpv_codes"
                      {...register("cpv_codes")}
                      render={({ field }) => (
                          <Select
                              {...field}
                              // defaultValue={''}
                              mode="multiple"
                              allowClear
                              style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                              placeholder="Please select cpv code"
                              onChange={(value) => setValue("cpv_codes", value, { shouldValidate: true })}
                              options={cpv_codes}
                          />
                      )}
                    />
                    {/* <div className="form-group mb-6">
                        <label className="font-bold">Sector</label>
                        <input type="text" className={inputClass} name="sectors" {...register("sectors")}
                            aria-describedby="sectors" placeholder="sectors" />
                    </div> */}
                    <Controller
                      control={control}
                      name="sectors"
                      {...register("sectors")}
                      render={({ field }) => (
                          <Select
                              {...field}
                              mode="multiple"
                              allowClear
                              style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                              placeholder="Please select sectors"
                              onChange={(value) => setValue("sectors", value, { shouldValidate: true })}
                              options={sectors}
                          />
                      )}
                    />

                    {/* <div className="form-group mb-6">
                        <label className="font-bold">Region</label>
                        <input type="text" className={inputClass} name="regions" {...register("regions")}
                            aria-describedby="regions" placeholder="regions" />
                    </div> */}
                    <Controller
                      control={control}
                      name="regions"
                      {...register("regions")}
                      render={({ field }) => (
                          <Select
                              {...field}
                              mode="multiple"
                              allowClear
                              style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                              placeholder="Please select regions"
                              onChange={(value) => setValue("regions", value, { shouldValidate: true })}
                              options={regions}
                          />
                      )}
                    />

                    {/* <div className="form-group mb-6">
                        <label className="font-bold">Funding Agency</label>
                        <input type="text" className={inputClass} name="funding_agency" {...register("funding_agency")}
                            aria-describedby="funding_agency" placeholder="funding agency" />
                    </div> */}
                    <Controller
                      control={control}
                      name="funding_agency"
                      {...register("funding_agency")}
                      render={({ field }) => (
                          <Select
                              {...field}
                              mode="multiple"
                              allowClear
                              style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                              placeholder="Please select funding_agency"
                              onChange={(value) => setValue("funding_agency", value, { shouldValidate: true })}
                              options={funding}
                          />
                      )}
                    />

                    <div className="form-group mb-6">
                        <input
                        type="submit"
                        className={`${inputClass} hover:ring-1 focus:ring-1 hover:text-blue-400 focus:text-blue-400 cursor-pointer`}
                        value={'Submit'}
                        />
                    </div>
                </div>
            </form>
        </div>
        <Table
        loading={Tender.loading}
        pagination={{ pageSizeOptions: ['10', '30', '50', '100'], defaultPageSize:100, showSizeChanger: true, ...pagination }}
        dataSource={Tender.records}
        columns={columns}
        // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
        scroll={{ y: 430 }}
        onChange={onChange_table}
        />
    </div>
  )
}


function ManagerModel({ tender_ids, submitHandler, fetchCustomers }) {
    const Customer = useSelector((state) => state.customer)
    const [open, setOpen] = useState(false);
    const [Cust, setCust] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    useEffect(() => {
        setCust(Customer.records);
    }, [Customer.records])

    const onSubmit = async () => {

        if(selectedRowKeys.length === 0)
            return alert('please select customer');
        
        await submitHandler({
            tenders_id: tender_ids,
            customer_id: Customer.records.map(c => c._id)
        }, setOpen);

        setSelectedRowKeys([]);

    }

    const onSearch = (val) => {
        if(!val) return setCust(Customer.records);
        var _c = Customer.records.filter(c => c.full_name.match(val) || c.email.match(val));
        setCust(_c);
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_INVERT,
          Table.SELECTION_NONE,
          {
            key: 'odd',
            text: 'Select Odd Row',
            onSelect: (changeableRowKeys) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                if (index % 2 !== 0) {
                  return false;
                }
                return true;
              });
              setSelectedRowKeys(newSelectedRowKeys);
            },
          },
          {
            key: 'even',
            text: 'Select Even Row',
            onSelect: (changeableRowKeys) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                if (index % 2 !== 0) {
                  return true;
                }
                return false;
              });
              setSelectedRowKeys(newSelectedRowKeys);
            },
          },
        ],
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
    ]
    return (
        <div className="">
            {
                tender_ids && Array.isArray(tender_ids) && tender_ids.length > 0 &&
                <Button title={"Activate"} danger onClick={async () => {await fetchCustomers(); setOpen(true)}}>Activate</Button>
            }

            <Modal centered width={1000} title={"Customer List"} open={open} onOk={() => setOpen(false)} footer={false} onCancel={() => setOpen(false)}>
                <div>
                    <div className='flex itmes-center justify-between gap-3 my-3'>
                        <input className={`${inputClass} md:w-1/3`} placeholder='Search' onChange={e => onSearch(e.target.value)} />
                        <Button onClick={onSubmit}>Activate User</Button>
                    </div>
                    <Table
                        rowSelection={rowSelection}
                        pagination={false}
                        dataSource={Cust || []}
                        columns={columns}
                        scroll={{ y: 430 }}
                    />
                </div>
            </Modal>
        </div>
    )
}