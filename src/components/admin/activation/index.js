import { Button, Modal, Table, Select, DatePicker } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTenderRecords, changeTenderParameter } from '../../../redux/slice/tender.slice'
import { fetchSector } from '../../../apis/master/sector.api'
import { fetchFundingAgencies } from '../../../apis/master/funding_agency'
import { fetchRegion } from '../../../apis/master/region.api'
import { fetchCPVCode } from '../../../apis/master/cpvcode.api'
import { fetchCustomerRecords, changeCustomerParameter } from '../../../redux/slice/customer.slice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AssignTendersToCustomer, getCustomerDetail } from '../../../apis/common.api'
import { AutoComplete } from 'antd'
import { fetchCountries } from '../../../apis/master/country.api'
import moment from 'moment'
import { changeProjectParameter, fetchProjectRecords } from '../../../redux/slice/project.slice'
import { changeGrantParameter, fetchGrantRecords } from '../../../redux/slice/grant.slice'
import { changeContractAwardParameter, fetchContractAwardRecords } from '../../../redux/slice/contractaward.slice'


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
const { RangePicker } = DatePicker;

export default function ActivationPanel({ props }) {
  const { register, handleSubmit, formState: { errors }, setValue, getValues, control, watch } = useForm({ defaultValues: { data_type: "tender" } });
  const Customer = useSelector((state) => state.customer)
  const [cpv_codes, set_cpv_codes] = useState([])
  const [sectors, set_sectors] = useState([])
  const [regions, set_regions] = useState([])
  const [funding, set_funding] = useState([])
  const [query, setQuery] = useState();

  const watchField = watch()

  const Tender = useSelector((state) => state.tender)
  const Grant = useSelector((state) => state.grant)
  const Contract = useSelector((state) => state.contract)
  const Project = useSelector((state) => state.project)

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerid = searchParams.get('id');
  const _search_type = searchParams.get('search_type') || '';
  const _from_date = searchParams.get('from_date') || '';
  const _to_date = searchParams.get('to_date') || '';
  const _keyword = searchParams.get('keywords') || '';
  const _sectors = searchParams.get('sectors') ? searchParams.get('sectors').split(',') : [];
  const _cpv_codes = searchParams.get('cpv_codes') ? searchParams.get('cpv_codes').split(',') : [];
  const _regions = searchParams.get('regions') ? searchParams.get('regions').split(',') : [];
  const _country = searchParams.get('country') ? searchParams.get('country').split(',') : [];
  const _funding_agency = searchParams.get('funding_agency') ? searchParams.get('funding_agency').split(',') : [];
  const [filter_timeout, set_filter_timeout] = useState(0);
  const [countries, set_countries] = useState([]);
  const [country_timeout, setCountry_timeout] = useState(0);


  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 5,
    total: 0,
    sort: { '_id': -1 }
  });

  async function fetchCPV(keywords = '', isSearch = false) {
    var res = await fetchCPVCode({
      pageNo: 0, limit: 100, sortBy: '1', sortField: '_id', keywords
    });

    res = res.data.result.result;

    set_cpv_codes(res.map(c => ({
      label: c.code + ':' + c.description,
      value: c.code
    })))
    if (!isSearch) {
      setValue("cpv_codes", _cpv_codes, { shouldValidate: true })
    }
  }

  async function fetchAllSectors(keywords = '', isSearch = false) {
    var res = await fetchSector({
      pageNo: 0, limit: 100, sortBy: '1', sortField: '_id', keywords
    });

    res = res.data.result.result;

    set_sectors(res.map(c => ({
      label: c.name,
      value: c.name
    })))
    if (!isSearch) {
      setValue("sectors", _sectors, { shouldValidate: true })
    }
  }
  const handleCountrySearch = async (value) => {
    if (country_timeout) clearTimeout(country_timeout);
    if (!value || !value.trim()) {
      setValue('country', '');
      // setCountries([])
    } else {

      var timeoutRef = setTimeout(async () => {
        var _countries = await fetchCountries({ pageNo: 0, limit: 15, sortBy: 1, sortField: 'name', keywords: value.trim() })

        var resp = _countries.data;
        console.log('country data', resp.result.result)
        if (resp.success) {
          var result = resp.result.result.map(s => ({
            label: s.name,
            value: s.name
          }))
          // setCountries(() => result);
        }
        else {
          // setCountries([]);
        }
      }, 800);
      setCountry_timeout(timeoutRef);
    }
  };

  async function fetchAllCountries(keywords = '', isSearch = false) {
    var res = await fetchCountries({
      pageNo: 0, limit: 300, sortBy: '1', sortField: 'name', keywords
    });

    res = res.data.result.result;

    set_countries(res.map(c => ({
      label: c.name,
      value: c.name
    })))

    if (!isSearch) {
      setValue("country", _country, { shouldValidate: true })
    }
  }
  async function fetchAllRegions(keywords = '', isSearch = false) {
    var res = await fetchRegion({
      pageNo: 0, limit: 100, sortBy: '1', sortField: '_id', keywords
    });

    res = res.data.result.result;

    set_regions(res.map(c => ({
      label: c.name,
      value: c.name
    })))

    if (!isSearch) {
      setValue("regions", _regions, { shouldValidate: true })
    }
  }

  async function fetchAllFundingAgency(keywords = '', isSearch = false) {
    var res = await fetchFundingAgencies({
      pageNo: 0, limit: 100, sortBy: '1', sortField: '_id', keywords
    });

    res = res.data.result.result;

    set_funding(res.map(c => ({
      label: c.title,
      value: c.title
    })))

    if (!isSearch) {
      setValue("funding_agency", _funding_agency, { shouldValidate: true })
    }

    // setValue("funding_agency", keywords || _funding_agency, { shouldValidate: true })
  }

  useEffect(() => {
    if (!customerid)
      return navigate('/customers');
    dispatch(changeTenderParameter({ records: [] }))
    dispatch(changeCustomerParameter({ records: [] }))
    setPagination({
      current: Tender.pageNo + 1,
      pageSize: Tender.limit,
      total: Tender.count,
      sort: { [`${Tender.sortField}`]: Tender.sortBy }
    })

    setValue('search_type', _search_type || 'Any Word');
    setValue('from_date', '');
    setValue('to_date', '');

    fetchCPV();
    fetchAllSectors();
    fetchAllRegions();
    fetchAllCountries();
    fetchAllFundingAgency();


    if (_keyword || _sectors.length || _cpv_codes.length || _regions.length || _funding_agency.length) {
      setTimeout(() => {
        handleTenderSearch({
          search_type: _search_type,
          from_date: _from_date,
          to_date: _to_date,
          keywords: _keyword,
          sectors: _sectors,
          cpv_codes: _cpv_codes,
          regions: _regions,
          funding_agency: _funding_agency
        })
      }, 100);
    }

  }, [])

  useEffect(() => {
    if (watchField.data_type === "tender") {

      setQuery(Tender?.query)
      setPagination({
        ...pagination,
        total: Tender.count
      })
    }
  }, [Tender.count, watchField?.data_type])

  useEffect(() => {
    if (watchField.data_type === "projects") {
      console.log(Project)
      setQuery(Project?.query)

      setPagination({
        ...pagination,
        total: Project.count
      })
    }
  }, [Project.count, watchField?.data_type])

  useEffect(() => {
    if (watchField.data_type === "grants") {
      setQuery(Grant?.query)

      setPagination({
        ...pagination,
        total: Grant.count
      })
    }
  }, [Grant.count, watchField?.data_type])

  useEffect(() => {
    if (watchField.data_type === "contract_awards") {
      setQuery(Contract?.query)

      setPagination({
        ...pagination,
        total: Contract.count
      })
    }
  }, [Contract.count, watchField?.data_type])

  function fetchRecord({ pageNo,exclude_words, data_type, limit, sortBy, sortField, keywords, cpv_codes, sectors, regions, country, funding_agency, search_type, from_date, to_date }) {
    console.log(data_type)
    if (data_type === "tender") {

      dispatch(fetchTenderRecords({ pageNo, exclude_words,limit, sortBy, sortField, keywords: keywords, country, cpv_codes, sectors, regions, funding_agency, search_type, from_date, to_date }));
    }
    else if (data_type === "projects") {
      dispatch(fetchProjectRecords({ pageNo, exclude_words,limit, sortBy, sortField, keywords: keywords, country, cpv_codes, sectors, regions, funding_agency, search_type, from_date, to_date }));

    }
    else if (data_type === "grants") {
      dispatch(fetchGrantRecords({ pageNo,exclude_words ,limit, sortBy, sortField, keywords: keywords, country, cpv_codes, sectors, regions, funding_agency, search_type, from_date, to_date }));

    }
    else if (data_type === "contract_awards") {
      dispatch(fetchContractAwardRecords({ pageNo, exclude_words,limit, sortBy, sortField, keywords: keywords, country, cpv_codes, sectors, regions, funding_agency, search_type, from_date, to_date }));

    }
  }

  const getFormValues = () => {
    let values = getValues();
    values.sectors = values.sectors ? values.sectors.join(",") : "";
    values.cpv_codes = values.cpv_codes ? values.cpv_codes.join(",") : "";
    values.regions = values.regions ? values.regions.join(",") : "";
    values.funding_agency = values.funding_agency ? values.funding_agency.join(",") : "";
    return values;
  }

  const handleTenderSearch = async (body) => {
    try {

      body.sectors = body.sectors ? body.sectors.join(",") : "";
      // body.data_type = body.data_type ? body.data_type : "";
      body.cpv_codes = body.cpv_codes ? body.cpv_codes.join(",") : "";
      body.regions = body.regions ? body.regions.join(",") : "";
      body.funding_agency = body.funding_agency ? body.funding_agency.join(",") : "";
      body.country = body.country ? body.country.join(",") : "";
      fetchRecord({
        pageNo: Tender.pageNo, limit: Tender.limit, sortBy: Tender.sortBy, sortField: Tender.sortField,
        ...body
      })


    } catch (error) {

    }
  }

  const handleTenderSubmit = async () => {
    try {
      let body = {
        data_id: Tender.records.map(r => r._id),
        customer_id: customerid,
        filter: getValues()
      }

      AssignTendersToCustomer(body);
      navigate('/customers');
    }
    catch (err) {
      alert(err.message)
    }
  }

  // const fetchCustomers = async () => {
  //   dispatch(fetchCustomerRecords({ pageNo: Customer.pageNo, limit: 100, sortBy: Customer.sortBy, sortField: Customer.sortField, keywords: null }));
  // }

  const onChange_table = (paginate, filter, sorter, extra) => {
    // console.log({paginate, filter, sorter, extra})
    if (watchField.data_type === "tender") {
      paginate.total = Tender.count;
      paginate.sort = {};

      if (extra.action == "sort") {
        paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
      }
      else {
        paginate.sort = pagination.sort;
      }
      setPagination(paginate);
      console.log('paginate', paginate);
      dispatch(changeTenderParameter({ pageNo: paginate.current - 1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], ...getFormValues() }))
      dispatch(fetchTenderRecords({ pageNo: paginate.current - 1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], keywords: Tender.keywords, ...getFormValues() }));
    }
    if (watchField.data_type === "projects") {
      paginate.total = Project.count;
      paginate.sort = {};

      if (extra.action == "sort") {
        paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
      }
      else {
        paginate.sort = pagination.sort;
      }
      setPagination(paginate);
      console.log('paginate', paginate);
      dispatch(changeProjectParameter({ pageNo: paginate.current - 1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], ...getFormValues() }))
      dispatch(fetchProjectRecords({ pageNo: paginate.current - 1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], keywords: Project.keywords, ...getFormValues() }));
    }
    if (watchField.data_type === "grants") {
      paginate.total = Grant.count;
      paginate.sort = {};

      if (extra.action == "sort") {
        paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
      }
      else {
        paginate.sort = pagination.sort;
      }
      setPagination(paginate);
      console.log('paginate', paginate);
      dispatch(changeGrantParameter({ pageNo: paginate.current - 1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], ...getFormValues() }))
      dispatch(fetchGrantRecords({ pageNo: paginate.current - 1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], keywords: Grant.keywords, ...getFormValues() }));
    }
    if (watchField.data_type === "contract_awards") {
      paginate.total = Contract.count;
      paginate.sort = {};

      if (extra.action == "sort") {
        paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
      }
      else {
        paginate.sort = pagination.sort;
      }
      setPagination(paginate);
      console.log('paginate', paginate);
      dispatch(changeContractAwardParameter({ pageNo: paginate.current - 1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], ...getFormValues() }))
      dispatch(fetchContractAwardRecords({ pageNo: paginate.current - 1, limit: paginate.pageSize, sortBy: paginate.sort[Object.keys(paginate.sort)[0]], sortField: Object.keys(paginate.sort)[0], keywords: Contract.keywords, ...getFormValues() }));
    }
  }

  function OnChangeFilter(name, value) {
    // alert(name + ', ' + value)
    // setValue(name, value, { shouldValidate: true });
    if (filter_timeout) clearTimeout(filter_timeout);

    var timeoutRef = setTimeout(async () => {
      if (name === 'cpv_codes') {
        fetchCPV(value, true);
      }
      else if (name === 'sectors') {
        fetchAllSectors(value, true);
      }
      else if (name === 'regions') {
        fetchAllRegions(value, true)
      }
      else if (name === 'country') {
        fetchAllCountries(value, true)
      }
      else if (name === 'funding_agency') {
        fetchAllFundingAgency(value, true)
      }
    }, 800);
    set_filter_timeout(timeoutRef);
  }


  function OnResetFilter(name) {
    if (name === 'cpv_codes') {
      fetchCPV('', true);
    }
    else if (name === 'sectors') {
      fetchAllSectors('', true);
    }
    else if (name === 'regions') {
      fetchAllRegions('', true)
    }
    else if (name === 'country') {
      fetchAllCountries('', true)
    }
    else if (name === 'funding_agency') {
      fetchAllFundingAgency('', true)
    }
  }

  function handleDateRange(range) {
    console.log(range)
    if (Array.isArray(range) && range[0] && range[1]) {
      const [from, to] = [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')];
      setValue('from_date', from);
      setValue('to_date', to);
    }
    else {
      setValue('from_date', '');
      setValue('to_date', '');
    }
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
    //   dataIndex: '_id',
    //   key: '_id',
    //   fixed: 'right',
    //   render: (e, record) => new Date(e).toLocaleString(),
    // //   sorter: (a, b) => a._id - b._id
    // },
  ];
  const [filterData, setFilterData] = useState();

  const setFilter = (filterData) => {
    const fieldsToSet = ["country", "cpv_codes", "exclude_words", "from_date", "funding_agency", "keywords", "regions", "search_type", "sectors", "to_date"];
    const filtersMap = {
      tender: filterData.tenders_filter,
      contract_awards: filterData.contract_awards_filter,
      projects: filterData.projects_filter,
      grants: filterData.grants_filter,
    };

    const selectedFilter = filtersMap[watchField.data_type];
    if (selectedFilter) {
      fieldsToSet.forEach((field) => {
        setValue(field, selectedFilter[field]);
      });
    }
  }

  useEffect(() => {
    console.log("Fetching data...");
    const fetchData = async () => {
      try {
        const re = await getCustomerDetail(customerid);
        if (re?.status === 200) {
          console.log(re.data.result)
          setFilterData(re.data.result);
          // setFilter(re.data.result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [customerid]); // Only run when customerid changes


  useEffect(() => {
    if (!filterData) return;

    const fieldsToSet = ["country", "cpv_codes", "exclude_words", "from_date", "funding_agency", "keywords", "regions", "search_type", "sectors", "to_date"];
    const filtersMap = {
      tender: filterData.tenders_filter,
      contract_awards: filterData.contract_awards_filter,
      projects: filterData.projects_filter,
      grants: filterData.grants_filter,
    };

    const selectedFilter = filtersMap[watchField.data_type];
    if (selectedFilter) {
      fieldsToSet.forEach((field) => {
        setValue(field, selectedFilter[field]);
      });
    }
  }, [filterData, watchField.data_type]);




  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-xl'>Activation Panel</h1>
        {/* <input className={`${inputClass} w-1/2`} onChange={(e) => console.log(e.target.value)} placeholder='Search' /> */}
        {/* <ManagerModel submitHandler={handleTenderSubmit} fetchCustomers={fetchCustomers} tender_ids={Tender.records.map(r => r._id)} /> */}
        {
          //  Tender.records.length > 0 &&
          <Button onClick={handleTenderSubmit}>Activate this filter</Button>
        }
      </div>
      <div className='ring-1 rounded my-2 px-4 py-2 ring-gray-100 shadow'>
        <form onSubmit={handleSubmit(handleTenderSearch)}>
          <Controller
            control={control}
            name="data_type"
            {...register("data_type")}
            // defaultValue={"tender"}
            render={({ field }) => (
              <Select
                title='Data Type'
                {...field}
                style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                placeholder="Please select Data type"
                // onChange={(data)=>{console.log("QWeqw")}}
                options={[
                  {
                    label: 'Tender',
                    value: 'tender'
                  },
                  {
                    label: 'Contract Awards',
                    value: 'contract_awards'
                  },
                  {
                    label: 'Projects',
                    value: 'projects'
                  },
                  {
                    label: 'Grants',
                    value: 'grants'
                  }
                ]}
              />
            )}
          />
          <h1 className='font-semibold text-lg'>Filter Record</h1>
          <div className='grid md:gap-3  items-end'>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-3 d-flex '>
              <div className='form-group'>

                <label className="font-bold">Search Type</label>

                <Controller
                  control={control}
                  name="search_type"
                  {...register("search_type")}
                  defaultValue={_search_type || "Any Word"}
                  render={({ field }) => (
                    <Select
                      title='Search Type'
                      {...field}
                      style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                      placeholder="Please select search type"
                      options={[
                        {
                          label: 'Any Word',
                          value: 'Any Word'
                        },
                        {
                          label: 'Exact Phrase',
                          value: 'Exact Phrase'
                        },
                        {
                          label: 'Relevent Word',
                          value: 'Relevent Word'
                        }
                      ]}
                    />
                  )}
                />
              </div>
              <div className="form-group mb-6">
                <label className="font-bold">Search</label>
                {/* <span className='text-red-600 md:ml-4'>{errors?.keywords?.message}</span> */}
                <input type="text" className={inputClass} name="keywords" {...register("keywords")}
                  aria-describedby="keywords" placeholder="search" defaultValue={_keyword} />
              </div>
              <div className="form-group mb-6">
                <label className="font-bold">Exclude Words</label>
                {/* <span className='text-red-600 md:ml-4'>{errors?.keywords?.message}</span> */}
                <input type="text" className={inputClass} name="exclude_words" {...register("exclude_words")}
                  aria-describedby="exclude_keywords" placeholder="Exclude Word" />
              </div>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 md:gap-3'>
              <Controller
                control={control}
                name="cpv_codes"
                {...register("cpv_codes")}
                render={({ field }) => (
                  <Select
                    title='Cpv Codes'
                    {...field}
                    // defaultValue={_cpv_codes}
                    mode="multiple"
                    allowClear
                    style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                    placeholder="Please select cpv code"
                    onDeselect={(val) => OnResetFilter('cpv_codes')}
                    onChange={(value) => { setValue("cpv_codes", value); OnResetFilter('cpv_codes') }}
                    onSearch={value => OnChangeFilter("cpv_codes", value)}
                    options={cpv_codes}
                  />
                )}
              />
              <Controller
                control={control}
                name="sectors"
                {...register("sectors")}
                render={({ field }) => (
                  <Select
                    {...field}
                    title='Sectors'
                    defaultValue={_sectors}
                    mode="multiple"
                    allowClear
                    style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                    placeholder="Please select sectors"
                    onDeselect={(val) => OnResetFilter('sectors')}
                    onChange={(value) => { setValue("sectors", value); OnResetFilter('sectors') }}
                    onSearch={value => OnChangeFilter("sectors", value)}
                    options={sectors}
                  />
                )}
              />

              <Controller
                control={control}
                name="regions"
                {...register("regions")}
                render={({ field }) => (
                  <Select
                    {...field}
                    title='Regions'
                    mode="multiple"
                    allowClear
                    style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                    placeholder="Please select regions"
                    onDeselect={(val) => OnResetFilter('regions')}
                    onChange={(value) => { setValue("regions", value); OnResetFilter('regions') }}
                    onSearch={value => OnChangeFilter("regions", value)}
                    options={regions}
                  />
                )}
              />
              <Controller
                control={control}
                name="funding_agency"
                {...register("funding_agency")}
                render={({ field }) => (
                  <Select
                    {...field}
                    title='Funding Agency'
                    mode="multiple"
                    allowClear
                    style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                    placeholder="Please select funding_agency"
                    onDeselect={(val) => OnResetFilter('funding_agency')}
                    onChange={(value) => { setValue("funding_agency", value); OnResetFilter('funding_agency') }}
                    onSearch={value => OnChangeFilter("funding_agency", value)}
                    options={funding}
                  />
                )}
              />
              <Controller
                control={control}
                name="country"
                {...register("country")}
                render={({ field }) => (
                  <Select
                    {...field}
                    title='Country'
                    mode="multiple"
                    allowClear
                    style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                    placeholder="Please select country"
                    onDeselect={(val) => OnResetFilter('country')}
                    onChange={(value) => { setValue("country", value); OnResetFilter('country') }}
                    onSearch={value => OnChangeFilter("country", value)}
                    options={countries}
                  />
                )}
              />
            </div>

            <div className='grid md:grid-cols-2 gap-3'>

              <RangePicker
                // showTime={{
                //   format: 'YYYY-MM-DD',
                // }}
                // format="YYYY-MM-DD"
                value={
                  watchField.from_date && watchField.to_date
                    ? [moment(watchField.from_date, 'YYYY-MM-DD'), moment(watchField.to_date, 'YYYY-MM-DD')]
                    : null
                }
                style={{ width: '100%', marginBottom: '25px', padding: '5px' }}
                // onOk={handleDateRange}
                onChange={handleDateRange}
              />

              <div className="form-group mb-6">
                <input
                  type="submit"
                  className={`${inputClass} hover:ring-1 focus:ring-1 hover:text-blue-400 focus:text-blue-400 cursor-pointer`}
                  value={'Filter'}
                />
              </div>
            </div>
            <div className='grid md:grid-cols-1 lg:grid-cols-1 gap-3 d-flex '>

              {query ?
                <div className="form-group mb-6">
                  <label className="font-bold">Raw Query</label>
                  {/* <span className='text-red-600 md:ml-4'>{errors?.keywords?.message}</span> */}
                  <textarea type="text" className={inputClass} value={query}
                    aria-describedby="exclude_keywords" placeholder="Raw Query" />
                </div> : ""
              }
            </div>
          </div>
        </form>
      </div>
      {watchField.data_type === "tender" &&
        <Table
          loading={Tender.loading}
          pagination={{ pageSizeOptions: ['5', '10', '30', '50', '100'], defaultPageSize: 5, showSizeChanger: true, ...pagination }}
          dataSource={Tender.records}
          columns={columns}
          // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
          scroll={{ y: 430 }}
          onChange={onChange_table}
        />}
      {watchField.data_type === "projects" ?

        <Table
          loading={Project.loading}
          pagination={{ pageSizeOptions: ['5', '10', '30', '50', '100'], defaultPageSize: 5, showSizeChanger: true, ...pagination }}
          dataSource={Project.records}
          columns={columns}
          // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
          scroll={{ y: 430 }}
          onChange={onChange_table}
        /> : ""}
      {watchField.data_type === "contract_awards" ?

        <Table
          loading={Contract.loading}
          pagination={{ pageSizeOptions: ['5', '10', '30', '50', '100'], defaultPageSize: 5, showSizeChanger: true, ...pagination }}
          dataSource={Contract.records}
          columns={columns}
          // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
          scroll={{ y: 430 }}
          onChange={onChange_table}
        /> : ""}
      {watchField.data_type === "grants" ?

        <Table
          loading={Grant.loading}
          pagination={{ pageSizeOptions: ['5', '10', '30', '50', '100'], defaultPageSize: 5, showSizeChanger: true, ...pagination }}
          dataSource={Grant.records}
          columns={columns}
          // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
          scroll={{ y: 430 }}
          onChange={onChange_table}
        /> : ""}
    </div>
  )
}

