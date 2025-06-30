import type { LucideIcon } from 'lucide-react';

export interface Stat {
  label: string;
  value: string;
}

export interface Feature {
  icon: LucideIcon;
  text: string;
}

export interface Department {
  name: DepartmentName;
  icon: LucideIcon;
  color: 'blue' | 'gray' | 'green' | 'yellow' | 'pink' | 'purple';
}

export interface DepartmentContent {
  title: string;
  description: string;
  buttonText: string;
  image: string;
  features: Feature[];
  stats: Stat[];
}

export type DepartmentName = 'IT' | 'Operations' | 'Marketing' | 'Sales' | 'Finance' | 'Customer Experience' | 'People';