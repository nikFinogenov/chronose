import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Error from './pages/Error';
import Header from './components/Header';
import Footer from './components/Footer';
import Month from './pages/Month';
import Sidebar from './components/Sidebar';
// import { AxiosInterceptor } from './services/index'

function AppContent() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-grow">
        <Sidebar />
        <div className="flex flex-grow">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/month" element={<Month />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
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