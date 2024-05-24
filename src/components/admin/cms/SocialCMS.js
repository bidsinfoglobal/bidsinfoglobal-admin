import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FetchCMSByType, UpdateSocialLinksCMS } from '../../../apis/cms.api';
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

export default function SocialCMS() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const onSubmit = async (body) => {
        try {
            var response = await UpdateSocialLinksCMS(body);
            console.log('submit resp', response.data);
            toast_popup('Submitted Successfully', 'success')
        }
        catch (err) {
            toast_popup(err?.response?.data?.message || err.message, 'error')
        }
    }

    useEffect(() => {
        (async function () {
            var response = await FetchCMSByType('social_links');
            console.log('respponse', response.data)
            var result = response.data;
            if (result.success && result.result) {
                var obj = result.result;
                var keys = Object.keys(obj);
                for (const key of keys) {
                    setValue(key, obj[key], { shouldValidate: true });
                }
            }
        })()
    }, [])

    return (
        <div className=''>
            <h1 className='mb-6 md:mb-12 text-xl md:text-2xl lg:text-3xl font-bold font-bold'>Social Links</h1>
            <div className=''>
                <div className='w-full md:w-full lg:w-2/3'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-6">
                            <label className="font-bold">Title <span className='text-red-600'>*</span></label>
                            <span className='text-red-600 md:ml-4'>{errors?.title?.message}</span>
                            <input type="text" className={inputclass} name="title" {...register("title", { required: 'This field is required' })}
                                aria-describedby="title" placeholder="Title" />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Description <span className='text-red-600'>*</span></label>
                            <span className='text-red-600 md:ml-4'>{errors?.description?.message}</span>
                            <textarea type="text" className={inputclass} name="description" {...register("description", { required: 'This field is required' })}
                                aria-describedby="description" placeholder="Description" />
                        </div>
                        <div className='grid md:grid-cols-2 gap-2'>
                            <div className="form-group mb-6">
                                <label className="font-bold">Twitter </label>
                                <span className='text-red-600 md:ml-4'>{errors?.twitter?.message}</span>
                                <input type="text" className={inputclass} name="twitter" {...register("twitter")}
                                    aria-describedby="twitter" placeholder="Twitter" />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Facebook </label>
                                <span className='text-red-600 md:ml-4'>{errors?.facebook?.message}</span>
                                <input type="text" className={inputclass} name="facebook" {...register("facebook")}
                                    aria-describedby="facebook" placeholder="Facebook" />
                            </div>
                        </div>
                        <div className='grid md:grid-cols-2 gap-2'>
                            <div className="form-group mb-6">
                                <label className="font-bold">Instagram </label>
                                <span className='text-red-600 md:ml-4'>{errors?.instagram?.message}</span>
                                <input type="text" className={inputclass} name="instagram" {...register("instagram")}
                                    aria-describedby="instagram" placeholder="Instagram" />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Skype </label>
                                <span className='text-red-600 md:ml-4'>{errors?.skype?.message}</span>
                                <input type="text" className={inputclass} name="skype" {...register("skype")}
                                    aria-describedby="skype" placeholder="Skype" />
                            </div>
                        </div>
                        <div className='grid md:grid-cols-2 gap-2'>
                            <div className="form-group mb-6">
                                <label className="font-bold">Linkedin </label>
                                <span className='text-red-600 md:ml-4'>{errors?.linkedin?.message}</span>
                                <input type="text" className={inputclass} name="linkedin" {...register("linkedin")}
                                    aria-describedby="linkedin" placeholder="Linkedin" />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Whatsapp </label>
                                <span className='text-red-600 md:ml-4'>{errors?.whatsapp?.message}</span>
                                <input type="text" className={inputclass} name="whatsapp" {...register("whatsapp")}
                                    aria-describedby="whatsapp" placeholder="Whatsapp" />
                            </div>
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
