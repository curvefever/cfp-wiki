'use client'

import { Button } from "../../components/ui/button"
import { IPage } from "../../features/pages/IPage";
import { usePopupsContext } from "../Popups";
import EditPageDetailsPopup from "../../popups/EditPageDetailsPopup";
import RenamePagePopup from "../../popups/RenamePagePopup";

interface IProps {
    page: IPage;
}

export default function MenuButtons({ page }: IProps) {
    const { dispatch } = usePopupsContext();

    return (
        <>
            <Button size="sm" href={`${page.slug}/edit`}>Edit Page Content</Button>
            <Button size="sm" onClick={() => dispatch({ type: "addPopup", popup: <EditPageDetailsPopup page={page} />})}>Edit Page Details</Button>
            <Button size="sm" onClick={() => dispatch({ type: "addPopup", popup: <RenamePagePopup page={page} />})}>Rename Page</Button>
            <Button size="sm" href={`${page.slug}/history`}>Show Edit History</Button>
        </>
    )
}
