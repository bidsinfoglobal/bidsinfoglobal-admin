import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

export default function AddUser() {
    const { register, handleSubmit } = useForm();
    const [searchParams] = useSearchParams();
    console.log('id', searchParams.get('id'));

    const [user, setUser] = useState(null);

    var id = searchParams.get('id');

    const onSubmit = (body) => {
        alert(JSON.stringify(body));
    };

    useEffect(() => {
        if (id) {
            // fetch user by id
            setTimeout(() => {
                setUser({
                    name: 'Arif',
                    email: 'arifmaniyar0@gmail.com',
                });
            }, 500);
        }
    }, []);

    return (
        <div className="">
            <h1 className="text-center mb-12 text-3xl font-bold">
                {id ? 'Edit' : 'Add'} User
            </h1>
            <div className="flex items-center justify-center">
                <div className="mx-auto md:w-1/2">
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
                                defaultValue={user?.name}
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
                                defaultValue={user?.email}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded shadow hover:bg-gray-200"
                            >
                                {id ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
