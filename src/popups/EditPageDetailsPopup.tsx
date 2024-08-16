'use client';
import { ChangeEvent, FormEvent, useState } from 'react';
import Popup from '../components/Popup'
import { Button } from '../components/ui/button';
import { IPage } from '../features/pages/IPage';
import { usePopupsContext } from '../app/Popups';
import { editPageDetails } from '../app/[slug]/edit/functions/EditPageDetails';

interface IProps {
    page: IPage;
}

export default function EditPageDetailsPopup({ page }: IProps) {
  const { dispatch } = usePopupsContext();
  const [formData, setFormData] = useState({ title: page.title, description: page.description });
  const [error, setError] = useState('');

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = await editPageDetails(page.slug, formData);
    if (result.error) {
      setError(result.error);
      return;
    }

    dispatch({ type: 'removePopup' });
  }
  
  return (
    <Popup title="Edit Page Details" minWidth={500}>
        <form onSubmit={onSubmit}>
          <label htmlFor="title">Title</label>
          <input id="title" name='title' type="text" value={formData.title} onChange={onChange} required className='mb-1' />
          <label htmlFor="description">Description</label>
          <textarea id="description" name='description' value={formData.description} onChange={onChange} required />
          {error && <p className='text-danger'>{error}</p>}
          <Button color="secondary" className='mt-3' type='submit'>Save Changes</Button>
        </form>
    </Popup>
  )
}
