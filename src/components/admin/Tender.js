import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Modal, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchTenderRecords,
    insertTenderRecord,
    updateTenderRecord,
    deleteTenderRecord,
    changeTenderParameter,
} from '../../redux/slice/tender.slice';
import { fetchCountries } from '../../apis/master/country.api';
import moment from 'moment';
import { fetchSector } from '../../apis/master/sector.api';
import { fetchFundingAgencies } from '../../apis/master/funding_agency';
import { fetchRegion } from '../../apis/master/region.api';
import { fetchCPVCode } from '../../apis/master/cpvcode.api';
import { userRoles } from '../../utils/roles';
import { useCookies } from 'react-cookie';
import DebouncedSearch from '../Common/DebouncedSearch';

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

export default function Tender() {
    const [cookies] = useCookies(['role']);
    const Tender = useSelector((state) => state.tender);
    const dispatch = useDispatch();

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 5,
        total: 0,
        sort: { _id: -1 },
    });

    useEffect(() => {
        setPagination({
            current: Tender.pageNo + 1,
            pageSize: Tender.limit,
            total: Tender.count,
            sort: { [`${Tender.sortField}`]: Tender.sortBy },
        });
        fetchRecord({
            pageNo: Tender.pageNo,
            limit: Tender.limit,
            sortBy: Tender.sortBy,
            sortField: Tender.sortField,
            keywords: Tender.keywords,
        });
    }, []);

    useEffect(() => {
        setPagination({
            ...pagination,
            total: Tender.count,
        });
    }, [Tender.count]);

    function fetchRecord({ pageNo, limit, sortBy, sortField, keywords }) {
        dispatch(
            fetchTenderRecords({ pageNo, limit, sortBy, sortField, keywords: keywords }),
        );
    }

    const handleDeleteSlide = (id) => {
        dispatch(deleteTenderRecord({ id }));
        setTimeout(() => {
            fetchRecord({
                pageNo: Tender.pageNo,
                limit: Tender.limit,
                sortBy: Tender.sortBy,
                sortField: Tender.sortField,
                keywords: Tender.keywords,
            });
        }, 100);
    };

    const handleTenderSubmit = async (data, id, setOpen) => {
        try {
            if (id) {
                data._id = id;
                await dispatch(updateTenderRecord(data));
            } else {
                await dispatch(insertTenderRecord(data));
            }

            setTimeout(() => {
                fetchRecord({
                    pageNo: Tender.pageNo,
                    limit: Tender.limit,
                    sortBy: Tender.sortBy,
                    sortField: Tender.sortField,
                    keywords: Tender.keywords,
                });
            }, 100);
            setOpen(() => false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSearch = (keywords) => {
        dispatch(
            changeTenderParameter({
                pageNo: 0,
                limit: pagination.pageSize,
                sortBy: pagination.sort[Object.keys(pagination.sort)[0]],
                sortField: Object.keys(pagination.sort)[0],
                keywords: keywords,
            }),
        );
        dispatch(
            fetchTenderRecords({
                pageNo: pagination.current - 1,
                limit: pagination.pageSize,
                sortBy: pagination.sort[Object.keys(pagination.sort)[0]],
                sortField: Object.keys(pagination.sort)[0],
                keywords: keywords,
            }),
        );
    };

    const onChange_table = (paginate, filter, sorter, extra) => {
        // console.log({paginate, filter, sorter, extra})
        paginate.total = Tender.count;
        paginate.sort = {};

        if (extra.action == 'sort') {
            paginate.sort[`${sorter.field}`] = sorter.order == 'ascent' ? 1 : -1;
        } else {
            paginate.sort = pagination.sort;
        }
        setPagination(paginate);
        console.log('paginate', paginate);
        dispatch(
            changeTenderParameter({
                pageNo: paginate.current - 1,
                limit: paginate.pageSize,
                sortBy: paginate.sort[Object.keys(paginate.sort)[0]],
                sortField: Object.keys(paginate.sort)[0],
            }),
        );
        dispatch(
            fetchTenderRecords({
                pageNo: paginate.current - 1,
                limit: paginate.pageSize,
                sortBy: paginate.sort[Object.keys(paginate.sort)[0]],
                sortField: Object.keys(paginate.sort)[0],
                keywords: Tender.keywords,
            }),
        );
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            fixed: 'left',
            width: 170,
            height: 100,
            sorter: (a, b) => a.title - b.title,
        },
        {
            title: 'Authority Name',
            dataIndex: 'authority_name',
            key: 'authority_name',
            fixed: 'left',
            width: 170,
            height: 100,
            sorter: (a, b) => a.authority_name - b.authority_name,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 150,
            sorter: (a, b) => a.address - b.address,
        },
        {
            title: 'Phone',
            dataIndex: 'telephone',
            key: 'telephone',
            width: 150,
            sorter: (a, b) => a.telephone - b.telephone,
        },
        {
            title: 'Fax Number',
            dataIndex: 'fax_number',
            key: 'fax_number',
            width: 150,
            sorter: (a, b) => a.fax_number - b.fax_number,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 150,
            sorter: (a, b) => a.email - b.email,
        },
        {
            title: 'Contact Person',
            dataIndex: 'contact_person',
            key: 'contact_person',
            width: 150,
            sorter: (a, b) => a.contact_person - b.contact_person,
        },
        {
            title: 'Big Ref No',
            dataIndex: 'big_ref_no',
            key: 'big_ref_no',
            width: 150,
            sorter: (a, b) => a.big_ref_no - b.big_ref_no,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 150,
            sorter: (a, b) => a.description - b.description,
        },
        {
            title: 'Tender Type',
            dataIndex: 'tender_type',
            key: 'tender_type',
            width: 150,
            sorter: (a, b) => a.tender_type - b.tender_type,
        },
        {
            title: 'Tender No',
            dataIndex: 'tender_no',
            key: 'tender_no',
            width: 150,
            sorter: (a, b) => a.tender_no - b.tender_no,
        },
        {
            title: 'Funding Agency',
            dataIndex: 'funding_agency',
            key: 'funding_agency',
            width: 150,
            sorter: (a, b) => a.funding_agency - b.funding_agency,
        },
        {
            title: 'Tender Competition',
            dataIndex: 'tender_competition',
            key: 'tender_competition',
            width: 150,
            sorter: (a, b) => a.tender_competition - b.tender_competition,
        },
        {
            title: 'Publishing Date',
            dataIndex: 'published_date',
            key: 'published_date',
            width: 150,
            render: (e) => moment(e).format('ll'),
            sorter: (a, b) => a.published_date - b.published_date,
        },
        {
            title: 'Closing Date',
            dataIndex: 'closing_date',
            key: 'closing_date',
            width: 150,
            render: (e) => moment(e).format('ll'),
            sorter: (a, b) => a.closing_date - b.closing_date,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            width: 150,
            sorter: (a, b) => a.country - b.country,
        },
        {
            title: 'Emd',
            dataIndex: 'emd',
            key: 'emd',
            width: 150,
            sorter: (a, b) => a.emd - b.emd,
        },
        {
            title: 'Estimated Cost',
            dataIndex: 'estimated_cost',
            key: 'estimated_cost',
            width: 150,
            sorter: (a, b) => a.estimated_cost - b.estimated_cost,
        },
        {
            title: 'Documents',
            dataIndex: 'documents',
            key: 'documents',
            width: 150,
            sorter: (a, b) => a.documents - b.documents,
        },
        {
            title: 'Sectors',
            dataIndex: 'sectors',
            key: 'sectors',
            width: 150,
            sorter: (a, b) => a.sectors - b.sectors,
        },
        {
            title: 'Cpv Code',
            dataIndex: 'cpv_codes',
            key: 'cpv_codes',
            width: 150,
            sorter: (a, b) => a.cpv_codes - b.cpv_codes,
        },
        {
            title: 'Regions',
            dataIndex: 'regions',
            key: 'regions',
            width: 150,
            sorter: (a, b) => a.regions - b.regions,
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
            sorter: (a, b) => a.createdAt - b.createdAt,
        },
    ].concat(
        [userRoles.SUPER_ADMIN, userRoles.CONTENT_DEPARTMENT].includes(cookies.role)
            ? {
                  title: 'Action',
                  dataIndex: 'Action',
                  key: 'Action',
                  width: '150px',
                  fixed: 'right',
                  render: (e, record) => (
                      <div className="flex gap-2" key={record._id}>
                          <ManagerModel
                              key={record._id}
                              id={record._id}
                              submitHandler={handleTenderSubmit}
                              _tender={record}
                          />
                          <Button
                              title="Delete"
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteSlide(record._id)}
                          ></Button>
                      </div>
                  ),
              }
            : [],
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl">Tender</h1>
                <div className="flex gap-2 ml-auto ">
                    <DebouncedSearch
                        onSearch={handleSearch}
                        placeholder="Search Customers..."
                    />
                    <ManagerModel submitHandler={handleTenderSubmit} />
                </div>
            </div>
            <Table
                loading={Tender.loading}
                pagination={{
                    ...pagination,
                    pageSizeOptions: ['5', '10', '30', '50', '100'],
                    defaultPageSize: 5,
                    showSizeChanger: true,
                }}
                dataSource={Tender.records}
                columns={columns}
                // pagination={{ sort: { name: -1 }, defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
                scroll={{ y: 430 }}
                onChange={onChange_table}
            />
        </div>
    );
}

