import React, { useContext, useEffect, useState } from 'react';
import Menu from '../components/Menu';
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';
import { getUsers, saveUser } from '../services/api';

export default function Account(): React.ReactElement {
  const auth = useContext(AuthContext);
  const toast = useContext(ToastContext);
  const [isSaving, setIsSaving] = useState(false);
  const [isUserAlreadySaved, setIsUserAlreadySaved] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      const user = auth?.user;
      if (user) {
        const isAlreadySaved = data.some((u) => u.lastname === user.lastname && u.firstname === user.firstname);
        setIsUserAlreadySaved(isAlreadySaved);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [auth?.user]);

  const handleSave = async () => {
    const user = auth?.user;
    if (!user) return;
    
    if (isUserAlreadySaved) {
      toast?.showWarning('Vous êtes déjà enregistré dans la base de données !');
      return;
    }
    
    setIsSaving(true);
    
    try {
      await saveUser({ lastname: user.lastname, firstname: user.firstname });
      toast?.showSuccess('Vos identifiants ont été sauvegardés avec succès !');
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast?.showError('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '0'
    }}>
      <Menu />
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            Mon compte 👤
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666'
          }}>
            Gérez vos informations personnelles
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📋 Informations personnelles
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '25px',
              borderRadius: '15px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '15px'
              }}>👤</div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '10px',
                opacity: '0.9'
              }}>Nom</h4>
              <p style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: '0'
              }}>{auth?.user?.lastname}</p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '25px',
              borderRadius: '15px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '15px'
              }}>🔒</div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '10px',
                opacity: '0.9'
              }}>Prénom</h4>
              <p style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: '0'
              }}>{auth?.user?.firstname}</p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            💾 Sauvegarde
          </h3>
          
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '30px'
          }}>
            {isUserAlreadySaved 
              ? 'Vos informations sont déjà sauvegardées dans la base de données'
              : 'Sauvegardez vos informations dans la base de données'
            }
          </p>
          
          <button 
            onClick={handleSave} 
            disabled={isSaving || isUserAlreadySaved}
            style={{ 
              padding: '16px 40px', 
              fontSize: '18px',
              fontWeight: '600',
              background: isSaving 
                ? 'linear-gradient(135deg, #ccc 0%, #999 100%)' 
                : isUserAlreadySaved
                ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: (isSaving || isUserAlreadySaved) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isSaving 
                ? '0 4px 15px rgba(0,0,0,0.2)' 
                : isUserAlreadySaved
                ? '0 4px 15px rgba(40, 167, 69, 0.4)'
                : '0 4px 15px rgba(102, 126, 234, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
          >
            {isSaving ? 'Sauvegarde...' : isUserAlreadySaved ? '✅ Déjà enregistré' : '💾 Sauvegarder mes identifiants'}
          </button>
        </div>

      </div>
    </div>
  );
}


