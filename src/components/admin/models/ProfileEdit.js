import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ProfileEdit({ id, _profile }) {
    const { register, handleSubmit } = useForm();
    const [open, setOpen] = useState(false);

    const onSubmit = (data) => {
        alert(JSON.stringify(data));
    };
    return (
        <div className="">
            <Button
                className={!id ? 'float-right mb-2' : ''}
                title={'Edit Profile'}
                onClick={() => setOpen(true)}
            >
                {'Edit'}
            </Button>

            <Modal
                centered
                title={'Edit Profile'}
                open={open}
                onOk={() => setOpen(false)}
                footer={false}
                onCancel={() => setOpen(false)}
            >
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-6">
                            <label className="font-bold">Name</label>
                            <input
                                type="text"
                                className="form-control
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                name="name"
                                {...register('name')}
                                aria-describedby="name"
                                placeholder="name"
                                required
                                defaultValue={_profile?.name || ''}
                            />
                        </div>
                        <div className="form-group mb-6">
                            <label className="font-bold">Email</label>
                            <input
                                type="text"
                                className="form-control
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
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                name="email"
                                {...register('email')}
                                aria-describedby="email"
                                placeholder="email"
                                required
                                defaultValue={_profile?.email || ''}
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
            </Modal>
        </div>
    );
}
