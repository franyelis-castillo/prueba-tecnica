import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Panel from './pages/Panel'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Redirección automática */}
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/panel"
        element={
          <ProtectedRoute>
            <Panel />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App