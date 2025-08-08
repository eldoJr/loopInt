import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import logoImg from '../assets/img/logo/logo-b.svg';

const Register = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleRegisterClick = () => {
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Account Created!</h1>
            <p className="text-gray-400 mb-6">Welcome to Loopint! Your account is ready.</p>
            <button
              onClick={() => navigate.goTo('/login')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Sign In Now
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl p-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src={logoImg} alt="Loopint Logo" className="h-12 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Registration Disabled</h1>
          <p className="text-gray-400 mb-6">
            Registration is currently disabled in static mode.<br />
            Please use the admin account to login.
          </p>
          <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
            <p className="text-gray-300">
              <strong>Email:</strong> admin@loopint.com<br />
              <strong>Password:</strong> admin123
            </p>
          </div>
          <button
            onClick={handleRegisterClick}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            Continue Anyway
          </button>
          <div className="mt-6">
            <button 
              onClick={() => navigate.goTo('/login')}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;