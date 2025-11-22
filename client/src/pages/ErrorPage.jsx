import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, RefreshCcw, Search, Send } from 'lucide-react';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <AlertCircle className="h-24 w-24 text-red-500 animate-pulse" />
        </div>

        {/* Main Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          We're sorry, but it seems there was an issue loading this page. 
          Don't worry - your job search journey can continue!
        </p>

        {/* Possible Solutions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Here's what you can try:
          </h2>
          <ul className="text-left text-gray-600 dark:text-gray-300 space-y-3">
            <li className="flex items-center">
              <RefreshCcw className="h-5 w-5 mr-3 text-blue-500" />
              Refresh the page - sometimes that's all it takes
            </li>
            <li className="flex items-center">
              <Search className="h-5 w-5 mr-3 text-blue-500" />
              Try searching for the job or content you were looking for
            </li>
            <li className="flex items-center">
              <Home className="h-5 w-5 mr-3 text-blue-500" />
              Return to our homepage and start fresh
            </li>
            <li className="flex items-center">
              <Send className="h-5 w-5 mr-3 text-blue-500" />
              Contact our support team if the issue persists
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <RefreshCcw className="h-5 w-5 mr-2" />
            Refresh Page
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Homepage
          </button>

          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Send className="h-5 w-5 mr-2" />
            Contact Support
          </button>
        </div>

        {/* Additional Help Text */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Error Code: 404 • If you continue to experience issues, please email us at{' '}
          <a 
            href="mailto:support@jobportal.com" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            support@jobportal.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;