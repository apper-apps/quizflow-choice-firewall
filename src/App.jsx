import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Builder from '@/components/pages/Builder'
import Templates from '@/components/pages/Templates'
import Analytics from '@/components/pages/Analytics'
import Settings from '@/components/pages/Settings'
import QuizPreview from '@/components/pages/QuizPreview'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/preview/:quizId" element={<QuizPreview />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Builder />} />
            <Route path="builder" element={<Builder />} />
            <Route path="builder/:quizId" element={<Builder />} />
            <Route path="templates" element={<Templates />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-50"
        />
      </div>
    </Router>
  )
}

export default App