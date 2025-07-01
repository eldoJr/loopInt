export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

// Mock authentication for demo purposes
export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  if (existingUsers.find((u: User) => u.email === email)) {
    throw new Error('Email already exists');
  }
  
  // Create new user
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    name,
    role: 'user',
    created_at: new Date(),
    updated_at: new Date()
  };
  
  // Store user and password
  existingUsers.push(newUser);
  localStorage.setItem('users', JSON.stringify(existingUsers));
  localStorage.setItem(`password_${email}`, password);
  
  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check credentials
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: User) => u.email === email);
  const storedPassword = localStorage.getItem(`password_${email}`);
  
  if (!user || storedPassword !== password) {
    return null;
  }
  
  return user;
};