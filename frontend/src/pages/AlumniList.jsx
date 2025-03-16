import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Link, useLoaderData } from 'react-router-dom';
import {Button} from '@/components/ui/button.jsx';

export default function AlumniList() {
  const Alumni= useLoaderData();
  
  return (
    <div className='bg-gray-900 min-h-screen'>
      <div className='text-5xl font-semibold text-zinc-100 px-16 py-6'>Alumni</div>
      <div className='flex flex-col  rounded-t-xl mx-20 mt-8 mb-2'>
        <div className='flex flex-row'>
          <button className='bg-white/15 hover:bg-white/20 active:bg-white/10 duration-200 rounded-tl-xl flex-none place-content-center font-semibold text-zinc-200 px-4 py-2'><Search /></button>
          <input type="text" className='w-full focus:outline-none bg-white/15 rounded-tr-xl text-zinc-200 p-4' placeholder='Search for alumni' />
        </div>
        <ul>
          {Alumni?.map((alumni) => (
            <Link key={alumni.id} to={`/${alumni.id}`}>
              <li className="flex items-center active:bg-white/10 active:scale-[.994] hover:bg-white/20 duration-200 border border-stone-800 p-4">
                <div className="rounded-full flex-none overflow-hidden text-zinc-200">
                  <img src={`http://127.0.0.1:8000/${alumni.dp}`} className="size-18 object-cover object-center" alt={`${alumni.name}'s profile picture`} />                
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pl-5 w-full">
                  <div className="font-medium text-2xl text-zinc-200">{alumni.name} <span className='text-zinc-400 font-medium text-sm'>{alumni.batch}</span></div>
                </div>
                <div className='basis-[30%] flex flex-wrap'>
                  {typeof alumni.domains === 'string' 
                  ?<div className="text-zinc-200 rounded-full bg-white/15 place-self-center h-fit m-1 px-2">{alumni.domains}</div> 
                  : alumni.domains.map((domain, index) => (
                    <div key={index} className="text-zinc-200 rounded-full bg-white/15 place-self-center h-fit m-1 px-3">{domain}</div>
                  ))}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <div className='flex place-self-center bg-white/15 rounded-lg mb-8 '>
        <button className='hover:bg-white/20 duration-200 rounded-lg active:bg-white/10'>
          <ChevronLeft className='text-zinc-200' size={40} />
        </button>
        <div className='text-lg text-zinc-200 place-content-center px-4'>Page No.</div>
        <button className='hover:bg-white/20 duration-200 rounded-lg active:bg-white/10'>
          <ChevronRight className='text-zinc-200' size={40} />
        </button>
      </div>
    </div>
  )
}