function ManagerModel({ id, _tender, submitHandler }) {
    const [fundingAgencies, setFundingAgencies] = useState([]);
    const [funding_timeout, setFunding_timeout] = useState(0);
    const [countries, setCountries] = useState([]);
    const [country_timeout, setCountry_timeout] = useState(0);
    const [sectors, setSectors] = useState([]);
    const [sector_timeout, setSector_timeout] = useState(0);

    const [cpv_codes, setCpv_codes] = useState([]);
    const [cpv_timeout, setCpv_timeout] = useState(0);

    const [regions, setRegions] = useState([]);
    const [region_timeout, setRegion_timeout] = useState(0);

    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();
    const [cookies] = useCookies(['role']);

    useEffect(() => {
        setValue('sectors', _tender?.sectors);
        setValue('cpv_codes', _tender?.cpv_codes);
        setValue('funding_agency', _tender?.funding_agency);
        setValue('regions', _tender?.regions);
    }, []);

    const competitionType = ['Domestic ', 'International', 'Both'];
    // const noticeTypeConst = ["Tender", "Project", "Contract Award", "Grants"];
    const tenderTypeConst = ['Live  ', 'Archive'];

    const onSubmit = (body) => {
        console.log(body);
        if (body.sector) {
            var _sec = sectors.find((s) => s.name == body.sector);
            if (_sec)
                body.sector = {
                    _id: _sec._id,
                    name: _sec.name,
                };
        }

        submitHandler(body, id, setOpen);
    };

    const handleFundingSearch = async (value) => {
        if (funding_timeout) clearTimeout(funding_timeout);
        if (!value || !value.trim()) {
            setValue('funding_agency', '');
            setFundingAgencies([]);
        } else {
            var timeoutRef = setTimeout(async () => {
                var _funding = await fetchFundingAgencies({
                    pageNo: 0,
                    limit: 15,
                    sortBy: 1,
                    sortField: 'title',
                    keywords: value.trim(),
                });

                var resp = _funding.data;
                console.log('funding agency data', resp.result.result);
                if (resp.success) {
                    var result = resp.result.result.map((s) => ({
                        label: s.title,
                        value: s.title,
                    }));
                    setFundingAgencies(() => result);
                } else {
                    setFundingAgencies([]);
                }
            }, 800);
            setFunding_timeout(timeoutRef);
        }
    };

    const handleCountrySearch = async (value) => {
        if (country_timeout) clearTimeout(country_timeout);
        if (!value || !value.trim()) {
            setValue('country', '');
            setCountries([]);
        } else {
            var timeoutRef = setTimeout(async () => {
                var _countries = await fetchCountries({
                    pageNo: 0,
                    limit: 15,
                    sortBy: 1,
                    sortField: 'name',
                    keywords: value.trim(),
                });

                var resp = _countries.data;
                console.log('country data', resp.result.result);
                if (resp.success) {
                    var result = resp.result.result.map((s) => ({
                        label: s.name,
                        value: s.name,
                    }));
                    setCountries(() => result);
                } else {
                    setCountries([]);
                }
            }, 800);
            setCountry_timeout(timeoutRef);
        }
    };

    const handleSectorSearch = async (value) => {
        if (sector_timeout) clearTimeout(sector_timeout);
        if (!value || !value.trim()) {
            setValue('sectors', '');
            setSectors([]);
        } else {
            var timeoutRef = setTimeout(async () => {
                var _sectors = await fetchSector({
                    pageNo: 0,
                    limit: 15,
                    sortBy: 1,
                    sortField: 'name',
                    keywords: value.trim(),
                });

                var resp = _sectors.data;
                console.log('sector data', resp.result.result);
                if (resp.success) {
                    // var result = resp.result.result.map(s => ({
                    //   label: s.name,
                    //   value: s.name
                    // }))
                    setSectors(() => resp.result.result);
                } else {
                    setSectors([]);
                }
            }, 800);
            setSector_timeout(timeoutRef);
        }
    };

    const handleRegionSearch = async (value) => {
        if (region_timeout) clearTimeout(region_timeout);
        if (!value || !value.trim()) {
            setValue('regions', '');
            setRegions([]);
        } else {
            var timeoutRef = setTimeout(async () => {
                var _regions = await fetchRegion({
                    pageNo: 0,
                    limit: 15,
                    sortBy: 1,
                    sortField: 'name',
                    keywords: value.trim(),
                });

                var resp = _regions.data;
                // console.log('regions data', resp.result.result)
                if (resp.success) {
                    var result = resp.result.result.map((s) => ({
                        label: s.name,
                        value: s.name,
                    }));
                    setRegions(() => result);
                } else {
                    setRegions([]);
                }
            }, 800);
            setRegion_timeout(timeoutRef);
        }
    };

    const handleCPVSearch = async (value) => {
        if (cpv_timeout) clearTimeout(cpv_timeout);
        if (!value || !value.trim()) {
            setValue('cpv_codes', '');
            setCpv_codes([]);
        } else {
            var timeoutRef = setTimeout(async () => {
                var _cpvcode = await fetchCPVCode({
                    pageNo: 0,
                    limit: 15,
                    sortBy: 1,
                    sortField: 'code',
                    keywords: value.trim(),
                });

                var resp = _cpvcode.data;
                console.log('cpv data', resp.result.result);
                if (resp.success) {
                    var result = resp.result.result.map((s) => ({
                        label: s.code,
                        value: s.code,
                    }));
                    setCpv_codes(() => result);
                } else {
                    setCpv_codes([]);
                }
            }, 800);
            setCpv_timeout(timeoutRef);
        }
    };

    return (
        <div className="">
            {[userRoles.SUPER_ADMIN, userRoles.CONTENT_DEPARTMENT].includes(
                cookies.role,
            ) && (
                <Button
                    className={!id ? 'float-right' : ''}
                    title={id ? 'Edit' : 'Add'}
                    icon={id ? <EditFilled /> : <PlusOutlined />}
                    onClick={() => setOpen(true)}
                >
                    {id ? '' : 'Add'}
                </Button>
            )}

            <Modal
                centered
                width={1000}
                title={(id ? 'Edit' : 'Add') + ' Tender'}
                open={open}
                onOk={() => setOpen(false)}
                footer={false}
                onCancel={() => setOpen(false)}
            >
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-3">
                            <div className="form-group mb-6">
                                <label className="font-bold">Title</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.title?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="address"
                                    {...register('title')}
                                    aria-describedby="title"
                                    placeholder="title"
                                    defaultValue={_tender?.title || ''}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">
                                    Authority Name <span className="text-red-600">*</span>
                                </label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.authority_name?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="authority_name"
                                    {...register('authority_name', {
                                        required: 'field is required',
                                    })}
                                    aria-describedby="authority_name"
                                    placeholder="authority_name"
                                    defaultValue={_tender?.authority_name || ''}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Address</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.address?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="address"
                                    {...register('address')}
                                    aria-describedby="address"
                                    placeholder="address"
                                    defaultValue={_tender?.address || ''}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Phone</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.telephone?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="telephone"
                                    {...register('telephone')}
                                    aria-describedby="telephone"
                                    placeholder="telephone"
                                    defaultValue={_tender?.telephone || ''}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Fax Number</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.fax_number?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="fax_number"
                                    {...register('fax_number')}
                                    aria-describedby="fax_number"
                                    placeholder="fax_number"
                                    defaultValue={_tender?.fax_number || ''}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Email</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.email?.message}
                                </span>
                                <input
                                    type="email"
                                    className={inputClass}
                                    name="email"
                                    {...register('email')}
                                    aria-describedby="email"
                                    placeholder="email"
                                    defaultValue={_tender?.email || ''}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Contact Person</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.contact_person?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="contact_person"
                                    {...register('contact_person')}
                                    aria-describedby="contact_person"
                                    placeholder="contact_person"
                                    defaultValue={_tender?.contact_person || ''}
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-3">
                            <div className="form-group mb-6">
                                <label className="font-bold">
                                    Big Ref Number <span className="text-red-600">*</span>
                                </label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.big_ref_no?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="big_ref_no"
                                    {...register('big_ref_no', {
                                        required: 'field is required',
                                    })}
                                    aria-describedby="big_ref_no"
                                    placeholder="big_ref_no"
                                    defaultValue={_tender?.big_ref_no || ''}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Description</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.description?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="description"
                                    {...register('description')}
                                    aria-describedby="description"
                                    placeholder="description"
                                    defaultValue={_tender?.description || ''}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Tender Type</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.tender_type?.message}
                                </span>
                                <select
                                    type="text"
                                    className={inputClass}
                                    name="tender_type"
                                    {...register('tender_type')}
                                    aria-describedby="tender_type"
                                    placeholder="tender_type"
                                    defaultValue={_tender?.tender_type || ''}
                                >
                                    {tenderTypeConst.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Tender No</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.tender_no?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="tender_no"
                                    {...register('tender_no')}
                                    aria-describedby="tender_no"
                                    placeholder="tender_no"
                                    defaultValue={_tender?.tender_no || ''}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Funding Agency</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.funding_agency?.message}
                                </span>
                                {/* <input type="text" className={inputClass} name="funding_agency" {...register("funding_agency")}
                                aria-describedby="funding_agency" placeholder="funding_agency" defaultValue={_tender?.funding_agency || ''} /> */}
                                <AutoComplete
                                    {...register('funding_agency')}
                                    // className={inputClass}
                                    className={'w-full'}
                                    onSearch={handleFundingSearch}
                                    placeholder="input here"
                                    options={fundingAgencies}
                                    defaultValue={_tender?.funding_agency || ''}
                                    onSelect={(e) => setValue('funding_agency', e)}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Tender Compition</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.tender_competition?.message}
                                </span>
                                <select
                                    type="text"
                                    className={inputClass}
                                    name="tender_competition"
                                    {...register('tender_competition')}
                                    aria-describedby="tender_competition"
                                    placeholder="tender_competition"
                                    defaultValue={_tender?.tender_competition || ''}
                                >
                                    {competitionType.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-3">
                            <div className="form-group mb-6">
                                <label className="font-bold">Publishing Date</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.published_date?.message}
                                </span>
                                <input
                                    type="date"
                                    className={inputClass}
                                    name="published_date"
                                    {...register('published_date')}
                                    aria-describedby="published_date"
                                    placeholder="published_date"
                                    defaultValue={
                                        moment(_tender?.published_date).format(
                                            'YYYY-MM-DD',
                                        ) || ''
                                    }
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Closing Date</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.closing_date?.message}
                                </span>
                                <input
                                    type="date"
                                    className={inputClass}
                                    name="closing_date"
                                    {...register('closing_date')}
                                    aria-describedby="closing_date"
                                    placeholder="closing_date"
                                    defaultValue={
                                        moment(_tender?.closing_date).format(
                                            'YYYY-MM-DD',
                                        ) || ''
                                    }
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Country</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.country?.message}
                                </span>
                                {/* <input type="text" className={inputClass} name="country" {...register("country")}
                                aria-describedby="country" placeholder="country" defaultValue={_tender?.country || ''} /> */}
                                <AutoComplete
                                    {...register('country')}
                                    // className={inputClass}
                                    className={'w-full'}
                                    onSearch={handleCountrySearch}
                                    placeholder="input here"
                                    options={countries}
                                    defaultValue={_tender?.country || ''}
                                    onSelect={(e) => setValue('country', e)}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">EMD</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.emd?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="emd"
                                    {...register('emd')}
                                    aria-describedby="emd"
                                    placeholder="emd"
                                    defaultValue={_tender?.emd || ''}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Estimated Cost</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.estimated_cost?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="estimated_cost"
                                    {...register('estimated_cost')}
                                    aria-describedby="estimated_cost"
                                    placeholder="estimated_cost"
                                    defaultValue={_tender?.estimated_cost || ''}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Documents</label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.documents?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    name="documents"
                                    {...register('documents')}
                                    aria-describedby="documents"
                                    placeholder="documents"
                                    defaultValue={_tender?.documents || ''}
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-3">
                            <div className="form-group mb-6">
                                <label className="font-bold">
                                    Sector <span className="text-red-600">*</span>
                                </label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.sectors?.message}
                                </span>
                                {/* <input type="text" className={inputClass} name="sector" {...register("sector")}
                              aria-describedby="sector" placeholder="sector" defaultValue={_tender?.sector || ''} /> */}
                                <AutoComplete
                                    {...register('sectors', {
                                        required: 'field is required',
                                    })}
                                    // className={inputClass}
                                    className="w-full"
                                    onSearch={handleSectorSearch}
                                    placeholder="input here"
                                    options={sectors.map((s) => ({
                                        label: s.name,
                                        value: s.name,
                                    }))}
                                    defaultValue={_tender?.sectors || ''}
                                    onSelect={(e) => setValue('sectors', e)}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">
                                    Region <span className="text-red-600">*</span>
                                </label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.regions?.message}
                                </span>
                                {/* <input type="text" className={inputClass} name="regions" {...register("regions")}
                              aria-describedby="regions" placeholder="regions" defaultValue={_tender?.regions || ''} /> */}
                                <AutoComplete
                                    {...register('regions', {
                                        required: 'field is reuqired',
                                    })}
                                    // className={inputClass}
                                    className={'w-full'}
                                    onSearch={handleRegionSearch}
                                    placeholder="input here"
                                    options={regions}
                                    defaultValue={_tender?.regions || ''}
                                    onSelect={(e) => setValue('regions', e)}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">
                                    CPV Code <span className="text-red-600">*</span>
                                </label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.cpv_codes?.message}
                                </span>
                                {/* <input type="text" className={inputClass} name="cpv_codes" {...register("cpv_codes")}
                              aria-describedby="cpv_codes" placeholder="cpv_codes" defaultValue={_tender?.cpv_codes || ''} /> */}
                                <AutoComplete
                                    {...register('cpv_codes', {
                                        required: 'field is reuqired',
                                    })}
                                    // className={inputClass}
                                    className={'w-full'}
                                    onSearch={handleCPVSearch}
                                    placeholder="input here"
                                    options={cpv_codes}
                                    defaultValue={_tender?.cpv_codes || ''}
                                    onSelect={(e) => setValue('cpv_codes', e)}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded shadow hover:bg-gray-200"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
