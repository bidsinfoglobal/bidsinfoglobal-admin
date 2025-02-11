import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FetchCMSByType, UpdateAboutUs } from '../../../apis/cms.api';
import { Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
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

export default function AboutUsCMS() {
    const [listDesc, setListDesc] = useState([]);
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        setError,
    } = useForm();

    const onSubmit = async (body) => {
        try {
            var form_data = new FormData();

            if (listDesc.length == 0) {
                setError('list_description', { message: 'list is required' });
                return;
            }

            for (var key in body) {
                var val = ['image_one', 'image_two'].includes(key)
                    ? body[key][0]
                    : body[key];
                if (val) form_data.append(key, val);
            }

            form_data.set('list_description', JSON.stringify(listDesc));

            var response = await UpdateAboutUs(form_data);
            toast_popup('Submitted Successfully', 'success');
            console.log('submit resp', response.data);
        } catch (err) {
            toast_popup(err?.response?.data?.message || err.message, 'error');
        }
    };

    useEffect(() => {
        (async function () {
            var response = await FetchCMSByType('about_us_page');
            console.log('respponse', response.data);
            var result = response.data;
            if (result.success && result.result) {
                var obj = result.result;
                var keys = Object.keys(obj).filter(
                    (k) => !['createdAt', 'updatedAt'].includes(k),
                );
                for (const key of keys) {
                    if (key == 'list_description') {
                        setListDesc(obj[key]);
                    } else {
                        setValue(key, obj[key], { shouldValidate: true });
                    }
                }
            }
        })();
    }, []);

    function handleAddListDesc() {
        var val = getValues('list_description');
        if (val && val.trim()) {
            setListDesc((ll) => [...ll, val]);
            setValue('list_description', '');
        } else {
            alert('blank not allowed');
        }
    }

    function handleDeleteListDesc(index) {
        setListDesc((ll) => {
            return ll.filter((l, i) => i != index);
        });
    }

    return (
        <div className="">
            <h1 className="mb-6 md:mb-12 text-xl md:text-2xl lg:text-3xl font-bold">
                About Us
            </h1>
            <div className="">
                <div className="w-full md:w-full lg:w-2/3">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid md:grid-cols-2 gap-2">
                            <div className="form-group mb-6">
                                <label className="font-bold">
                                    Title One <span className="text-red-600">*</span>
                                </label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.title_one?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputclass}
                                    name="title_one"
                                    {...register('title_one', {
                                        required: 'This field is required',
                                    })}
                                    aria-describedby="title_one"
                                    placeholder="title one"
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">
                                    Subtitle One <span className="text-red-600">*</span>
                                </label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.sub_title_one?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputclass}
                                    name="sub_title_one"
                                    {...register('sub_title_one', {
                                        required: 'This field is required',
                                    })}
                                    aria-describedby="sub_title_one"
                                    placeholder="subtitle one"
                                />
                            </div>
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Description Title One{' '}
                                <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.description_title_one?.message}
                            </span>
                            <textarea
                                type="text"
                                className={inputclass}
                                name="description_title_one"
                                {...register('description_title_one', {
                                    required: 'This field is required',
                                })}
                                aria-describedby="description_title_one"
                                placeholder="description title one"
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                Description One <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.description_one?.message}
                            </span>
                            <textarea
                                type="text"
                                className={inputclass}
                                name="description_one"
                                {...register('description_one', {
                                    required: 'This field is required',
                                })}
                                aria-describedby="description_one"
                                placeholder="description one"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">
                            <div className="form-group mb-6">
                                <label className="font-bold">
                                    Title Two <span className="text-red-600">*</span>
                                </label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.title_two?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputclass}
                                    name="title_two"
                                    {...register('title_two', {
                                        required: 'This field is required',
                                    })}
                                    aria-describedby="title_two"
                                    placeholder="title two"
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">
                                    Subtitle Two <span className="text-red-600">*</span>
                                </label>
                                <span className="text-red-600 md:ml-4">
                                    {errors?.sub_title_two?.message}
                                </span>
                                <input
                                    type="text"
                                    className={inputclass}
                                    name="sub_title_two"
                                    {...register('sub_title_two', {
                                        required: 'This field is required',
                                    })}
                                    aria-describedby="sub_title_two"
                                    placeholder="subtitle two"
                                />
                            </div>
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">
                                List Description <span className="text-red-600">*</span>
                            </label>
                            <span className="text-red-600 md:ml-4">
                                {errors?.list_description?.message}
                            </span>
                            <div className="flex items-center justify-between gap-2 md:gap-4">
                                <input
                                    type="text"
                                    className={inputclass}
                                    name="list_description"
                                    {...register('list_description')}
                                    aria-describedby="list_description"
                                    placeholder="list description"
                                    onChange={() =>
                                        setError('list_description', { message: '' })
                                    }
                                />
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={handleAddListDesc}
                                />
                            </div>
                            <div className="max-h-[200px] overflow-y-auto">
                                {listDesc.map((li, i) => (
                                    <div className="ring-1 ring-gray-100 my-1 w-full flex items-center justify-between gap-2 md:gap-4">
                                        <p key={i} className="text-[13px]">
                                            {li}
                                        </p>
                                        <Button
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDeleteListDesc(i)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">
                            <div className="form-group mb-6">
                                <label className="font-bold">Image One</label>
                                <input
                                    type="file"
                                    className={inputclass}
                                    name="image_one"
                                    {...register('image_one')}
                                    aria-describedby="image_one"
                                    placeholder="image one"
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label className="font-bold">Image Two</label>
                                <input
                                    type="file"
                                    className={inputclass}
                                    name="image_two"
                                    {...register('image_two')}
                                    aria-describedby="image_two"
                                    placeholder="image two"
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
            </div>
        </div>
    );
}
