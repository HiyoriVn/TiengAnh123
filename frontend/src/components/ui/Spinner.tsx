/**
 * Loading Spinner Component
 */

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-gray-200 border-t-blue-600',
          sizes[size]
        )}
      />
    </div>
  );
}
