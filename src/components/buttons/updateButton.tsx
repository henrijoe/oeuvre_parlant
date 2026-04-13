// components/buttons/UpdateButton.tsx
import ButtonWithSpinner from '../buttonWithSpinner';
import { FiEdit } from 'react-icons/fi';

interface UpdateButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const UpdateButton: React.FC<UpdateButtonProps> = ({ 
  loading = false, 
  disabled = false, 
  children = 'Modifier' 
}) => {
  return (
    <ButtonWithSpinner
      loading={loading}
      disabled={disabled}
      variant="success"
      type="submit"
      icon={FiEdit}
    >
      {children}
    </ButtonWithSpinner>
  );
};