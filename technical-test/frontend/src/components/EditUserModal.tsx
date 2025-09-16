import React, { useEffect, useState } from 'react';
import './EditUserModal.css';

type EditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: { lastname: string; firstname: string }) => void;
  user: { lastname?: string; firstname?: string } | null;
};

export default function EditUserModal({ isOpen, onClose, onSave, user }: EditUserModalProps): React.ReactElement | null {
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');

  useEffect(() => {
    if (user) {
      setLastname(user.lastname || '');
      setFirstname(user.firstname || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastname.trim() || !firstname.trim()) {
      return;
    }
    onSave({ lastname: lastname.trim(), firstname: firstname.trim() });
  };

  const handleClose = () => {
    setLastname('');
    setFirstname('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <div className='modal-header'>
          <h2 className='modal-title'>
            ✏️ Modifier l'utilisateur
          </h2>
          <button className='modal-close' onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Nom</label>
            <input
              type='text'
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder='Entrez le nom'
              className='text-input'
              autoFocus
            />
          </div>

          <div className='form-group'>
            <label>Prénom</label>
            <input
              type='text'
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder='Entrez le prénom'
              className='text-input'
            />
          </div>

          <div className='modal-actions'>
            <button type='button' onClick={handleClose} className='btn btn-secondary'>
              Annuler
            </button>
            <button type='submit' disabled={!lastname.trim() || !firstname.trim()} className='btn btn-primary'>
              💾 Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


