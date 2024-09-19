'use client'

import React from 'react'

import ChatInterface from '@/components/ai-chat'
import AQIDashboard from '@/components/dashboard'
import { LogoWithText } from '@/components/icons'

export default function Home(): JSX.Element {
  return (
    <div className='min-h-screen'>
      <header className='p-4 sm:p-6'>
        <LogoWithText height={30} />
      </header>
      <main className='flex flex-col md:flex-row p-4 sm:p-6 gap-4 sm:gap-6'>
        <div className='w-full md:w-1/2'>
          <AQIDashboard />
        </div>
        <div className='w-full md:w-1/2 mt-4 md:mt-0'>
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}
