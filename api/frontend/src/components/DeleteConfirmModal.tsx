import React from 'react';
import './DeleteConfirmModal.css';

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
};

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, userName }: DeleteConfirmModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className='dc-overlay'>
      <div className='dc-modal'>
        <div className='dc-icon'>⚠️</div>
        
        <h2 className='dc-title'>
          Confirmer la suppression
        </h2>
        
        <p className='dc-text'>
          Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userName}</strong> ?
          <br />
          <span className='dc-danger'>
            Cette action est irréversible.
          </span>
        </p>

        <div className='dc-actions'>
          <button
            onClick={onClose}
            className='dc-btn dc-cancel'
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className='dc-btn dc-confirm'
          >
            🗑️ Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}


