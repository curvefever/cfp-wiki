import { usePopupsContext } from "../app/Popups";
import { Icon } from "./ui/icon";

interface IProps {
    title: string;
    minWidth?: number;
    minHeight?: number;
    children: React.ReactNode;
}

export default function Popup({ title, minWidth, minHeight, children }: IProps) {
    const { dispatch } = usePopupsContext();
    const onClose = () => {
        dispatch({ type: 'removePopup' });
    }
  return (
    <div className="fixed w-screen h-screen left-0 top-0 z-10 flex items-center justify-center">
        <div onClick={onClose} className='bg-[rgba(0,0,0,0.5)] backdrop-blur w-screen h-screen absolute left-0 top-0 z-1'></div>
        <div className='bg-bg z-10 rounded-sm'>
            <div className="bg-primary h-8 relative flex items-center px-5 text-lg font-bold rounded-tl-sm rounded-tr-sm">
                {title}
                <div onClick={onClose} className="bg-danger hover:bg-danger-light active:scale-95 h-7 p-2 m-1 rounded-md cursor-pointer absolute right-0">
                    <Icon icon="cross" />
                </div>
            </div>
            <div className={`min-w-[${minWidth || 400}px] min-h-[${minHeight || 250}px] p-5`}>
                {children}
            </div>
        </div>
    </div>
  )
}
