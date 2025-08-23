import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css"
import { logout } from '../features/AuthSlice';
import { useDispatch } from 'react-redux';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout())
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to the Homepage!
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          You are successfully logged in.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
