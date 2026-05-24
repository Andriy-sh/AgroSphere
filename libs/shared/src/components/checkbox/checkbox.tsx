'use client';

import { cn } from '../../utils/cn';
import { Checkbox as CheckboxBase } from '@base-ui-components/react';

type CheckBoxProps = typeof CheckboxBase.Root extends React.ComponentType<
  infer P
>
  ? P
  : never;

export function Checkbox({ className, checked, ...props }: CheckBoxProps) {
  return (
    <CheckboxBase.Root
      checked={checked}
      className={cn(
        'w-4 h-4 rounded-sm border-2 cursor-pointer transition-colors flex items-center justify-center',
        checked
          ? 'bg-basic-green-dark border-basic-green-dark'
          : 'bg-white border-basic-gray-light',
        className
      )}
      {...props}
    >
      <CheckboxBase.Indicator>
        {checked && (
          <svg
            width="9"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="m-auto"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </CheckboxBase.Indicator>
    </CheckboxBase.Root>
  );
}

export default Checkbox;
