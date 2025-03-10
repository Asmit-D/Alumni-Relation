import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Link, useLoaderData } from 'react-router-dom';


export default function AlumniList() {
  const Alumni= useLoaderData();
  

  return (
    <div className='bg-gray-950 bg-linear-to-t from-blue-950 to-gray-950'>
      <div className='text-5xl font-semibold text-zinc-100 px-16 py-6'>Alumni</div>
      <div className='flex flex-col bg-white/15 rounded-3xl mx-20 mt-8 mb-2 min-h-screen'>
        <ul>
          {Alumni.map((alumni) => (
            <Link to={`/${alumni.id}`}>
              <li key={alumni.id}  className="flex items-center p-4 active:bg-white/10 active:scale-[.994] hover:bg-white/20 duration-200 rounded-3xl">
                <div className="rounded-full flex-none overflow-hidden aspect-square text-zinc-200">
                  <img src={`http://127.0.0.1:8000/${alumni.dp}`} className="size-20 object-cover object-center" alt={`${alumni.name}'s profile picture`} />                
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pl-5 w-full">
                  <div className="font-medium text-2xl text-zinc-200">{alumni.name} <span className='text-zinc-400 font-medium text-sm'>{alumni.batch}</span></div>
                </div>
                <div className='basis-[30%] flex'>
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
