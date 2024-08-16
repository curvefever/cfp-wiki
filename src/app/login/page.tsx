'use client'

import { useFormState } from "react-dom";
import { Button } from "../../components/ui/button";
import { LoginResponse, login } from "./Login";


export default function Login() {
    const [formState, formAction] = useFormState(login, { } as LoginResponse);

	return (
		<main className="w-full min-h-screen flex justify-center content-center">
            <div className="p-5 bg-bg-dark rounded-lg h-full m-auto">
                <form action={formAction} className='flex flex-col gap-1'>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email"></input>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password"></input>
                    </div>
                    {formState.error && <div className='text-red-500 text-sm'>{formState.error}</div>}
                    <Button type='submit' className='bg-secondary hover:bg-secondary-light mt-2'>Sign in</Button>
                </form>
            </div>
        </main>
	)
}