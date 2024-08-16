'use server';
import { redirect } from "next/navigation";
import { createSupbaseServerClient } from "../../supabase-server";

export type LoginResponse = {
    error?: string;
};

export async function login(prevState: LoginResponse, formData: FormData) {
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    const supabase = await createSupbaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return { error: error.message };
    }
    return redirect('/');
}