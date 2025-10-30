import React from "react";

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputProps> = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col text-left w-full mb-4">
    <label className="mb-1 text-sky-300 font-semibold text-sm">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-[#133341] border border-[#1e4d58] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
    />
  </div>
);

export default InputField;
