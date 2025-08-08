import { query } from './db';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export const createUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const now = new Date();

  const result = await query(
    'INSERT INTO users (id, email, password, name, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING id, email, name, role, avatar_url, created_at, updated_at',
    [email, hashedPassword, name, now, now]
  );

  return result.rows[0];
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  const result = await query(
    'SELECT id, email, password, name, role, avatar_url, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) return null;

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};
