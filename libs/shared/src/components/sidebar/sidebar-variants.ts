import { cva } from 'class-variance-authority';

export const sidebarVariants = cva(
  'h-full max-h-full flex flex-col justify-between sticky top-0',
  {
    variants: {
      variant: {
        dark: 'bg-basic-black text-white',
        light: 'bg-white text-basic-black',
        green: 'bg-[#004E3A] text-white',
        'basic-white': 'bg-basic-white text-basic-black',
        'light-gray': 'bg-gray-200 text-gray-800',
      },
    },
    defaultVariants: {
      variant: 'dark',
    },
  }
);

export const sidebarItemVariants = cva(
  'flex items-center px-2 py-2 rounded-md transition-colors duration-200 hover:text-basic-green w-full justify-center',
  {
    variants: {
      variant: {
        dark: 'hover:bg-gray-800',
        light: 'hover:bg-gray-100',
        green: 'hover:bg-[#003d2e]',
        'basic-white': 'hover:bg-gray-50',
        'light-gray': 'hover:bg-gray-300',
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'dark',
        active: true,
        class: 'text-basic-green bg-basic-black',
      },
      {
        variant: 'dark',
        active: false,
        class: 'text-basic-gray',
      },
      {
        variant: 'light',
        active: true,
        class: 'text-basic-green bg-white',
      },
      {
        variant: 'light',
        active: false,
        class: 'text-basic-gray',
      },
      {
        variant: 'green',
        active: true,
        class: 'text-basic-green bg-[#004E3A]',
      },
      {
        variant: 'green',
        active: false,
        class: 'text-basic-gray-light',
      },
      {
        variant: 'basic-white',
        active: true,
        class: 'text-basic-green bg-basic-white',
      },
      {
        variant: 'basic-white',
        active: false,
        class: 'text-basic-gray',
      },
      {
        variant: 'light-gray',
        active: true,
        class: 'text-basic-green bg-gray-200',
      },
      {
        variant: 'light-gray',
        active: false,
        class: 'text-gray-600',
      },
    ],
    defaultVariants: {
      variant: 'dark',
      active: false,
    },
  }
);

export const sidebarButtonVariants = cva(
  'p-1 rounded flex-none transition-colors duration-200',
  {
    variants: {
      variant: {
        dark: 'hover:bg-gray-800',
        light: 'hover:bg-gray-100',
        green: 'hover:bg-[#003d2e]',
        'basic-white': 'hover:bg-gray-50',
        'light-gray': 'hover:bg-gray-300',
      },
    },
    defaultVariants: {
      variant: 'dark',
    },
  }
);

export const borderVariants = cva('border-t w-full', {
  variants: {
    variant: {
      dark: 'border-[#FFFFFF0F]',
      light: 'border-[#0000000F]',
      green: 'border-[#004E3A0F]',
      'basic-white': 'border-[#0000000F]',
      'light-gray': 'border-[#0000000F]',
    },
  },
  defaultVariants: {
    variant: 'dark',
  },
});

export const iconVariants = cva('material-symbols-outlined', {
  variants: {
    variant: {
      dark: 'text-basic-gray',
      light: 'text-basic-gray',
      green: 'text-white',
      'basic-white': 'text-basic-gray',
      'light-gray': 'text-gray-600',
    },
  },
  defaultVariants: {
    variant: 'dark',
  },
});

export const sidebarTextVariants = cva('', {
  variants: {
    variant: {
      dark: 'text-basic-gray',
      light: 'text-basic-gray',
      green: 'text-basic-gray-light',
      'basic-white': 'text-basic-gray',
      'light-gray': 'text-gray-600',
    },
  },
  defaultVariants: {
    variant: 'dark',
  },
});

export const sidebarFooterTextVariants = cva('', {
  variants: {
    variant: {
      dark: 'text-white',
      light: 'text-basic-black',
      green: 'text-white',
      'basic-white': 'text-basic-black',
      'light-gray': 'text-gray-800',
    },
  },
  defaultVariants: {
    variant: 'dark',
  },
});

export type SidebarVariant = 'dark' | 'light' | 'green' | 'basic-white' | 'light-gray';

