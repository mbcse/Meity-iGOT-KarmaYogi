"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, RectangleEllipsis } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { urlConstructor } from '@/lib/utils';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error before submitting

    try {
      const response = await fetch(urlConstructor('/auth/signin'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send cookies with the request
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          router.push('/'); // Redirect on successful login
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className='py-8 px-2 bg-[#262626] text-white rounded-r-lg w-full flex items-center justify-center'>
      <div className='flex flex-col gap-3'>
        <h1 className='font-bold text-2xl my-3'>Let&apos;s get you started!</h1>

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
                required
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
                required
              />
            </div>
          </div>

          <Button type="submit" aria-label="login button" className='bg-[#5456DB]' disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          {error && <p className="text-red-500">Error: {error}</p>} {/* Error message display */}

          <div className='italic'>
            Don&apos;t have an account?
            <Button variant='link' className='text-white hover:text-gray-300' aria-label="create account button">
              <Link href={'/signup'}>
                Create an account
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
