"use client";
import React, { FormEvent, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, Bookmark, Folder, Plus } from 'lucide-react';
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
import { useToast } from "@/components/ui/use-toast";
import { submitUserInput, saveBucket, showViewBucket, fetchBuckets } from '@/services/bucket/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Page() {
    const [inputValue, setInputValue] = useState('');
    const [response, setResponse] = useState<null | any>(null);
    const [bucketName, setBucketName] = useState('');
    const [query, setQuery] = useState('');
    const [buckets, setBuckets] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentBucket, setCurrentBucket] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // New state for dialog

    const { toast } = useToast();

    useEffect(() => {
        loadBuckets();
    }, []);

    const loadBuckets = async () => {
        try {
            const data = await fetchBuckets();
            setBuckets(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while fetching buckets.",
                variant: "destructive",
            });
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const data = await submitUserInput(inputValue);
            setResponse(data.tableData);
            setQuery(data.sqlQuery);
            setCurrentBucket(null);
        } catch (err) {
            toast({
                title: "Error",
                description: "An error occurred while processing your request.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveBucket = async () => {
        if (!bucketName.trim()) {
            toast({
                title: "Error",
                description: "Please enter a bucket name.",
                variant: "destructive",
            });
            return;
        }
        try {
            await saveBucket(bucketName, query);
            loadBuckets();
            setBucketName('');
            toast({
                title: "Success",
                description: "Bucket saved successfully.",
                variant: "default",
            });
            setIsDialogOpen(false); // Close dialog on success
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while saving the bucket.",
                variant: "destructive",
            });
        }
    };

    const handleShowViewBucket = async (viewName: string) => {
        setIsLoading(true);
        try {
            const data = await showViewBucket(viewName);
            setResponse({ result: data });
            setCurrentBucket(viewName);
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while fetching the bucket.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewBucket = () => {
        setInputValue('');
        setResponse(null);
        setQuery('');
        setCurrentBucket(null);
    };

    return (
        <div className="flex flex-1 h-screen overflow-hidden">
            <aside className="w-64 bg-white border-r p-4 overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Buckets</h2>
                {buckets.map((bucket, index) => (
                    <div
                        key={index}
                        className={`py-2 px-3 flex items-center gap-2 rounded-md cursor-pointer transition-colors ${
                            currentBucket === bucket ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleShowViewBucket(bucket)}
                    >
                        <Folder size={18} />
                        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                            {bucket}
                        </span>
                    </div>
                ))}
            </aside>

            <main className="flex-1 flex flex-col p-6 overflow-hidden">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {currentBucket || 'Untitled'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={handleNewBucket}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Bucket
                        </Button>
                        {response && (
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Bookmark className="mr-2 h-4 w-4" />
                                        Save Bucket
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Save this table</DialogTitle>
                                        <DialogDescription>
                                            <Input
                                                type="text"
                                                placeholder="Enter your bucket name"
                                                value={bucketName}
                                                onChange={(e) => setBucketName(e.target.value)}
                                                className="mt-2"
                                            />
                                            <Button
                                                className="mt-4 w-full"
                                                onClick={handleSaveBucket}
                                            >
                                                Save
                                            </Button>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </header>

                <>
                    {(isLoading || response) && (
                        <div className="hover:bg-gray-100 flex items-center gap-2 p-4">
                            <Avatar>
                                <AvatarImage src="./chatbot-anim.gif" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            {isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <p>Here is your table</p>
                            )}
                        </div>
                    )}
                </>

                <div className="flex-1 overflow-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <p>Loading...</p>
                        </div>
                    ) : response ? (
                        <div className="h-full w-full border border-gray-300 rounded-md overflow-auto">
                            <div className="min-w-max">
                                <SQLTable responseData={response} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <img src="/chatholder.svg" alt="No data" className="w-32 h-32 mb-4" />
                            <p>Question the database and it will give you the answers you need!</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="relative mt-4">
                    <Input
                        type="text"
                        placeholder="Write your query here..."
                        className="pr-12 py-6 text-lg"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button
                        variant="default"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        type="submit"
                        disabled={isLoading}
                    >
                        <ChevronUp />
                    </Button>
                </form>
            </main>
        </div>
    );
}
