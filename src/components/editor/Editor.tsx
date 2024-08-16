'use client';

import { useState } from "react";
import { Button } from "../ui/button";
import { IPage } from "../../features/pages/IPage";
import dynamic from "next/dynamic";
import { useEffect } from 'react';
import { User } from "@supabase/supabase-js";
import { saveEditorChanges } from "../../app/[slug]/edit/functions/SaveEditorChanges";
import { discardEditorChanges } from "../../app/[slug]/edit/functions/DiscardEditorChanges";

const ForwardRefEditor = dynamic(() => import('./InitializedMDXEditor'), 
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);
ForwardRefEditor.displayName = "ForwardRefEditor";

export default function Editor({ page, user }: { page: IPage, user: User }) {
	const [content, setContent] = useState(page.content);
    const [isEditorLoaded, setIsEditorLoaded] = useState(false);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadEditor = async () => {
            await import('./InitializedMDXEditor');
            setIsEditorLoaded(true);
        };
        loadEditor();
    }, []);

    if (!isEditorLoaded) {
        return <p>Loading editor...</p>;
    }

    async function saveChanges() {
        const res = await saveEditorChanges(page, content, summary, user.email || 'unknown');
        if (res && res.error) {
            setError(res.error);
        }
    }
    
    return <div>
        <ForwardRefEditor markdown={page.content} onChange={setContent} />

        <div className="mt-3">
            <label htmlFor="summary">Edit Summary (please describe what you changed)</label>
            <input id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <div className="flex mt-5 gap-3 justify-end">
            <Button color="danger" onClick={() => discardEditorChanges(page)}>Discard Changes</Button>
            <Button color="secondary" onClick={saveChanges}>Save Changes</Button>
        </div>
    </div>;
}
