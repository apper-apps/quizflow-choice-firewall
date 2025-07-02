import React from 'react'
import { useParams } from 'react-router-dom'
import QuizBuilder from '@/components/organisms/QuizBuilder'
import Error from '@/components/ui/Error'

class QuizBuilderErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('QuizBuilder Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Error
          title="Quiz Builder Error"
          message="Something went wrong while loading the quiz builder. Please try refreshing the page."
          onRetry={() => {
            this.setState({ hasError: false, error: null })
            window.location.reload()
          }}
        />
      )
    }

    return this.props.children
  }
}

const Builder = () => {
  const { quizId } = useParams()
  
  return (
    <div>
      <QuizBuilderErrorBoundary>
        <QuizBuilder quizId={quizId} />
      </QuizBuilderErrorBoundary>
    </div>
  )
}

export default Builder