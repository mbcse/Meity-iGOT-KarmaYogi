"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import {User} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
      });
    
      const router = useRouter();
    
      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        try {
          const response = await fetch('/api/auth/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          if (response.ok) {
            const data = await response.json();
            if (data) {
              router.push('/');
            }
          } else {
            const errorData = await response.json();
            console.error('Password Reset Failed:', errorData);
          }
        } catch (error) {
          console.error('Error during login:', error);
        }
      };
    
  return (
    <div className='p-8 w-full flex items-center justify-center'>
      <div className='flex flex-col gap-3'>
        <h1 className='font-bold text-2xl my-3'>
          Forgot your password ?
        </h1>

        <form className='flex flex-col gap-3' aria-label="login form" onSubmit={handleSubmit}>
          <div className='flex flex-col max-w-md'>
            <div className='flex gap-2 items-center bg-[#565656] rounded-lg p-3'>
              <User className='text-white' />
              <input
                type="text"
                className='bg-[#565656] border-none outline-none flex-grow text-white'
                placeholder='email'
                value={formData.email}
                onChange={handleChange}
                name="email"
              />
            </div>
          </div>

          <Button type="submit" aria-label="login button">
            Reset My Password
          </Button>


        </form>
      </div>
    </div>
  )
}
