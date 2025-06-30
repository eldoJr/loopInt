import { Github, Linkedin, Instagram, Mail, ArrowRight } from "lucide-react";
import logoImg from "../../assets/img/logo/logo-b.svg";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-16 border-t border-gray-800/50">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col items-center md:items-start">
          <a href="#" className="flex items-center group mb-4">
            <img src={logoImg} alt="Firmbee Logo" className="h-10 w-auto" />
          </a>
          <p className="text-gray-400 mb-6 text-center md:text-left max-w-sm">
            Transform your business operations with our comprehensive management platform. Streamline, automate, and grow.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-gray-800/50 rounded-lg hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 group">
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 hover:text-white transition-all duration-300 group">
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="p-2 bg-gray-800/50 rounded-lg hover:bg-pink-500/20 hover:text-pink-400 transition-all duration-300 group">
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        <div className="flex flex-col text-center md:text-left">
          <h3 className="text-lg font-bold mb-4 text-white">Solutions</h3>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors mb-2">Project Management</a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors mb-2">CBM Tools</a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors mb-2">Financial Suite</a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors mb-2">HRMS Platform</a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Integrations</a>
        </div>

        <div className="flex flex-col text-center md:text-left">
          <h3 className="text-lg font-bold mb-4 text-white">Company</h3>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors mb-2">About Us</a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors mb-2">Careers</a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors mb-2">Contact</a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors mb-2">Security</a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Partners</a>
        </div>

        <div className="flex flex-col text-center md:text-left">
          <h3 className="text-lg font-bold mb-4 text-white">Stay Updated</h3>
          <p className="text-gray-400 mb-4 text-sm">
            Get the latest updates and insights delivered to your inbox.
          </p>
          <form className="flex flex-col space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
            >
              <span>Subscribe</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-12 border-t border-gray-800/50 pt-8 max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        <p>&copy; 2025 Firmbee. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
          <span>|</span>
          <a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}