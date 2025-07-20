import { useContext } from 'react';
import { ModalContext } from '../context/modalContext';
import type { ModalContextType } from '../context/modalTypes';

export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}