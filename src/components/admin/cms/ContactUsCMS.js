import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FetchCMSByType, UpdateContactUsCMS } from '../../../apis/cms.api';
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

export default function ContactUsCMS() {
    const { register, handleSubmit, setValue, formState: { errors }, setError } = useForm();

    const onSubmit = async (body) => {
        try {
            if(!body.address.trim()) {
                setError('address', {
                    message: 'field is required'
                })
                return;
            }
            var response = await UpdateContactUsCMS(body);
    
            toast_popup('Submitted Successfully', 'success')
            console.log('submit resp', response.data);
        }
        catch(err) {
            toast_popup(err?.response?.data?.message || err.message, 'error')
        }
    }

    useEffect(() => {
        (async function() {
            var response = await FetchCMSByType('contact_details');
            console.log('respponse', response.data)
            var result = response.data;
            if(result.success && result.result) {
                var obj = result.result;
                var keys = Object.keys(obj);
                var keys = Object.keys(obj).filter(k => !['createdAt', 'updatedAt'].includes(k));
                for(const key of keys) {
                    setValue(key, obj[key], { shouldValidate: true });
                }
            }
        })()
    }, [])

  return (
    <div className=''>
        <h1 className='mb-6 md:mb-12 text-xl md:text-2xl lg:text-3xl font-bold'>Contact Us</h1>
        <div className=''>
        <div className='w-full md:w-full lg:w-1/2'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid'>
                <div className="form-group mb-6">
                    <label className="font-bold">Contact Title <span className='text-red-600'>*</span></label>
                    <span className='text-red-600 md:ml-4'>{errors?.contact_title?.message}</span>
                    <input type="text" className={inputclass} name="contact_title" {...register("contact_title", { required: 'This field is required' })}
                        aria-describedby="contact_title" placeholder="contact title" />
                </div>
            </div>
            <div className="form-group mb-6">
                <label className="font-bold">Description <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.contact_description?.message}</span>
                <textarea type="text" className={inputclass} name="contact_description" {...register("contact_description", { required: 'This field is required' })}
                    aria-describedby="contact_description" placeholder="contact description" />
            </div>
            <div className='grid md:grid-cols-2 gap-2'>
                <div className="form-group mb-6">
                    <label className="font-bold">Phone <span className='text-red-600'>*</span></label>
                    <span className='text-red-600 md:ml-4'>{errors?.phone?.message}</span>
                    <input type="text" className={inputclass} name="phone" {...register("phone", { required: 'This field is required' })}
                        aria-describedby="phone" placeholder="Phone" />
                </div>
                <div className="form-group mb-6">
                    <label className="font-bold">Email <span className='text-red-600'>*</span></label>
                    <span className='text-red-600 md:ml-4'>{errors?.email?.message}</span>
                    <input type="text" className={inputclass} name="email" {...register("email", { required: 'This field is required' })}
                        aria-describedby="email" placeholder="Email" />
                </div>
            </div>
            <div className="form-group mb-6">
                <label className="font-bold">Address <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.address?.message}</span>
                <textarea type="text" className={inputclass} name="address" {...register("address", { required: 'This field is required' })}
                    aria-describedby="address" placeholder="Address" />
            </div>
            <div className='grid'>
                <div className="form-group mb-6">
                    <label className="font-bold">Google Map Url <span className='text-red-600'>*</span></label>
                    <span className='text-red-600 md:ml-4'>{errors?.google_map_url?.message}</span>
                    <input type="text" className={inputclass} name="google_map_url" {...register("google_map_url", { required: 'This field is required' })}
                        aria-describedby="google_map_url" placeholder="Google Map Url" />
                </div>
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
