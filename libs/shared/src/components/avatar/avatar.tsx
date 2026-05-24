import * as React from 'react';
import { Tooltip } from '@base-ui-components/react/tooltip';
import { Avatar as AvatarBase } from '@base-ui-components/react';
import { getAvatarFallback } from '../../helpers/serialize-helpers';
import { cn } from '../../utils';

interface AvatarProps {
  row: {
    original: {
      client: {
        name?: string;
        surname?: string;
        avatarSrc?: string;
      };
    };
  };
  tooltipText?: string;
  avatarSrc?: string;
  size?: 'xs' | 'sm' | 'ssm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'lsm';
  showTooltip?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  row,
  tooltipText,
  avatarSrc,
  size = 'md',
  className,
  rounded = 'none',
  showTooltip = true,
}) => {
  const client = row.original.client;

  const clientName = client.name || '';
  const clientSurname = client.surname || '';

  const displayTooltip =
    tooltipText ?? `${clientSurname} ${clientName[0] || ''}.`;
  const imgSrc = avatarSrc ?? client.avatarSrc;

  const sizeClasses = {
    xs: 'w-5 h-5 text-xs',
    sm: 'w-6 h-6 text-xs',
    ssm: 'w-7 h-7 text-sm',
    md: 'w-8 h-8 text-sm',
    lg: 'w-9 h-9 text-sm',
    xl: 'w-14 h-14 text-base',
    xxl: 'w-20 h-20 text-lg',
  }[size];

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    lsm: 'rounded-[4px]',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  const roundedClass = roundedClasses[rounded] || '';

  const avatarContent = (
    <div className="flex flex-row items-center gap-2 cursor-pointer" >
      <AvatarBase.Root>
        <AvatarBase.Image
          className={cn(
            `object-cover  `,
            className,
            sizeClasses,
            roundedClass
          )}
          src={imgSrc}
          alt="client"
        />
        <AvatarBase.Fallback
          className={cn(
            `flex items-center justify-center bg-basic-green-light text-basic-green text-sm font-medium  `,
            className,
            sizeClasses,
            roundedClass
          )}
        >
          {getAvatarFallback(clientName, clientSurname)}
        </AvatarBase.Fallback>
      </AvatarBase.Root>
    </div>
  );

  if (!showTooltip) {
    return avatarContent;
  }

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>{avatarContent}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={10} className={'z-[100000000000000]'}>
            <Tooltip.Popup className="bg-black text-white px-3 py-2  text-sm font-normal shadow-lg relative">
              {displayTooltip}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
