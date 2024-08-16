import { Icons } from "../../svg/Icons";

interface IIconProps {
    className?: string;
    icon: keyof typeof Icons;
}

export function Icon(props: IIconProps) {
    return (
        <span className={props.className}>
            {Icons[props.icon]}
        </span>
    );
}
