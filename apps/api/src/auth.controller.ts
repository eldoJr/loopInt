import { Controller, Post, Body, HttpException, HttpStatus, Get, Query, Res } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

@Controller('api')
export class AuthController {
  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string }) {
    const { email, password, name } = body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const now = new Date();
      
      const result = await pool.query(
        'INSERT INTO users (id, email, password, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [crypto.randomUUID(), email, hashedPassword, name, now, now]
      );
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    
    try {
      console.log('Login attempt for:', email);
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      console.log('Query result rows:', result.rows.length);
      
      if (result.rows.length === 0) {
        console.log('User not found');
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      
      const user = result.rows[0];
      console.log('User found:', user.email);
      const isValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isValid);
      
      if (!isValid) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('test')
  async test() {
    return { 
      message: 'API is working', 
      timestamp: new Date(),
      dbUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    };
  }

  @Get('auth/google/callback')
  async googleCallback(@Query('code') code: string, @Query('error') error: string, @Res() res: Response) {
    console.log('Google callback received:', { code: !!code, error });
    
    if (error || !code) {
      console.error('OAuth error or missing code:', error);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_cancelled`);
    }

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: '1075897717707-l6udtbgag9u2plju9gfu9kaljvq7ouki.apps.googleusercontent.com',
          client_secret: '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',
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${process.env.API_URL || 'http://localhost:3000'}/api/auth/google/callback`
        })
      });

      const tokens = await tokenResponse.json();
      console.log('Token response:', { hasAccessToken: !!tokens.access_token, error: tokens.error });
      
      if (tokens.error) {
        console.error('Token exchange error:', tokens.error);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=token_failed`);
      }
      
      // Get user info
      const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`);
      const googleUser = await userResponse.json();
      console.log('Google user:', { email: googleUser.email, name: googleUser.name });

      if (!googleUser.email) {
        console.error('No email from Google user');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_email`);
      }

      // Check if user exists or create new one
      let result = await pool.query(
        'SELECT id, email, name, role, avatar_url, created_at, updated_at FROM users WHERE email = $1', 
        [googleUser.email]
      );
      
      let user;
      if (result.rows.length === 0) {
        // Create new user from Google data
        const now = new Date();
        const insertResult = await pool.query(
          'INSERT INTO users (id, email, password, name, avatar_url, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, name, role, avatar_url, created_at, updated_at',
          [crypto.randomUUID(), googleUser.email, '', googleUser.name || googleUser.email.split('@')[0], googleUser.picture, 'user', now, now]
        );
        user = insertResult.rows[0];
        console.log('Created new user:', user.email);
      } else {
        // Update existing user's avatar if needed
        if (googleUser.picture && result.rows[0].avatar_url !== googleUser.picture) {
          await pool.query(
            'UPDATE users SET avatar_url = $1, updated_at = $2 WHERE email = $3',
            [googleUser.picture, new Date(), googleUser.email]
          );
          result.rows[0].avatar_url = googleUser.picture;
        }
        user = result.rows[0];
        console.log('Found existing user:', user.email);
      }
      
      // Redirect to frontend with user data
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?user=${encodeURIComponent(JSON.stringify(user))}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
    }
  }
}