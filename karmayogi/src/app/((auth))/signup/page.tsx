"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { User, RectangleEllipsis } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { urlConstructor } from '@/lib/utils';

export default function SignupPage() {
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
      const response = await fetch(urlConstructor('/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are included in the request
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          router.push('/'); // Redirect on success
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false); // Always stop loading after request
    }
  };

  return (
    <div className='py-8 px-2 bg-[#262626] text-white rounded-r-lg w-full flex items-center justify-center'>
      <div className='flex flex-col gap-3'>
        <h1 className='font-bold text-2xl my-3'>Let&apos;s get you started!</h1>
        
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

          <div className='flex gap-2 items-center'>
            <Checkbox className='border-[0.1px] border-white' required />
            By signing up, you agree to our T&C
          </div>

          <Button type="submit" aria-label="signup button" className='bg-[#5456DB]' disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>

          {error && <p className="text-red-500">Error: {error}</p>} {/* Error message display */}

          <div className='py-4 italic'>
            Have an account already? 
            <Button variant='link' className='text-white hover:text-gray-300' aria-label="sign in button">
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
