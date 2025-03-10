import React from 'react'
import { useParams } from 'react-router-dom'
export default function AlumniPage() {
  const { id } = useParams()

  return (
    <div className='bg-gray-950 bg-linear-to-t from-blue-950 to-gray-950'>
      {id}
    </div>
  )
}
