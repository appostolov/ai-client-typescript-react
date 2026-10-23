import Node from './components/Node'
import Router from './features/layout/Router'

function App() {
  return (
    <Node config={Router()} />
  )
}

export default App
