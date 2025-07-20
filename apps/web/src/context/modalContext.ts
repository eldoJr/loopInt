import { createContext } from 'react';
import type { ModalContextType } from './modalTypes';

// Create the context
export const ModalContext = createContext<ModalContextType | undefined>(undefined);