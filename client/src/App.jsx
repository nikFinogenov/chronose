import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Error from './pages/Error';
// import { AxiosInterceptor } from './services/index'

function AppContent() {
  return (
    <div>
      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      {/* <AxiosInterceptor /> */}
      <AppContent />
    </Router>
  );
}
export default App;