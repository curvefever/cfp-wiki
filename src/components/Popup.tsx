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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
        <div onClick={onClose} className='absolute inset-0 z-0 bg-[rgba(0,0,0,0.5)] backdrop-blur'></div>
        <div className='relative z-10 bg-bg rounded-sm'>
            <div className="bg-primary h-8 relative flex items-center px-5 text-lg font-bold rounded-tl-sm rounded-tr-sm">
                {title}
                <div onClick={onClose} className="bg-danger hover:bg-danger-light active:scale-95 h-7 p-2 m-1 rounded-md cursor-pointer absolute right-0">
                    <Icon icon="cross" />
                </div>
            </div>
            <div className='p-5' style={{ minWidth: minWidth || 400, minHeight: minHeight || 250 }}>
                {children}
            </div>
        </div>
    </div>
  )
}
