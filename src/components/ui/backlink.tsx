import Link, { LinkProps } from "next/link";
import { Icon } from "./icon";

export interface BackLinkProps extends LinkProps {
    className?: string;
    text?: string;
    reversed?: boolean;
    rel?: string;
}

export function BackLink({ className, text, reversed, rel, ...props }: BackLinkProps) {
    return (
        <Link {...props} rel={rel} className={`${className} flex items-center ${reversed ? 'flex-row-reverse' : 'flex-row'} text-gray text-lg mt-2`}>
            <Icon icon="arrow-left" className={`${reversed ? 'rotate-180 ml-2' : 'mr-2'}`} />
            <div>{text ?? 'back'}</div>
        </Link>
    );
}
