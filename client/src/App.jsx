import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Error from './pages/Error';
import Header from './components/Header';
import Footer from './components/Footer';
import Month from './pages/Month';
// import Sidebar from './components/Sidebar';

function AppContent() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
        <div className="flex-grow flex flex-col">
          <main className="flex grow">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/month" element={<Month />} />
              <Route path="/login" element={<CenteredLayout><Login /></CenteredLayout>} />
              <Route path="/register" element={<CenteredLayout><Register /></CenteredLayout>} />
              <Route path="*" element={<CenteredLayout><Error /></CenteredLayout>} />
            </Routes>
          </main>
      </div>
      <Footer />
    </div>
  );
}

function CenteredLayout({ children }) {
  return (
    <div className="flex items-center justify-center flex-grow">
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;