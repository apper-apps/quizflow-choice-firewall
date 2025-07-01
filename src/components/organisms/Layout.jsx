import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout