import { useState } from 'react';
import type { ReactNode } from 'react';
import { ModalContext } from './modalContext';

// Provider component
function ModalProvider({ children }: { children: ReactNode }) {
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);

  const openNewIssueModal = () => setShowNewIssueModal(true);
  const closeNewIssueModal = () => setShowNewIssueModal(false);

  return (
    <ModalContext.Provider
      value={{
        showNewIssueModal,
        openNewIssueModal,
        closeNewIssueModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default ModalProvider;
