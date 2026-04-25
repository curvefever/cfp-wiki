"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Popup from "../../../../components/Popup";
import { Button } from "../../../../components/ui/button";
import { usePopupsContext } from "../../../../components/overlays/PopupProvider";
import type { Page } from "../../pages.types";
import { editPageDetails } from "../../server/pages.server-fns";

export default function EditPageDetailsPopup({ page }: { page: Page }) {
  const { dispatch } = usePopupsContext();
  const [formData, setFormData] = useState({
    title: page.title,
    description: page.description,
    next_link: page.next_link,
  });
  const [error, setError] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = await editPageDetails({
      data: { pageSlug: page.slug, details: formData },
    });
    if (result.error) {
      setError(result.error);
      return;
    }

    dispatch({ type: "removePopup" });
    window.location.reload();
  }

  return (
    <Popup title="Edit Page Details" minWidth={500}>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={onChange}
          required
          className="mb-1"
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="min-w-[500px]"
          value={formData.description}
          onChange={onChange}
          required
        />
        <label htmlFor="next_link">Next link</label>
        <input
          id="next_link"
          name="next_link"
          type="text"
          value={formData.next_link}
          onChange={onChange}
          className="mb-1"
        />
        {error && <p className="text-danger">{error}</p>}
        <Button color="secondary" className="mt-3" type="submit">
          Save Changes
        </Button>
      </form>
    </Popup>
  );
}
