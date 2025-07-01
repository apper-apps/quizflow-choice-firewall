import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

const Layout = () => {
  const location = window.location;
  const isBuilder = location.pathname.includes('/builder');
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className={isBuilder ? '' : 'pt-16'}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout