import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FetchCMSByType, UpdateAuthCMS } from '../../../apis/cms.api';
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

export default function AuthCMS() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const onSubmit = async (body) => {
        try {
            var response = await UpdateAuthCMS(body)
            console.log('submit resp', response.data);
            toast_popup('Submitted Successfully', 'success')
        }
        catch(err) {
            toast_popup(err?.response?.data?.message || err.message, 'error')
        }
    }

    useEffect(() => {
        (async function() {
            var response = await FetchCMSByType('auth_record');
            console.log('respponse', response.data)
            var result = response.data;
            if(result.success && result.result) {
                var obj = result.result;
                var keys = Object.keys(obj);
                for(const key of keys) {
                    setValue(key, obj[key], { shouldValidate: true });
                }
            }
        })()
    }, [])

  return (
    <div className=''>
        <h1 className=' mb-6 md:mb-12 text-xl md:text-2xl lg:text-3xl font-bold font-bold'>Auth</h1>
        <div className=''>
        <div className=' w-full md:w-full lg:w-2/3'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-6">
                <label className="font-bold">Login Title <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.login_title?.message}</span>
                <input type="text" className={inputclass} name="login_title" {...register("login_title", { required: 'This field is required' })}
                    aria-describedby="login_title" placeholder="login title" />
            </div>
            <div className="form-group mb-6">
                <label className="font-bold">Login Description <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.login_description?.message}</span>
                <textarea type="text" className={inputclass} name="login_description" {...register("login_description", { required: 'This field is required' })}
                    aria-describedby="login_description" placeholder="login description" />
            </div>
            <div className="form-group mb-6">
                <label className="font-bold">Register Title <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.register_title?.message}</span>
                <input type="text" className={inputclass} name="register_title" {...register("register_title", { required: 'This field is required' })}
                    aria-describedby="register_title" placeholder="register title" />
            </div>
            <div className="form-group mb-6">
                <label className="font-bold">Register Description <span className='text-red-600'>*</span></label>
                <span className='text-red-600 md:ml-4'>{errors?.register_description?.message}</span>
                <textarea type="text" className={inputclass} name="register_description" {...register("register_description", { required: 'This field is required' })}
                    aria-describedby="register_description" placeholder="register description" />
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
