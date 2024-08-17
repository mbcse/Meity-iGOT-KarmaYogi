import React from 'react';
import Navbar from '@/components/atoms/Navbar/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow overflow-y-auto">
        {children}
      </div>
    </section>
  );
}
