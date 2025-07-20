import { createContext } from 'react';

export interface ModalContextType {
  showNewIssueModal: boolean;
  openNewIssueModal: () => void;
  closeNewIssueModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);