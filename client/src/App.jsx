import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Error from './pages/Error';
import Header from './components/Header';
import Footer from './components/Footer';
import Month from './pages/Month';
import Day from './pages/Day';
import Year from './pages/Year'
// import Sidebar from './components/Sidebar';
import { AxiosInterceptor } from './services/index'

function AppContent() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/month" element={<Month />} />
              <Route path="/day" element={<Day />} />
              <Route path="/year" element={<Year />} />
              {/* <Route path="/day" element={<Day date={new Date()} />} /> */}
              <Route path="*" element={<Error />} />
            </Routes>
          </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AxiosInterceptor />
      <AppContent />
    </Router>
  );
}
export default App;