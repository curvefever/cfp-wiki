export function Container({children, ...props}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props} className={"p-3 lg:p-10 rounded-lg bg-bg-light bg-[linear-gradient(110deg,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0.04)_100%)] border-2 border-[#29343C] " + props.className}>
            {children}
        </div>
    );
}
