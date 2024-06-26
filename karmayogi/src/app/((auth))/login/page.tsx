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
          
          <div>

<div className=' italic'>
  Forgot your password? 
  <Button variant='link' className='text-white hover:text-gray-300' aria-label="forgot password button">
    Forgot my password
  </Button>
</div>

<div className=' italic'>
  Don't have an account? 
  <Button variant='link' className='text-white hover:text-gray-300' aria-label="forgot password button">
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
