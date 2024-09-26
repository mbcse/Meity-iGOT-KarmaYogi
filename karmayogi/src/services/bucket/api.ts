// services/api.ts

export const submitUserInput = async (inputValue: string) => {
    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userinput: inputValue }),
    });
    if (!res.ok) throw new Error('Failed to submit user input');
    return res.json();
};

export const saveBucket = async (viewName: string, sqlQuery: string) => {
    const res = await fetch('/api/db/createview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ viewName, sqlQuery }),
    });
    if (!res.ok) throw new Error('Failed to save bucket');
    return res.json();
};

export const showViewBucket = async (viewName: string) => {
    const res = await fetch(`/api/db/showview?viewName=${viewName}`, {
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to show view bucket');
    return res.json();
};

export const fetchBuckets = async () => {
    const res = await fetch('/api/db/showviewlist');
    if (!res.ok) throw new Error('Failed to fetch buckets');
    return res.json();
};