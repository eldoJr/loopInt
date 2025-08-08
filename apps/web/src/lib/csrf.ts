import Cookies from 'js-cookie';

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_HEADER = 'X-CSRF-Token';

class CSRFManager {
  private token: string | null = null;

  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    this.token = token;
    Cookies.set(CSRF_TOKEN_KEY, token, {
      secure: true,
      sameSite: 'strict'
    });
    
    return token;
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = Cookies.get(CSRF_TOKEN_KEY) || null;
    }
    return this.token;
  }

  getHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { [CSRF_HEADER]: token } : {};
  }

  validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken !== null && storedToken === token;
  }

  clearToken() {
    this.token = null;
    Cookies.remove(CSRF_TOKEN_KEY);
  }
}

export const csrfManager = new CSRFManager();

// Initialize CSRF token on app start
if (typeof window !== 'undefined') {
  csrfManager.generateToken();
}