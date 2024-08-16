'use server';
import { redirect } from "next/navigation";
import { createSupbaseServerClient } from "../../supabase-server";

export type LogoutResponse = {
    error?: string;
};

export async function logout() {
    const supabase = await createSupbaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { error: error.message };
    }
    return redirect('/');
}