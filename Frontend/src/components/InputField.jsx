import React from 'react';

const InputField = ({ label, type, value, setValue, placeholder, disabled, autoFocus }) => (
  <div className="mb-5">
    <label className="block text-sm font-semibold text-brand-600 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

export default InputField;