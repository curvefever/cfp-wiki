'use client'

import { FormEvent, useState } from "react";
import { Button } from "../../components/ui/button";
import { login } from "./Login";


export default function Login() {
    const [error, setError] = useState('');

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await login({
            data: {
                email: formData.get('email')?.toString() || '',
                password: formData.get('password')?.toString() || '',
            },
        });

        if (result.error) {
            setError(result.error);
            return;
        }

        window.location.href = '/';
    }

	return (
		<main className="w-full min-h-screen flex justify-center content-center">
            <div className="p-5 bg-bg-dark rounded-lg h-full m-auto">
                <form onSubmit={onSubmit} className='flex flex-col gap-1'>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email"></input>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password"></input>
                    </div>
                    {error && <div className='text-red-500 text-sm'>{error}</div>}
                    <Button type='submit' className='bg-secondary hover:bg-secondary-light mt-2'>Sign in</Button>
                </form>
            </div>
        </main>
	)
}