import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FetchCMSByType, UpdateTenderInfoCMS } from '../../../apis/cms.api';
import { toast_popup } from '../../../utils/toast';

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

export default function TenderInfoCMS() {
    const { register, handleSubmit, setValue, formState: { errors }, setError } = useForm();

    const onSubmit = async (body) => {
        try {
            if(!body.description.trim()) {
                setError('description', {
                    message: 'field is required'
                });
                return;
            }
            var response = await UpdateTenderInfoCMS(body);
    
            console.log('submit resp', response.data);
            toast_popup('Submitted Successfully', 'success')
        }
        catch(err) {
            toast_popup(err?.response?.data?.message || err.message, 'error')
        }
    }

    useEffect(() => {
        // _id for update
        (async function() {
            var response = await FetchCMSByType('tenders_info');
            console.log('respponse', response.data)
            var result = response.data;
            if(result.success && result.result) {
                var obj = result.result;
                var keys = Object.keys(obj);
                for(const key of keys) {
                    if(typeof obj[key] == 'string')
                        setValue(key, obj[key], { shouldValidate: true });
                }
            }
        })()
    }, [])

  return (
    <div className=''>
        <h1 className='mb-6 md:mb-12 text-xl md:text-2xl lg:text-3xl font-bold font-bold'>Tender Info</h1>
        <div className=''>
        <div className='w-full md:w-full lg:w-2/3'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-6">
                <label className="font-bold">Title <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.title?.message}</span>
                <input type="text" className={inputclass} name="title" {...register("title", { required: 'field is reuiqred' })}
                    aria-describedby="title" placeholder="Title" />
            </div>
            <div className="form-group mb-6">
                <label className="font-bold">Description <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.description?.message}</span>
                <textarea type="text" className={inputclass} name="description" {...register("description", { required: 'field is reuiqred' })}
                    aria-describedby="description" placeholder="Description" />
            </div>
            <div>
                <button type="submit" className="px-4 py-2 rounded shadow hover:bg-gray-200">Submit</button>
            </div>
        </form>
        </div>
        </div>
    </div>
  )
}
