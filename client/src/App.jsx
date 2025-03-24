import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useParams } from "react-router"
import Login from './pages/Login';
import Register from './pages/Register';
// import Main from './pages/Main';
import Error from './pages/Error';
import Header from './components/Header';
import Footer from './components/Footer';
import Month from './pages/Month';
import Day from './pages/Day';
import Year from './pages/Year';
import Week from './pages/Week';
import Loading from './components/Loading';
import Settings from './pages/UserSettings';
import ResetPassword from './pages/PasswordReset';
import EmailConfirmation from './pages/EmailConfirmation';
import InvitePage from './pages/Invite';
import { AxiosInterceptor } from './services/index';
import { fetchCurrentUser } from './services/userService'; // Импорт функции
import { userStore } from './store/userStore';
import { dateStore } from './store/dateStore';

function ViewWrapper({ Component }) {
  const { year, month, day } = useParams();
  useEffect(() => {
    if (year && month && day) {
      dateStore.updateDate(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      dateStore.today();
    }
  }, [year, month, day]);

  return <Component />;
}
function AppContent() {
  // const [user, setUser] = useState(null); // Храним пользователя
  const [loading, setLoading] = useState(true); // Флаг загрузки

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        if (!currentUser) {
          userStore.logout(); // Ensure userStore handles logout properly
          return;
        }
        userStore.setUser(currentUser);
        // userStore.user = currentUser;
        // setUser(currentUser); // Устанавливаем пользователя
      } catch (error) {
        console.error('Failed to fetch user:', error);
        userStore.logout();
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loading /></div>;
  }

  return (
    <div className='flex flex-col h-screen'>
      <Header /> {/* Передаем пользователя в Header */}
      <main className='flex flex-col flex-grow'>
        <Routes>
          <Route path='/' element={<Year />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/month' element={<Month />} />
          <Route path='/day' element={<Day />} />
          <Route path='/year' element={<Year />} />
          <Route path='/week' element={<Week />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/password-reset/:token' element={<ResetPassword />} />
          <Route path='/confirm-email/:token' element={<EmailConfirmation />} />
          <Route path='*' element={<Error />} />


          <Route path="/day/:year/:month/:day" element={<ViewWrapper Component={Day} />} />
          <Route path="/week/:year/:month/:day" element={<ViewWrapper Component={Week} />} />
          <Route path="/month/:year/:month/:day" element={<ViewWrapper Component={Month} />} />
          <Route path="/year/:year/:month/:day" element={<ViewWrapper Component={Year} />} />

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
