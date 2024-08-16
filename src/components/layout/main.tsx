import { ReactNode } from 'react';
import { MenuBar } from './menubar';
import { Session } from '@supabase/supabase-js';

interface IMainProps {
    session: Session | null;
    header?: ReactNode;
    menuItems?: ReactNode;
    children?: ReactNode;
 }

export function Main(props: IMainProps) {
    return (
        <>
        <MenuBar session={props.session} menuItems={props.menuItems} />
        {props.header}
        <main className="flex-1 flex justify-center p-5 py-8 md:p-10">
            <div className="flex flex-col w-full max-w-[1200px]">
                {props.children}
            </div>
        </main>
        </>
    );
}
