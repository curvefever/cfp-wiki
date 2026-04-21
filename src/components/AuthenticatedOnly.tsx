'use client'

import { Session } from '@supabase/supabase-js';
import { type ReactNode, useEffect, useState } from 'react';
import { createSupbaseBrowserClient } from '../supabase-client';

export default function AuthenticatedOnly({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const supabase = createSupbaseBrowserClient();
        let isMounted = true;

        supabase.auth.getSession().then(({ data }) => {
            if (isMounted) {
                setSession(data.session);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    if (!session) {
        return null;
    }

    return <>{children}</>;
}