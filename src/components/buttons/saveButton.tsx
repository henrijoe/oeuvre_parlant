// components/buttons/SaveButton.tsx
import ButtonWithSpinner from '../buttonWithSpinner';
import { FiSave } from 'react-icons/fi';

interface SaveButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void; // ← Ajouter onClick optionnel
  type?: 'button' | 'submit' | 'reset'; // ← Ajouter type optionnel
}

export const SaveButton: React.FC<SaveButtonProps> = ({ 
  loading = false, 
  disabled = false, 
  children = 'Enregistrer',
  onClick,
  type = 'submit' // ← Valeur par défaut
}) => {
  return (
    <ButtonWithSpinner
      loading={loading}
      disabled={disabled}
      variant="primary"
      type={type} // ← Utiliser le type passé en prop
      icon={FiSave}
      onClick={onClick} // ← Passer onClick
    >
      {children}
    </ButtonWithSpinner>
  );
};