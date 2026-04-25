import { createServerFn } from "@tanstack/react-start";

export type LogoutResponse = {
    error?: string;
};

export const logout = createServerFn({ method: 'POST' }).handler(async (): Promise<LogoutResponse> => {
    const { createSupbaseServerClient } = await import("../../supabase-server");
    const supabase = await createSupbaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { error: error.message };
    }
    return {};
});