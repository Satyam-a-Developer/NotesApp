'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const SidebarNav = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = navRef.current;
    
    if (element) {
      const handleMouseOver = () => setIsOpen(true);
      const handleMouseLeave = () => setIsOpen(false);
      
      element.addEventListener('mouseenter', handleMouseOver);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        element.removeEventListener('mouseenter', handleMouseOver);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <div ref={navRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-slate-500/50 backdrop-blur-sm hover:bg-slate-600/50 text-white transition-all duration-300 shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`
        flex h-screen bg-white/10 backdrop-blur-md
        text-white text-xl flex-col w-72
        fixed top-0 left-0 transition-all duration-300
        border-r border-white/20
        shadow-[0_0_20px_rgba(0,0,0,0.1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <ul className="flex flex-col gap-4 items-center justify-evenly mt-16 m-5">
          <button className="bg-red-500/80 backdrop-blur-sm p-2 rounded-md w-56 
            hover:bg-red-600/80 transition-all duration-300 shadow-lg
            hover:shadow-xl hover:-translate-y-0.5">
            <Link href="/createnewnotes" className="text-white">Notes add</Link>
          </button>
          <li className="w-full text-center">
            <Link 
              href="/" 
              className="block w-full p-3 rounded-md hover:bg-white/10 
                transition-all duration-300 text-black "
            >
              Home
            </Link>
          </li>
          <li className="w-full text-center">
            <Link 
              href="/dragNdrop" 
              className="block w-full p-3 rounded-md hover:bg-white/10 
                transition-all duration-300 text-black "
            >
              Go to notes Todo app
            </Link>
            </li>
            <li className="w-full text-center">
            <Link 
              href="/Daily" 
              className="block w-full p-3 rounded-md hover:bg-white/10 
                transition-all duration-300 text-black "
            >
              Daily routines
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarNav;