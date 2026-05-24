'use client';

import {
  Button,
  Avatar,
  Input,
  PhoneInput,
  DeleteAccountDialog,
  SettingsTabHeader,
  Select,
  CountrySelect,
  RegionSelect,
  Label,
  getPostalCodeLabel,
  getRegionLabel,
} from '@@agrosphere/shared';
import { mockRoles } from '@@agrosphere/shared';
import { useEffect, useState, useRef } from 'react';

interface AccountData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatarSrc?: string;
  address?: string;
  country?: string;
  eircode?: string;
  county?: string;
}

interface AccountSettingsProps {
  accountData?: AccountData;
  onSave?: (data: AccountData) => void;
  onOpenMapPicker?: (
    field: 'addressLine1' | 'addressLine2' | 'accountAddress'
  ) => void;
}

export default function AccountSettings({
  accountData,
  onSave,
  onOpenMapPicker,
}: AccountSettingsProps) {
  const [firstName, setFirstName] = useState(accountData?.firstName || '');
  const [lastName, setLastName] = useState(accountData?.lastName || '');
  const [email, setEmail] = useState(accountData?.email || '');
  const [phoneValue, setPhoneValue] = useState(accountData?.phone || '');
  const [avatarSrc, setAvatarSrc] = useState(accountData?.avatarSrc || '');
  const [roleValue, setRoleValue] = useState(accountData?.role || '');
  const [addressValue, setAddressValue] = useState(accountData?.address || '');
  const [countryValue, setCountryValue] = useState(accountData?.country || '');
  const [eircodeValue, setEircodeValue] = useState(accountData?.eircode || '');
  const [countyValue, setCountyValue] = useState(accountData?.county || '');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postalCodeLabel, setPostalCodeLabel] = useState('Postal Code');
  const [regionLabel, setRegionLabel] = useState('Region');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roleOptions = mockRoles.map((role) => ({
    value: role.title,
    label: role.title,
  }));

  useEffect(() => {
    if (accountData) {
      setFirstName(accountData.firstName);
      setLastName(accountData.lastName);
      setEmail(accountData.email);
      setPhoneValue(accountData.phone);
      setAvatarSrc(accountData.avatarSrc || '');
      setRoleValue(accountData.role);
      setAddressValue(accountData.address || '');
      setCountryValue(accountData.country || '');
      setEircodeValue(accountData.eircode || '');
      setCountyValue(accountData.county || '');
    }
  }, [accountData]);

  useEffect(() => {
    setPostalCodeLabel(getPostalCodeLabel(countryValue));
    setRegionLabel(getRegionLabel(countryValue));
  }, [countryValue]);

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarSrc(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAvatarSrc('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenMapPicker = () => {
    onOpenMapPicker?.('accountAddress');
  };

  if (!accountData) {
    return <div>Loading...</div>;
  }

  const mockRow = {
    original: {
      client: {
        name: firstName,
        surname: lastName,
        avatarSrc: avatarSrc,
      },
    },
  };

  const hasChanges =
    firstName !== accountData.firstName ||
    lastName !== accountData.lastName ||
    email !== accountData.email ||
    phoneValue !== accountData.phone ||
    avatarSrc !== (accountData.avatarSrc || '') ||
    roleValue !== accountData.role ||
    addressValue !== (accountData.address || '') ||
    countryValue !== (accountData.country || '') ||
    eircodeValue !== (accountData.eircode || '') ||
    countyValue !== (accountData.county || '');

  const handleSave = () => {
    const updatedAccountData = {
      ...accountData,
      firstName,
      lastName,
      email,
      phone: phoneValue,
      avatarSrc,
      role: roleValue,
      address: addressValue,
      country: countryValue,
      eircode: eircodeValue,
      county: countyValue,
    };

    onSave?.(updatedAccountData);
  };

  const handleCancel = () => {
    setFirstName(accountData.firstName);
    setLastName(accountData.lastName);
    setEmail(accountData.email);
    setPhoneValue(accountData.phone);
    setAvatarSrc(accountData.avatarSrc || '');
    setRoleValue(accountData.role);
    setAddressValue(accountData.address || '');
    setCountryValue(accountData.country || '');
    setEircodeValue(accountData.eircode || '');
    setCountyValue(accountData.county || '');
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-5">
        <SettingsTabHeader icon="person" title="Account settings" />

        <div className="space-y-5">
          <div className="flex items-start gap-5">
            <Avatar row={mockRow} size="xxl" rounded="xl" showTooltip={false} />
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-basic-black">
                  {firstName} {lastName}
                </h3>
                <p className="text-sm text-basic-gray">{email}</p>
                <p className="text-sm text-basic-gray">{roleValue}</p>
              </div>
              {/* <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    variant="default"
                    size="default"
                    onClick={handleUploadImage}
                  >
                    Upload image
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleRemoveImage}
                    disabled={!avatarSrc}
                  >
                    Remove image
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  We support Png, JPEG, and GIF under 2 Mb
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div> */}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-basic-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-basic-black">
            Personal details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 w-full">
              <Label>First name</Label>
              <Input className="w-full">
                <Input.Content
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="w-full"
                />
              </Input>
            </div>
            <div className="space-y-2 w-full">
              <Label>Last name</Label>
              <Input className="w-full">
                <Input.Content
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="w-full"
                />
              </Input>
            </div>
            <div className="space-y-2 w-full">
              <Label>Email</Label>
              <Input className="w-full">
                <Input.Content
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full py-[2px] "
                />
              </Input>
            </div>
            <div className="space-y-2 w-full">
              <Label>Phone</Label>
              <PhoneInput
                value={phoneValue}
                onChange={setPhoneValue}
                defaultCountry="ie"
                placeholder="Enter phone number"
                className="w-full"
              />
            </div>
            <div className="space-y-2 w-full md:col-span-2">
              <Label>Role</Label>
              <Select
                options={roleOptions}
                value={roleValue}
                onChange={(value: string) => setRoleValue(value)}
                placeholder="Select role"
                disabled={true}
                triggerClassName="text-sm text-basic-black"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-basic-black">Address</h2>
          <div className="space-y-4">
            <div className="space-y-2 w-full">
              <div className="flex justify-between items-center">
                <Label>Address</Label>
                <button
                  type="button"
                  className="text-xs text-basic-green hover:text-basic-green cursor-pointer"
                  onClick={handleOpenMapPicker}
                >
                  Use map picker
                </button>
              </div>
              <Input className="w-full">
                <Input.Content
                  type="text"
                  value={addressValue}
                  onChange={(e) => setAddressValue(e.target.value)}
                  placeholder="Enter address"
                  className="w-full"
                />
              </Input>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 w-full">
                <Label>Country</Label>
                <CountrySelect
                  value={countryValue}
                  onChange={setCountryValue}
                  placeholder="Select country"
                  className="w-full"
                />
              </div>
              <div className="space-y-2 w-full">
                <Label>{postalCodeLabel}</Label>
                <Input className="w-full">
                  <Input.Content
                    type="text"
                    value={eircodeValue}
                    onChange={(e) => setEircodeValue(e.target.value)}
                    placeholder={`Enter ${postalCodeLabel.toLowerCase()}`}
                    className="w-full"
                  />
                </Input>
              </div>
            </div>
            <div className="space-y-2 w-full">
              <Label>{regionLabel}</Label>
              <RegionSelect
                value={countyValue}
                onChange={setCountyValue}
                country={countryValue}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-basic-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-basic-black mb-1">
                Delete account
              </h2>
              <p className="text-sm text-basic-gray">
                This will permanently remove your account and data from this
                organisation.
              </p>
            </div>
            <Button
              variant="delete"
              size="default"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="flex justify-between gap-3 w-ful  mt-5">
          <Button
            className="flex-1"
            variant="cancel"
            size="default"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            variant="complete"
            size="default"
            onClick={handleSave}
          >
            Save changes
          </Button>
        </div>
      )}

      <DeleteAccountDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          return;
        }}
      />
    </div>
  );
}
