import React from 'react';

interface InputProps {
  label: string;
  value: number | string;
  onChange: (value: any) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  disabled = false,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      // Позволяем пустое значение и отрицательные числа
      const newValue = e.target.value === '' ? '' : parseFloat(e.target.value);
      onChange(isNaN(newValue as number) ? '' : newValue);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};