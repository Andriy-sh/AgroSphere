'use client';

import { Popover } from '@base-ui-components/react/popover';
import Image from 'next/image';
import { TagItem } from '../../../components/tag-item/tag-item';

export interface Account {
  name: string;
  logo: string;
  isPro?: boolean;
}

export interface AccountListProps {
  accounts: Account[];
  selectedAccount: Account;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClick: (account: Account) => void;
}

export const AccountList = ({
  accounts,
  open,
  onOpenChange,
  onClick,
}: AccountListProps) => {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup className="mt-1 w-[250px] bg-[#111] text-[#ccc] py-1">
            {accounts.map((account) => (
              <TagItem key={account.name} onClick={() => onClick(account)}>
                <div className="flex items-center w-full">
                  <div className="relative">
                    <Image
                      src={account.logo}
                      alt={account.name}
                      width={32}
                      height={32}
                      priority
                    />
                    {account.isPro && (
                      <div className="absolute -top-1.5 -right-1.5">
                        <Image
                          src="/pro.svg"
                          alt="pro"
                          width={16}
                          height={16}
                          priority
                        />
                      </div>
                    )}
                  </div>
                  <span className="ml-2 text-white font-medium">
                    {account.name}
                  </span>
                </div>
              </TagItem>
            ))}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default AccountList;
