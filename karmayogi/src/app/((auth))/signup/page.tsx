import React from 'react';
import AuthField from '@/components/atom/AuthField/AuthField';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
export default function Page() {
  return (
    <div className='p-8 w-full flex items-center justify-center'>
      <div className='flex flex-col gap-3'>
        <h1 className='font-bold text-2xl my-3'>
          Let's get you started!
        </h1>
        
        <form className='flex flex-col gap-3' aria-label="login form">
          <AuthField />
          
          <Button type="submit" aria-label="login button">
            Login
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
