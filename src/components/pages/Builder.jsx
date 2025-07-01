import React from 'react'
import { useParams } from 'react-router-dom'
import QuizBuilder from '@/components/organisms/QuizBuilder'

const Builder = () => {
  const { quizId } = useParams()
  
return (
    <div>
      <QuizBuilder quizId={quizId} />
    </div>
  )
}

export default Builder