'use client';
import { ChangeEvent, FormEvent, useState } from 'react';
import Popup from '../components/Popup'
import { Button } from '../components/ui/button';
import { IPage } from '../features/pages/IPage';
import { usePopupsContext } from '../app/Popups';
import { renamePage } from '../app/[slug]/edit/functions/RenamePage';

interface IProps {
    page: IPage;
}

export default function RenamePagePopup({ page }: IProps) {
    const { dispatch } = usePopupsContext();
    const [formData, setFormData] = useState({ slug: page.slug });
    const [error, setError] = useState('');
  
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    async function onSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
  
      const result = await renamePage({ data: { pageSlug: page.slug, newPageSlug: formData.slug } });
      if (result.error) {
        setError(result.error);
        return;
      }
  
      dispatch({ type: 'removePopup' });
      window.location.href = '/' + formData.slug;
    }

    return (
        <Popup title="Rename Page">
            <form onSubmit={onSubmit}>
                <label htmlFor="slug">Page slug</label>
                <input id="slug" name="slug" type="text" value={formData.slug} onChange={onChange} />
                {error && <p className='text-danger'>{error}</p>}
                <p className='text-xs mt-4'>Renaming the page will update the page link.<br/>Links on all pages will be updated.</p>
                <Button color="secondary" type='submit'>Rename Page</Button>
            </form>
        </Popup>
    )
}
