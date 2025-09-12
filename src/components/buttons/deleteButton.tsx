// components/buttons/DeleteButton.tsx
import ButtonWithSpinner from '../buttonWithSpinner';
import { FiTrash } from 'react-icons/fi';

interface DeleteButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  loading = false, 
  disabled = false, 
  onClick,
  children = 'Supprimer' 
}) => {
  return (
    <ButtonWithSpinner
      loading={loading}
      disabled={disabled}
      variant="danger"
      type="button"
      icon={FiTrash}
      onClick={onClick}
    >
      {children}
    </ButtonWithSpinner>
  );
};