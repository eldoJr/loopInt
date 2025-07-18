// Define User interface directly to avoid import issues
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

// Static admin credentials
const ADMIN_EMAIL = 'admin@loopint.com';
const ADMIN_PASSWORD = 'admin123';

// Static admin user object
const adminUser: User = {
  id: '1',
  email: ADMIN_EMAIL,
  name: 'Admin User',
  role: 'admin',
  avatar_url: undefined,
  created_at: new Date(),
  updated_at: new Date()
};

/**
 * Static login function that only accepts the admin credentials
 */
export const staticLogin = async (email: string, password: string): Promise<User | null> => {
  // Simple validation for admin credentials
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return adminUser;
  }
  
  return null;
};