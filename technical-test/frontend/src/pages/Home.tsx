import React, { useContext, useEffect, useState } from 'react';
import Menu from '../components/Menu';
import ToastContext from '../context/ToastContext';
import { getUsers } from '../services/api';
import { User } from '../types/User';

export default function Home(): React.ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const toast = useContext(ToastContext);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) {
      console.error('Erreur de connexion au backend:', e);
      toast?.showError('Impossible de charger les utilisateurs. Mode démo activé.');
      setUsers([
        { id: '1', lastname: 'Dupont', firstname: 'Jean' },
        { id: '2', lastname: 'Martin', firstname: 'Marie' }
      ]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '0'
    }}>
      <Menu />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            Bienvenue ! 👋
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '30px'
          }}>
            Gérez facilement vos utilisateurs et leurs informations
          </p>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            height: '200px',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 auto',
            maxWidth: '600px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img 
              src='https://bcsolutions.fr/wp-content/uploads/2018/04/logo_bcs-250.png' 
              alt='welcome' 
              style={{ 
                maxHeight: '150px',
                filter: 'brightness(0) invert(1)',
                opacity: '0.8'
              }} 
            />
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            👥 Utilisateurs enregistrés
          </h3>
          
          {users.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
              <p style={{ fontSize: '18px' }}>Aucun utilisateur enregistré pour le moment</p>
            </div>
          ) : (
            <div style={{
              overflowX: 'auto',
              borderRadius: '15px',
              border: '1px solid #e1e5e9'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '16px'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <th style={{
                      padding: '20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '16px'
                    }}>Nom</th>
                    <th style={{
                      padding: '20px',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '16px'
                    }}>Prénom</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr 
                      key={u.id}
                      style={{
                        borderBottom: '1px solid #e1e5e9',
                        background: index % 2 === 0 ? '#f8f9fa' : 'white'
                      }}
                    >
                      <td style={{
                        padding: '20px',
                        fontWeight: '500',
                        color: '#333'
                      }}>{u.lastname}</td>
                      <td style={{
                        padding: '20px',
                        fontWeight: '500',
                        color: '#333'
                      }}>{u.firstname}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      

     
    </div>
  );
};


