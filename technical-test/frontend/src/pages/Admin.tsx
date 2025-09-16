import React, { useContext, useEffect, useState } from 'react';
import Menu from '../components/Menu';
import { getUsers, updateUser, deleteUser, updateUserRole } from '../services/api';
import { User } from '../types/User';
import ToastContext from '../context/ToastContext';
import AuthContext from '../context/AuthContext';
import EditUserModal from '../components/EditUserModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function Admin(): React.ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const toast = useContext(ToastContext);
  const auth = useContext(AuthContext);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) {
      toast?.showError('Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id: string, role: 'user' | 'admin') => {
    try {
      await updateUserRole(id, role);
      toast?.showSuccess('Rôle mis à jour');
      fetchUsers();
    } catch {
      toast?.showError('Erreur lors du changement de rôle');
    }
  };

  const handleEdit = (u: User) => {
    if (auth?.user?.role !== 'admin') return;
    setUserToEdit(u);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const user = users.find((u) => u.id === id) || null;
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete?.id) return;
    try {
      await deleteUser(userToDelete.id);
      toast?.showSuccess(`Utilisateur ${userToDelete.firstname} ${userToDelete.lastname} supprimé avec succès !`);
      fetchUsers();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast?.showError("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleSaveEdit = async (userData: { lastname: string; firstname: string }) => {
    if (!userToEdit?.id) return;
    try {
      await updateUser(userToEdit.id, userData);
      toast?.showSuccess(`Utilisateur ${userData.firstname} ${userData.lastname} modifié avec succès !`);
      fetchUsers();
      setIsEditModalOpen(false);
      setUserToEdit(null);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast?.showError("Erreur lors de la modification de l'utilisateur");
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setUserToEdit(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Menu />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: 32, marginBottom: 20 }}>Administration</h1>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                  <th style={{ textAlign: 'left', padding: 16 }}>Nom</th>
                  <th style={{ textAlign: 'left', padding: 16 }}>Prénom</th>
                  <th style={{ textAlign: 'left', padding: 16 }}>Rôle</th>
                  <th style={{ textAlign: 'center', padding: 16 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 16 }}>{u.lastname}</td>
                    <td style={{ padding: 16 }}>{u.firstname}</td>
                    <td style={{
                        padding: '20px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          justifyContent: 'center'
                        }}>
                          <button 
                            onClick={() => handleEdit(u)}
                            style={{ 
                              padding: '8px 16px', 
                              fontSize: '14px',
                              fontWeight: '500',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)'
                            }}
                            disabled={auth?.user?.role !== 'admin'}
                          >
                            ✏️ Modifier
                          </button>
                          <button 
                            onClick={() => u.id && handleDelete(u.id)}
                            style={{ 
                              padding: '8px 16px', 
                              fontSize: '14px',
                              fontWeight: '500',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)'
                            }}
                            disabled={auth?.user?.role !== 'admin'}
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: 16 }}>
                        <select
                          value={u.role || 'user'}
                          onChange={(e) =>
                            u.id && handleRoleChange(u.id, e.target.value as 'user' | 'admin')
                          }
                          disabled={u.id === 'superadmin'}
                          style={{
                            padding: '8px 16px',
                            fontSize: '14px',
                            fontWeight: '500',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            cursor: u.id === 'superadmin' ? 'not-allowed' : 'pointer',
                            backgroundColor: '#f8f9fa',
                            color: '#333',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            outline: 'none',
                          }}
                          onMouseOver={(e) => {
                            if (u.id !== 'superadmin') {
                              (e.currentTarget.style.backgroundColor = '#e9ecef');
                            }
                          }}
                          onMouseOut={(e) => {
                            if (u.id !== 'superadmin') {
                              (e.currentTarget.style.backgroundColor = '#f8f9fa');
                            }
                          }}
                        >
                          <option value="user">👤 user</option>
                          <option value="admin">⭐ admin</option>
                        </select>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        user={userToEdit}
      />
       <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        userName={userToDelete ? `${userToDelete.firstname} ${userToDelete.lastname}` : ''}
      />
    </div>
  );
}


