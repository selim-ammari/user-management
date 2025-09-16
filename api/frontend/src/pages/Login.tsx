import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';

export default function Login(): React.ReactElement {
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const auth = useContext(AuthContext);
  const toast = useContext(ToastContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lastname || !firstname) {
      toast?.showError('Merci de renseigner le nom et le prénom');
      return;
    }
  
    try {
      await auth?.login({ lastname, firstname });
      toast?.showSuccess(`Bienvenue ${firstname} ${lastname} !`);
      navigate('/');
    } catch (err) {
      toast?.showError('Erreur lors de la connexion');
      console.error(err);
    }
  };

  return (
    <div className='login-container'>
      <div className='form-container'>
        <div style={{
          marginBottom: '30px'
        }}>
          <h2 className='login-title'>Connexion</h2>
          <p style={{
            color: '#666',
            fontSize: '16px'
          }}>Entrez vos informations pour continuer</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label className='form-label'>Nom</label>
            <input 
              value={lastname} 
              onChange={(e) => setLastname(e.target.value)} 
              placeholder='Votre nom' 
              className='form-input'
              onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e1e5e9')}
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label className='form-label'>Prénom</label>
            <input 
              type='text' 
              value={firstname} 
              onChange={(e) => setFirstname(e.target.value)} 
              placeholder='Votre prénom' 
              className='form-input'
              onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e1e5e9')}
            />
          </div>
          
          <button 
            type='submit'
            className='login-button'
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}


