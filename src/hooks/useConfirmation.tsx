import { useModal } from '../contexts/ModalContext';
import ConfirmationModalContent from '../components/ConfirmationModalContent';

interface ConfirmationOptions {
  title: string;
  message: string;
  type?: 'delete' | 'warning' | 'danger' | 'approve';
  itemType?: 'customer' | 'site' | 'chemical' | 'instrument' | 'order' | 'test' | 'generic';
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

export const useConfirmation = () => {
  const { openModal, closeModal } = useModal();

  const confirm = (options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const handleConfirm = () => {
        resolve(true);
      };

      const handleCancel = () => {
        resolve(false);
        closeModal();
      };

      openModal(
        <ConfirmationModalContent
          {...options}
          onConfirm={handleConfirm}
        />,
        {
          size: options.size || 'md',
          showCloseButton: false, // We handle close in the content
          backdropClosable: true,
        }
      );
    });
  };

  const confirmDelete = (itemName: string, itemType?: ConfirmationOptions['itemType']): Promise<boolean> => {
    return confirm({
      title: 'Delete Item',
      message: `Are you sure you want to delete "${itemName} ?`,
      type: 'delete',
      itemType: itemType || 'generic',
      itemName,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
  };

  const confirmAction = (title: string, message: string, confirmText = 'Confirm'): Promise<boolean> => {
    return confirm({
      title,
      message,
      type: 'warning',
      confirmText,
      cancelText: 'Cancel'
    });
  };

  return {
    confirm,
    confirmDelete,
    confirmAction,
  };
};

export default useConfirmation; 