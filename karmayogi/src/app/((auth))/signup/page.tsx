"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { User, RectangleEllipsis } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { urlConstructor } from '@/lib/utils';

export default function Page() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log(urlConstructor('/'))
      console.log(formData)
      const response = await fetch(urlConstructor('/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are included in the request
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if(data){
          router.push('/')
        }
      } else {
        const errorData = await response.json();
        console.error('Signup failed:', errorData);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className='p-8 w-full flex items-center justify-center'>
      <div className='flex flex-col gap-3'>
        <h1 className='font-bold text-2xl my-3'>
          Let&apos;s get you started!
        </h1>
        
        <form className='flex flex-col gap-3' aria-label="signup form" onSubmit={handleSubmit}>
          <div className='flex flex-col max-w-md'>
            <div className='flex gap-2 items-center bg-[#565656] rounded-t-lg p-3'>
              <User className='text-white' />
              <input
                type="text"
                className='bg-[#565656] border-none outline-none flex-grow text-white'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                name="email"
              />
            </div>
            <div className='flex gap-2 items-center bg-[#565656] rounded-b-lg p-3 border-t-[0.1px] border-white'>
              <RectangleEllipsis className='text-white' />
              <input
                type="password"
                className='bg-[#565656] border-none outline-none flex-grow text-white'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                name="password"
              />
            </div>
          </div>

          <div className='flex gap-2 items-center'>
            <Checkbox className='border-[0.1px] border-white' required />
            By signing up, you agree to our T&C
          </div>

          <Button type="submit" aria-label="signup button">
            Sign Up
          </Button>
          
          <div className='py-4 italic'>
            Have an account already? 
            <Button variant='link' className='text-white hover:text-gray-300' aria-label="forgot password button">
              <Link href={'/login'}>
                Sign In now
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
