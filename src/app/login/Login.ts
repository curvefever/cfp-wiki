import { createServerFn } from "@tanstack/react-start";

export type LoginResponse = {
    error?: string;
};

export const login = createServerFn({ method: 'POST' })
    .inputValidator((data: { email: string; password: string }) => data)
    .handler(async ({ data }): Promise<LoginResponse> => {
    const email = data.email;
    const password = data.password;

    const { createSupbaseServerClient } = await import("../../supabase-server");
    const supabase = await createSupbaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return { error: error.message };
    }
    return {};
});