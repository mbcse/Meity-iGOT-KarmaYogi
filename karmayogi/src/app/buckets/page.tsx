"use client";
import React, { FormEvent, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import SQLTable from '@/components/atoms/table/SQLTable';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

export default function Page() {
    const [inputValue, setInputValue] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(false);
    const [bucketName, setBucketName] = useState('');
    const [query, setQuery] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userinput: inputValue }),
            });

            if (!res.ok) {
                throw new Error('An error occurred while processing your request.');
            }
            const data = await res.json();
            setResponse(data.tableData);
            setQuery(data.sqlQuery);
            setError(false);
        } catch (err) {
            setError(true);
            console.log('An error occurred while processing your request.');
        }
    };

    const handleSaveBucket = async () => {
        try {
            const res = await fetch('/api/db/createview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ viewName: bucketName, sqlQuery: query }),
            });

            if (!res.ok) {
                throw new Error('An error occurred while processing your request.');
            }

            console.log('Bucket Saved Successfully');
        } catch (error) {
            console.log('An error occurred while processing your request.');
        }
    };

    const showViewBucket = async (viewName: string)=>{
        try {
            const res = await fetch(`/api/db/showview?viewName=${viewName}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('An error occurred while processing your request.');
            }

            const data = await res.json();

            setResponse(data);
        } catch (error) {
            console.log('An error occurred while processing your request.');
            
        }
    }

    const [buckets, setBuckets] = useState([]);

    useEffect(() => {
        fetch('/api/db/showviewlist')
            .then((res) => res.json())
            .then((data) => setBuckets(data))
            .catch((error) => console.log('An error occurred while fetching buckets.'));
    }, []);

    return (
        <section className='flex h-screen'>
            <div className='w-1/5'>
                <div className='text-white bg-black py-6 px-4 flex gap-2 items-center font-medium hover:bg-white/80 hover:text-black cursor-pointer'>
                    Saved Buckets
                </div>
                {buckets.map((bucket: string, index: number) => (
                    <div key={index} 
                        className='py-6 px-4 flex gap-2 items-center hover:bg-gray-100 hover:text-black cursor-pointer'
                        onClick={() => showViewBucket(bucket)}
                        >
                        {bucket}
                    </div>
                ))}
            </div>
            <div className='w-4/5 p-4 flex flex-col'>
                <div className='flex-grow overflow-auto mt-4'>
                    {response ? 
                        <SQLTable responseData={response} />
                        :
                        error && <div className='mt-4 p-4 bg-red-100 text-red-800 rounded'>
                            Error: Couldn’t find anything
                        </div>
                    }
                </div>
                <form onSubmit={handleSubmit} className='mt-4'>
                    <div className='relative'>
                        <input
                            type="text"
                            placeholder='Write your message here ...'
                            className='shadow-lg rounded-2xl w-full border-[0.2px] border-gray-400 outline-none h-[60px] p-4'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button
                            variant={"default"}
                            size={"icon"}
                            className='rounded-full absolute right-4 top-1/2 transform -translate-y-1/2'
                            type="submit"
                        >
                            <ChevronUp />
                        </Button>
                        {
                            response &&
                            <Dialog>
                                <DialogTrigger>
                                    <Button className='mt-4'>Save Bucket</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Do you want to save this table?</DialogTitle>
                                        <DialogDescription>
                                            <Input
                                                type='text'
                                                placeholder='Enter your bucket name'
                                                value={bucketName}
                                                onChange={(e) => setBucketName(e.target.value)}
                                            />
                                            <Button
                                                className='mt-2'
                                                onClick={handleSaveBucket}
                                            >
                                                Save
                                            </Button>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        }
                    </div>
                </form>
            </div>
        </section>
    );
}
