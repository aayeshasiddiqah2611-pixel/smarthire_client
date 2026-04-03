import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Menu, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const [isDark, setIsDark] = React.useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <nav className="bg-white/80 dark:bg-card-dark/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight dark:text-white">SmartHire</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="h-5 w-5 text-gray-400 hover:text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-500 hover:text-primary" />}
            </button>
            <Link
              to="/upload"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white transition-all shadow-[0_0_15px_rgba(170,59,255,0.3)] font-medium text-sm hidden sm:block"
            >
              Upload Resume
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
