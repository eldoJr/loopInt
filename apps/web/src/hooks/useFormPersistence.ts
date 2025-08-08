import { useEffect } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';

import type { FieldValues } from 'react-hook-form';

interface UseFormPersistenceProps<T extends FieldValues> {
  key: string;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  exclude?: (keyof T)[];
}

export const useFormPersistence = <T extends Record<string, any>>({
  key,
  watch,
  setValue,
  exclude = []
}: UseFormPersistenceProps<T>) => {
  const watchedValues = watch();

  // Save form data to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      const filteredData = Object.keys(data).reduce((acc, field) => {
        if (!exclude.includes(field as keyof T)) {
          acc[field] = data[field];
        }
        return acc;
      }, {} as any);
      
      localStorage.setItem(`form_${key}`, JSON.stringify(filteredData));
    });

    return () => subscription.unsubscribe();
  }, [watch, key, exclude]);

  // Load form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`form_${key}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach((field) => {
          setValue(field as any, parsedData[field]);
        });
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    }
  }, [key, setValue]);

  const clearPersistedData = () => {
    localStorage.removeItem(`form_${key}`);
  };

  return { clearPersistedData };
};