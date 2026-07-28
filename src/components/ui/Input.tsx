'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="font-label text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`neo-input w-full rounded-xl px-4 py-2.5 bg-surface-container-lowest text-on-surface font-body text-sm placeholder:text-outline/50 ${error ? 'ring-2 ring-error' : ''} ${className}`}
          {...props}
        />
        {error && <span className="font-label text-xs text-error">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
