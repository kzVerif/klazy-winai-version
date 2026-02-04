import LoginForm from '@/components/Auth/LoginForm'
import React from 'react'

export default function page() {
  return (
    <div className='header container'>
      <div className='flex flex-col items-center justify-center'>
          <h1 className='text text-3xl font-semibold text'>เข้าสู่ระบบ</h1>
          <LoginForm/>
      </div>
    </div>
  )
}
