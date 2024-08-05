"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { DataTable } from "@/app/settings/database/data-table";
import { columns } from "./columns";
// Modal component
const Modal = ({ tables, onClose }: { tables: any, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  ">
      <div className="bg-white p-4 rounded-lg w-3/4 max-w-2xl relative">
        <h2 className="text-xl font-semibold mb-4">Tables</h2>
        <Button variant={'ghost'} onClick={onClose} className="absolute top-2 right-2">
          <X size={24} />
        </Button >

        <div className="h-[300px] max-h-[300px] overflow-auto">
          {tables && (
            <Tabs defaultValue={Object.keys(tables)[0]} className="w-full">
              <TabsList>
                {Object.keys(tables).map((tableName, index) => (
                  <TabsTrigger key={index} value={tableName}>
                    {tableName}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.keys(tables).map((tableName, index) => (
                <TabsContent key={index} value={tableName}>

                  <DataTable columns={columns} data={tables[tableName]} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>

        <div className="flex flex-right bg-red-100">
          <Button>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const TagInput = ({ tags, setTags }: { tags: string[], setTags: React.Dispatch<React.SetStateAction<string[]>> }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (inputValue.trim() !== '') {
        setTags([...tags, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type URL and press space or enter to add"
      />
      <div className="flex flex-wrap gap-3 my-4">
        {tags.map((tag, index) => (
          <div key={index} className="rounded-2xl bg-primary gap-3 text-white px-4 py-1 
          flex items-center justify-between">
            {tag}
            <X size={16} className="cursor-pointer" onClick={() => handleDelete(index)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Page() {
  const [externalDbUrls, setExternalDbUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [tables, setTables] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentUrl(e.target.value);
  };

  const handleSaveExternalDbUrls = async () => {
    try {
      const response = await fetch('/api/selecttables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dblink: currentUrl }),
      });
      const data = await response.json();
      console.log(data);
      setTables(data); // Adjust based on API response structure
      setExternalDbUrls(prev => [...prev, currentUrl]);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>External Database Setup</CardTitle>
          <CardDescription>
            URLs to connect to the external database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input
              type="text"
              value={currentUrl}
              onChange={handleInputChange}
              placeholder="Enter External DB URL"
            />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSaveExternalDbUrls}>Show Tables</Button>
        </CardFooter>
      </Card>

      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>Internal Database Setup</CardTitle>
          <CardDescription>
            URL to connect to the internal database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="Internal DB URL" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>

      {isModalOpen && <Modal tables={tables} onClose={handleCloseModal} />}
    </div>
  );
}
