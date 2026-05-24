'use client';

import { useState, useEffect } from 'react';
import { X   } from 'lucide-react';
import {
  Dialog,
  Button,
  Input,
  CustomSelect,
  SelectOption,
  TeamUser,
  Label,
  Toggle,
} from '@@agrosphere/shared';

interface TeamEditUserDetailsProps {
  user: TeamUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: Partial<TeamUser>) => void;
}

const labelStyles = 'block text-xs font-normal text-basic-black mb-2';
const inputStyles = 'w-full border border-basic-gray-white h-9 rounded-md';

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
    <Label htmlFor={htmlFor} className={labelStyles}>
      {label}
    </Label>
    {children}
  </div>
);

export function TeamEditUserDetails({
  user,
  isOpen,
  onClose,
  onSave,
}: TeamEditUserDetailsProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userRole: 'Viewer' as TeamUser['userRole'],
    isDeactivated: false,
  });

  const roleOptions: SelectOption[] = [
    { value: 'Administrator', label: 'Administrator' },
    { value: 'Field advisor', label: 'Field advisor' },
    { value: 'Contractor manager', label: 'Contractor manager' },
    { value: 'Viewer', label: 'Viewer' },
    { value: 'Support', label: 'Support' },
  ];

  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email,
        userRole: user.userRole,
        isDeactivated: user.status === 'Inactive',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleDeactivate = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDeactivated: checked,
    }));
  };

  const handleSave = () => {
    if (!user) return;

    const updatedUser: Partial<TeamUser> = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      userRole: formData.userRole,
      status: formData.isDeactivated ? 'Inactive' : 'Active',
    };

    onSave(updatedUser);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

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
          <span className="material-symbols-outlined text-basic-black">
            person_edit
          </span>
          <h2 className="text-xl font-semibold text-gray-900">
            Edit user details
          </h2>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="pt-5">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <FormField label="First name" htmlFor="firstName">
            <Input
              value={formData.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('firstName', e.target.value)
              }
              placeholder="Enter first name"
              className={inputStyles}
            />
          </FormField>

          <FormField label="Last name" htmlFor="lastName">
            <Input
              value={formData.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('lastName', e.target.value)
              }
              placeholder="Enter last name"
              className={inputStyles}
            />
          </FormField>

          <FormField label="Email" htmlFor="email">
            <Input
              type="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('email', e.target.value)
              }
              placeholder="Enter email address"
              className={inputStyles}
            />
          </FormField>

          <FormField label="User role" htmlFor="userRole">
            <CustomSelect
              options={roleOptions}
              value={formData.userRole}
              onValueChange={(value) =>
                handleInputChange('userRole', value as TeamUser['userRole'])
              }
              className="w-full"
              triggerClassName={`${inputStyles} h-10`}
            />
          </FormField>
        </div>

        <div className="flex items-center mb-6 gap-3 mt-5">
          <Toggle
            checked={formData.isDeactivated}
            onCheckedChange={handleToggleDeactivate}
            size="md"
          />
          <Label
            htmlFor="isDeactivated"
            className="text-xs font-normal text-basic-black"
          >
            Deactivate user
          </Label>
        </div>
      </div>

      <Button
        onClick={handleSave}
        className="w-full bg-basic-green text-white py-3 rounded-lg font-medium"
      >
        Save
      </Button>
    </Dialog>
  );
}
