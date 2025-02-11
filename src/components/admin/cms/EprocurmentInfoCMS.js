import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FetchCMSByType, UpdateEprocurmentInfoCMS } from '../../../apis/cms.api';
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

export default function EprocurmentInfoCMS() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        setError,
    } = useForm();

    const onSubmit = async (body) => {
        try {
            if (!body.description.trim()) {
                setError('description', {
                    message: 'filec is reuqired',
                });
                return;
            }
            if (!body.drop_demo_description.trim()) {
                setError('drop_demo_description', {
                    message: 'filec is reuqired',
                });
                return;
            }
            var response = await UpdateEprocurmentInfoCMS(body);
            console.log('submit resp', response.data);
            toast_popup('Submitted Successfully', 'success');
        } catch (err) {
            toast_popup(err?.response?.data?.message || err.message, 'error');
        }
    };

    useEffect(() => {
        (async function () {
            var response = await FetchCMSByType('eprocurment_page');
            console.log('respponse', response.data);
            var result = response.data;
            if (result.success && result.result) {
                var obj = result.result;
                var keys = Object.keys(obj);
                for (const key of keys) {
                    if (typeof obj[key] == 'string')
                        setValue(key, obj[key], { shouldValidate: true });
                }
            }
        })();
    }, []);

    return (
        <div className="">
            <h1 className="mb-6 md:mb-12 text-xl md:text-2xl lg:text-3xl font-bold font-bold">
                Eprocurment Info
            </h1>
            <div className="">
                <div className="w-full md:w-full lg:w-2/3">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Title <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.title?.message}
                            </span>
                            <input
                                type="text"
                                className={inputclass}
                                name="title"
                                {...register('title', {
                                    required: 'This field is required',
                                })}
                                aria-describedby="title"
                                placeholder="Title"
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Description <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.description?.message}
                            </span>
                            <textarea
                                type="text"
                                className={inputclass}
                                name="description"
                                {...register('description', {
                                    required: 'This field is required',
                                })}
                                aria-describedby="description"
                                placeholder="Description"
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Drop Demo Title <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.drop_demo_title?.message}
                            </span>
                            <input
                                type="text"
                                className={inputclass}
                                name="drop_demo_title"
                                {...register('drop_demo_title', {
                                    required: 'This field is required',
                                })}
                                aria-describedby="drop_demo_title"
                                placeholder="drop demo title"
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Drop Demo Description{' '}
                                <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.drop_demo_description?.message}
                            </span>
                            <textarea
                                type="text"
                                className={inputclass}
                                name="drop_demo_description"
                                {...register('drop_demo_description', {
                                    required: 'This field is required',
                                })}
                                aria-describedby="drop_demo_description"
                                placeholder="drop demo description"
                            />
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
            </div>
        </div>
    );
}
