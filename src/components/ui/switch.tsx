import React from 'react';

// Type definitions
type SwitchSize = 'sm' | 'default' | 'lg';

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
}

const Switch: React.FC<SwitchProps> = ({ 
  checked, 
  onCheckedChange, 
  disabled = false, 
  size = 'default', 
  ...props 
}) => {
  const sizeClasses: Record<SwitchSize, string> = {
    sm: 'h-4 w-7',
    default: 'h-5 w-9',
    lg: 'h-6 w-11'
  };

  const thumbSizeClasses: Record<SwitchSize, string> = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  const translateClasses: Record<SwitchSize, string> = {
    sm: checked ? 'translate-x-3' : 'translate-x-0',
    default: checked ? 'translate-x-4' : 'translate-x-0',
    lg: checked ? 'translate-x-5' : 'translate-x-0'
  };

  const handleClick = (): void => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${checked 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-gray-200 hover:bg-gray-300'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : ''
        }
      `}
      {...props}
    >
      <span
        className={`
          ${thumbSizeClasses[size]}
          ${translateClasses[size]}
          pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0 
          transition duration-200 ease-in-out
        `}
      />
    </button>
  );
};

export default Switch;
export type { SwitchProps, SwitchSize };