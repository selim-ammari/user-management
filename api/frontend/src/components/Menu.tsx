import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';
import './Menu.css';

export default function Menu(): React.ReactElement | null {
  const auth = useContext(AuthContext);
  const toast = useContext(ToastContext);
  const navigate = useNavigate();
  if (!auth || !auth.user) return null;

  const handleLogout = () => {
    auth.logout();
    toast?.showInfo('Vous avez été déconnecté avec succès');
    navigate('/login');
  };

  return (
    <nav className='navbar'>
      <div className='navbar-inner'>
        <div className='nav-links'>
          <Link to='/' className='nav-link'>
            🏠 Accueil
          </Link>
          <Link to='/account' className='nav-link'>
            👤 Mon compte
          </Link>
          {auth.user?.role === 'admin' && (
            <Link to='/admin' className='nav-link'>
              🔧 Admin
            </Link>
          )}
        </div>
        <button onClick={handleLogout} className='logout-btn'>
          🚪 Se déconnecter
        </button>
      </div>
    </nav>
  );
}


