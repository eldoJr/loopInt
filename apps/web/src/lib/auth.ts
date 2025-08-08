import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthManager {
  private refreshTimer: NodeJS.Timeout | null = null;

  setTokens(tokenData: TokenData) {
    const expiryTime = Date.now() + tokenData.expiresIn * 1000;
    
    // Store in httpOnly cookies for security
    Cookies.set(TOKEN_KEY, tokenData.accessToken, {
      expires: new Date(expiryTime),
      secure: true,
      sameSite: 'strict'
    });
    
    Cookies.set(REFRESH_TOKEN_KEY, tokenData.refreshToken, {
      expires: 7, // 7 days
      secure: true,
      sameSite: 'strict'
    });
    
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    
    this.scheduleTokenRefresh(tokenData.expiresIn);
  }

  getToken(): string | null {
    return Cookies.get(TOKEN_KEY) || null;
  }

  getRefreshToken(): string | null {
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  }

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    
    return Date.now() > parseInt(expiry);
  }

  clearTokens() {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private scheduleTokenRefresh(expiresIn: number) {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    // Refresh 5 minutes before expiry
    const refreshTime = (expiresIn - 300) * 1000;
    
    this.refreshTimer = setTimeout(async () => {
      await this.refreshToken();
    }, refreshTime);
  }

  private async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const tokenData = await response.json();
        this.setTokens(tokenData);
      } else {
        this.clearTokens();
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      window.location.href = '/login';
    }
  }
}

export const authManager = new AuthManager();