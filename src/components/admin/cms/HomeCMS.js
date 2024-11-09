import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FetchCMSByType, UpdateHomePageCMS } from '../../../apis/cms.api';
import { toast_popup } from '../../../utils/toast';
import { Select } from 'antd';
import { fetchSector } from '../../../apis/master/sector.api';
import { fetchTenders } from '../../../apis/tender.api';
import moment from 'moment';

var inputclass = `form-control
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

export default function HomeCMS() {
    const { register, handleSubmit, setValue, formState: { errors }, setError, getValues, control } = useForm();
    const [sectors, setSectors] = useState([]);
    const [tenders, setTenders] = useState([]);

    const onSubmit = async (body) => {
        try {
            console.log(body, "body");
            if (!body.category_description.trim()) {
                setError('category_description', {
                    message: 'field is required'
                })
                return;
            }

            if (body.category_data.length > 12) {
                setError('category_data', {
                    message: 'max 12 entries allowed'
                })
                return
            }
            if (body.global_tender_data.length > 6) {
                setError('global_tender_data', {
                    message: 'max 6 entries allowed'
                })
                return
            }
            if (body.indian_tender_data.length > 6) {
                setError('indian_tender_data', {
                    message: 'max 6 entries allowed'
                })
                return
            }
            body.category_data = body.category_data.map(c => {
                var entry = sectors.find(s => s._id == c.value);
                return {
                    "_id": c.value,
                    "name": entry?.name,
                    "icon": entry?.icon || '',
                    "title": entry?.title,
                    "description": entry?.description
                }
            })

            body.global_tender_data = body.global_tender_data.map(c => {
                var entry = tenders.find(s => s._id == c.value);
                var closing_date = entry?.closing_date ? moment(entry?.closing_date).format('YYYY-MM-DD') : ''
                var sector_obj = "";
                if (entry?.sectors) {
                    let _sector = sectors.find(s => s.name === entry?.sectors);
                    if (_sector) {
                        sector_obj = {
                            _id: _sector._id,
                            name: _sector.name,
                        }
                    }
                }
                return {
                    "_id": c.value,
                    "authority_name": entry?.authority_name,
                    "big_ref_no": entry?.big_ref_no,
                    "closing_date": closing_date,
                    "sector": sector_obj
                }
            })

            body.indian_tender_data = body.indian_tender_data.map(c => {
                var entry = tenders.find(s => s._id == c.value);
                var closing_date = entry?.closing_date ? moment(entry?.closing_date).format('YYYY-MM-DD') : '';
                return {
                    "_id": c.value,
                    "authority_name": entry?.authority_name,
                    "big_ref_no": entry?.big_ref_no,
                    "closing_date": closing_date,
                    // "sectors": entry?.sectors
                }
            })
            var response = await UpdateHomePageCMS(body);

            console.log('submit resp', response.data);
            toast_popup('Submitted Successfully', 'success')
        }
        catch (err) {
            toast_popup(err?.response?.data?.message || err.message, 'error')
        }
    }

    useEffect(() => {
        (async function () {

            var _sectors = await fetchSector({ pageNo: 0, limit: 1000, sortBy: 1, sortField: 'name', keywords: '' })
            var resp = _sectors.data;
            console.log('sector data', resp.result.result)
            if (resp.success) {
                setSectors(() => resp.result.result);
            }
            else {
                setSectors([]);
            }

            var _tenders = await fetchTenders({ pageNo: 0, limit: 1000, sortBy: 1, sortField: 'authority_name', keywords: '' });
            resp = _tenders.data;
            console.log('tender data', resp.result.result)
            if (resp.success) {
                setTenders(() => resp.result.result);
            }
            else {
                setTenders([]);
            }

            // var response = await FetchCMSByType('home_page&indian=true');
            var response = await FetchCMSByType('home_page');
            console.log('respponse', response.data)
            // setValue('test_ids', ['1', '3'])

            var result = response.data;
            if (result.success && result.result) {
                var obj = result.result;
                var keys = Object.keys(obj).filter(k => !['createdAt', 'updatedAt'].includes(k));
                for (const key of keys) {
                    if (key === 'category_data') {
                        setValue(key, obj[key].map(c => ({
                            "label": c.name,
                            "value": c._id
                        })), { shouldValidate: true });
                    }
                    else if (key === 'global_tender_data' || key === 'indian_tender_data') {
                        // setValue(key, obj[key].map(c => {
                        //     var _t = resp.result.result.find(t => t._id == c._id);
                        //     return {
                        //         "label": _t?.authority_name,
                        //         "value": c._id
                        //     }
                        // }), { shouldValidate: true });

                        var _data = resp.result.result.filter(c => obj[key].some(o => o._id == c._id))
                        if (_data.length > 0)
                            setValue(key, _data.map(c => ({
                                "label": c.authority_name,
                                "value": c._id
                            })), { shouldValidate: true });
                    }
                    else {
                        setValue(key, obj[key], { shouldValidate: true });
                    }
                }
            }

        })()
    }, [])

    return (
        <div className=''>
            <h1 className='mb-6 md:mb-12 text-xl md:text-2xl lg:text-3xl font-bold font-bold'>Home Page</h1>
            <div className=''>
                <div className='w-full md:w-full lg:w-2/3'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-6">
                            <label className="font-bold">Cateogry Title <span className='text-red-600'>*</span></label>
                            <span className='text-red-600 md:ml-4'>{errors?.category_title?.message}</span>
                            <input type="text" className={inputclass} name="category_title" {...register("category_title", { required: 'This field is required' })}
                                aria-describedby="category_title" placeholder="category title" />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Category Description <span className='text-red-600'>*</span></label>
                            <span className='text-red-600 md:ml-4'>{errors?.category_description?.message}</span>
                            <textarea type="text" className={inputclass} name="category_description" {...register("category_description", { required: 'This field is required' })}
                                aria-describedby="category_description" placeholder="category description" />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Tender Title <span className='text-red-600'>*</span></label>
                            <span className='text-red-600 md:ml-4'>{errors?.tender_title?.message}</span>
                            <input type="text" className={inputclass} name="tender_title" {...register("tender_title", { required: 'This field is required' })}
                                aria-describedby="tender_title" placeholder="tender title" />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Tender Description <span className='text-red-600'>*</span></label>
                            <span className='text-red-600 md:ml-4'>{errors?.tender_description?.message}</span>
                            <textarea type="text" className={inputclass} name="tender_description" {...register("tender_description", { required: 'This field is required' })}
                                aria-describedby="tender_description" placeholder="tender description" />
                        </div>
                        <div className='grid md:grid-cols-3 gap-2'>
                            <div className="form-group mb-6">
                                <label className="font-bold">Category Data <span className='text-red-600'>*</span></label>
                                <span className='text-red-600 md:ml-4'>{errors?.category_data?.message}</span>
                                <Controller
                                    control={control}
                                    name="category_data"
                                    {...register("category_data", { required: 'This field is required' })}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            defaultValue={field.defaultValue}
                                            mode="multiple"
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="Please select category ids"
                                            onChange={(value) => {
                                                var data = value.map(v => {
                                                    var _sector = sectors.find(s => s._id === v);
                                                    return {
                                                        label: _sector.name,
                                                        value: _sector._id
                                                    }
                                                })
                                                setValue("category_data", data, { shouldValidate: true })
                                            }}
                                            options={
                                                sectors.map(s => ({
                                                    label: s.name,
                                                    value: s._id
                                                }))
                                            }
                                        />
                                    )}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Global Tendor Data <span className='text-red-600'>*</span></label>
                                <span className='text-red-600 md:ml-4'>{errors?.global_tender_data?.message}</span>
                                <Controller
                                    control={control}
                                    name="global_tender_data"
                                    {...register("global_tender_data", { required: 'This field is required' })}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            defaultValue={field.defaultValue}
                                            mode="multiple"
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="Please select global tender entry"
                                            onChange={(value) => {
                                                var data = value.map(v => {
                                                    var _t = tenders.find(t => t._id === v);
                                                    return {
                                                        label: _t.authority_name,
                                                        value: _t._id
                                                    }
                                                })
                                                setValue("global_tender_data", data, { shouldValidate: true })
                                            }}
                                            options={
                                                tenders.map(s => ({
                                                    label: s.authority_name,
                                                    value: s._id
                                                }))
                                            }
                                        />
                                    )}
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Indian Tendor Data <span className='text-red-600'>*</span></label>
                                <span className='text-red-600 md:ml-4'>{errors?.indian_tender_data?.message}</span>
                                <Controller
                                    control={control}
                                    name="indian_tender_data"
                                    {...register("indian_tender_data", { required: 'This field is required' })}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            defaultValue={field.defaultValue}
                                            mode="multiple"
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="Please select indian tender entry"
                                            onChange={(value) => {
                                                var data = value.map(v => {
                                                    var _t = tenders.find(t => t._id === v);
                                                    return {
                                                        label: _t.authority_name,
                                                        value: _t._id
                                                    }
                                                })
                                                setValue("indian_tender_data", data, { shouldValidate: true })
                                            }}
                                            options={
                                                tenders.map(s => ({
                                                    label: s.authority_name,
                                                    value: s._id
                                                }))
                                            }
                                        />
                                    )}
                                />
                            </div>

                            {/* <div className="form-group mb-6">
                                <label className="font-bold">Indian Tendor Ids <span className='text-red-600'>*</span></label>
                                <span className='text-red-600 md:ml-4'>{errors?.test_ids?.message}</span>
                                <select type="text" className={inputclass} name="test_ids" {...register("test_ids", { required: 'This field is required' })}
                                    aria-describedby="test_ids" placeholder="indian tendor ids" onChange={e => console.log(e.target.value)} multiple>
                                        <option value={'1'}>1</option>
                                        <option value={'2'}>2</option>
                                        <option value={'3'}>3</option>
                                </select>
                            </div> */}
                        </div>
                        <div className=''>
                            <button type="submit" className="px-4 py-2 rounded shadow hover:bg-gray-200">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
