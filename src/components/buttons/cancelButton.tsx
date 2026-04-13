// components/buttons/CancelButton.tsx
import ButtonWithSpinner from '../buttonWithSpinner';
import { FiX } from 'react-icons/fi';

interface CancelButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const CancelButton: React.FC<CancelButtonProps> = ({ 
  loading = false, 
  disabled = false, 
  onClick,
  children = 'Annuler' 
}) => {
  return (
    <ButtonWithSpinner
      loading={loading}
      disabled={disabled}
      variant="secondary"
      type="button"
      icon={FiX}
      onClick={onClick}
    >
      {children}
    </ButtonWithSpinner>
  );
};