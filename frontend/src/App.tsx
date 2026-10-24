import Node from './components/Node'
import Root from './features/Root'

function App() {
  return (
    <Node config={Root()} />
  )
}

export default App
