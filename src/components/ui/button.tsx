import * as React from "react"

const colorVariants = {
  primary: "bg-primary hover:bg-primary-light shadow-primary-dark",
  secondary: "bg-secondary hover:bg-secondary-light shadow-secondary-dark",
  danger: "bg-danger hover:bg-danger-light shadow-danger-dark",
  success: "bg-success hover:bg-success-light shadow-success-dark",
}

const sizeVariants = {
  xs: "text-xs px-2 py-0.5",
  sm: "text-sm px-2 py-1",
  md: "text-md px-4 py-2",
  lg: "text-lg px-8 py-3",
  xl: "text-2xl px-10 py-3",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
}

export function Button({children, className, color, size, href, ...props}: ButtonProps) {
  const button = <button {...props} className={`active:scale-95 inline-flex w-max items-center justify-center rounded-md font-bold text-white shadow-[0_2px_0_0] ${colorVariants[color || 'primary']} ${sizeVariants[size || 'md']} ${className}`}>
    {children}
  </button>;
  return href ? <a href={href}>{button}</a> : button;
}
