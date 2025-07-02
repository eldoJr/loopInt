// Google OAuth
export const loginWithGoogle = () => {
  const clientId = 'YOUR_GOOGLE_CLIENT_ID';
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = 'openid email profile';
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}`;
  
  window.location.href = googleAuthUrl;
};

// Apple OAuth
export const loginWithApple = () => {
  const clientId = 'YOUR_APPLE_CLIENT_ID';
  const redirectUri = `${window.location.origin}/auth/apple/callback`;
  const scope = 'name email';
  
  const appleAuthUrl = `https://appleid.apple.com/auth/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_mode=form_post`;
  
  window.location.href = appleAuthUrl;
};