import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

type InputWrapperProps<T extends React.ElementType> = {
  Component?: T;
  children?: React.ReactNode;
} & React.ComponentProps<T>;

export const InputWrapper = forwardRef<
  HTMLElement,
  InputWrapperProps<React.ElementType>
>(({ className, Component = 'input', children, ...props }, ref) => {
  if (children) {
    const hasSlotInput = React.Children.toArray(children).some((child) => {
      if (React.isValidElement(child)) {
        return child.type === InputContent;
      }
      return false;
    });

    if (!hasSlotInput) {
      throw new Error(
        'If you want to use Input as Wrapper, please use Input.Content'
      );
    }
  }

  const FinalComponent = children ? 'div' : Component;

  return (
    <FinalComponent
      ref={ref}
      className={cn(
        ' border border-basic-white relative text-sm font-medium  text-basic-black rounded-lg py-[5px] group rounded-default px-3 focus-within:border-basic-green  focus:outline-none ',
        props.disabled ? 'bg-transparent opacity-50' : 'bg-white',
        className
      )}
      {...props}
    >
      {children}
    </FinalComponent>
  );
});

export const  InputContent = forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      data-slot="input-content"
      className={cn(
        'group p-0.5 w-full focus:outline-none disabled:bg-white outline-none focus-visible:outline-none placeholder:text-basic-gray placeholder:text-sm placeholder:font-normal',
        className
      )}
      {...props}
    />
  );
});

InputWrapper.displayName = 'InputWrapper';
InputContent.displayName = 'InputContent';

export const Input = Object.assign(InputWrapper, {
  Content: InputContent,
});
