"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
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
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(urlConstructor('/auth/signin'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          router.push('/');
        }
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        // Handle login error (show message to user, etc.)
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle network error
    }
  };

  return (
    <div className='py-8 px-2 bg-[#262626] text-white rounded-r-lg w-full flex items-center justify-center'>
      <div className='flex flex-col gap-3'>
        <h1 className='font-bold text-2xl my-3'>
          Let&apos;s get you started!
        </h1>

        <form className='flex flex-col gap-3' aria-label="login form" onSubmit={handleSubmit}>
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

          <Button type="submit" aria-label="login button" className='bg-[#5456DB]'>
            Login
          </Button>

          <div>
            {/* Uncomment if you want to add a forgot password link */}
            {/* <div className='italic'>
              Forgot your password?
              <Button variant='link' className='text-white hover:text-gray-300' aria-label="forgot password button">
                Forgot my password
              </Button>
            </div> */}

            <div className='italic'>
              Don&apos;t have an account?
              <Button variant='link' className='text-white hover:text-gray-300' aria-label="create account button">
                <Link href={'/signup'}>
                  Create an account
                </Link>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
