import React from 'react';

const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center text-black mb-4">
          Thank You!
        </h2>
        <p className="text-center text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#FFD700] text-black rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;