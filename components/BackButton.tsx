'use client'

import { FiChevronLeft } from 'react-icons/fi'

export default function BackButton() {
  return (
    <button 
      onClick={() => window.history.back()}
      className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
    >
      <FiChevronLeft className='h-4 w-4 mr-1' />
      Back
    </button>
  )
}