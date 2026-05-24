'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import ReactDOM from 'react-dom';
import { Label } from '../label/label';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { Dialog } from '../dialog/dialog';
import { CustomSelect } from '../select/select';

interface InviteItem {
  id: string;
  email: string;
  role?: string;
}

interface InviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (items: InviteItem[]) => void;
  title: string;
  icon: React.ReactNode;
  showRoleSelector?: boolean;
  roleOptions?: Array<{ value: string; label: string }>;
  addMoreText?: string;
  sendButtonText?: string;
  emailPlaceholder?: string;
  rolePlaceholder?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const FormField = ({
  label,
  children,
  htmlFor,
}: {
  label: string;
  children: React.ReactNode;
  htmlFor: string;
}) => (
  <div>
    <Label
      htmlFor={htmlFor}
      className="text-xs font-normal text-basic-black mb-2"
    >
      {label}
    </Label>
    {children}
  </div>
);

export function InviteDialog({
  isOpen,
  onClose,
  onInvite,
  title,
  icon,
  showRoleSelector = false,
  roleOptions = [],
  addMoreText = 'Add more people',
  sendButtonText = 'Send invite',
  emailPlaceholder = 'Enter email',
  rolePlaceholder = 'Select role',
}: InviteDialogProps) {
  const [items, setItems] = useState<InviteItem[]>([
    { id: '1', email: '', ...(showRoleSelector && { role: '' }) },
  ]);

  const handleAddItem = useCallback(() => {
    const newId = `item-${Date.now()}-${items.length}`;
    setItems((prev) => [
      ...prev,
      { id: newId, email: '', ...(showRoleSelector && { role: '' }) },
    ]);
  }, [items.length, showRoleSelector]);

  const handleRemoveItem = useCallback(
    (id: string) => {
      if (items.length > 1) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    },
    [items.length]
  );

  const handleItemChange = useCallback(
    (id: string, field: 'email' | 'role', value: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const handleSubmit = useCallback(() => {
    const validItems = items.filter((item) => {
      if (showRoleSelector) {
        return item.email && item.role;
      }
      return item.email;
    });

    if (validItems.length > 0) {
      onInvite(validItems);
      onClose();
      setItems([
        {
          id: `item-${Date.now()}-1`,
          email: '',
          ...(showRoleSelector && { role: '' }),
        },
      ]);
    }
  }, [items, onInvite, onClose, showRoleSelector]);

  const isValid = items.some((item) => {
    if (showRoleSelector) {
      return item.email && item.role;
    }
    return item.email;
  });

  const gridCols = showRoleSelector ? 'grid-cols-2' : 'grid-cols-1';

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-xl text-sm text-basic-black font-medium"
      showCloseButton={false}
      title=""
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-xl font-semibold text-basic-black">{title}</h2>
        </div>
        <span
          onClick={onClose}
          className="text-basic-black material-symbols-outlined cursor-pointer"
        >
          close
        </span>
      </div>

      <div className="pt-5">
        <div className="max-h-[300px] overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className={`grid ${gridCols} gap-4 mb-6`}>
              {showRoleSelector ? (
                <>
                  <FormField label="Email" htmlFor={`email-${item.id}`}>
                    <Input
                      type="email"
                      value={item.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleItemChange(item.id, 'email', e.target.value)
                      }
                      placeholder={emailPlaceholder}
                      className="w-full p-[7px]"
                    />
                  </FormField>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FormField label="Role" htmlFor={`role-${item.id}`}>
                        <CustomSelect
                          options={roleOptions}
                          value={item.role || ''}
                          onValueChange={(value) =>
                            handleItemChange(item.id, 'role', value)
                          }
                          placeholder={rolePlaceholder}
                          className="w-full"
                          triggerClassName="w-full"
                        />
                      </FormField>
                    </div>
                    {items.length > 1 && (
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-9 h-9 border border-basic-gray-white rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors mt-6"
                        style={{
                          marginTop: '1.5rem',
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-basic-gray" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <FormField label="Email" htmlFor={`email-${item.id}`}>
                      <Input
                        type="email"
                        value={item.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleItemChange(item.id, 'email', e.target.value)
                        }
                        placeholder={emailPlaceholder}
                        className="w-full py-[7px]"
                      />
                    </FormField>
                  </div>
                  {items.length > 1 && (
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-9 h-9 border border-basic-gray-white bg-basic-white rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors mt-6"
                    >
                      <Trash2 className="w-4 h-4 text-basic-black" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 text-basic-green hover:text-basic-green/80 transition-colors mb-6"
        >
          <div className="w-4 h-4 rounded-full bg-basic-green flex items-center justify-center">
            <Plus className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium">{addMoreText}</span>
        </button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full bg-basic-green text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sendButtonText}
      </Button>
    </Dialog>
  );
}
