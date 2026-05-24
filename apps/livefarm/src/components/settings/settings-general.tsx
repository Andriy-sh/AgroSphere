'use client';

import {
  Button,
  Avatar,
  Input,
  PhoneInput,
  SettingsTabHeader,
  CountrySelect,
  RegionSelect,
  Label,
  getPostalCodeLabel,
  getRegionLabel,
  CustomSelect,
  PreferenceOption,
} from '@@agrosphere/shared';
import { Check } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const SimpleSectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-base font-semibold text-basic-black p-5 border-b border-basic-white">
    {title}
  </h2>
);

interface GeneralData {
  logoSrc?: string;
  businessType: string;
  businessName: string;
  businessCategory: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  eircode: string;
  county: string;
  phone: string;
  vatNo: string;
  businessNo: string;
  require2FA?: boolean;
}

interface GeneralSettingsProps {
  generalData?: GeneralData;
  onSave?: (data: GeneralData) => void;
  onOpenMapPicker?: (field: 'addressLine1' | 'addressLine2') => void;
}

const businessTypeOptions = [
  { value: 'limited-company', label: 'Limited company' },
  { value: 'sole-trader', label: 'Sole trader' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llc', label: 'LLC' },
];

const businessCategoryOptions = [
  { value: 'advisor-agronomist', label: 'Advisor/Agronomist' },
  { value: 'farmer', label: 'Farmer' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'supplier', label: 'Supplier' },
];

export default function GeneralSettings({
  generalData,
  onSave,
  onOpenMapPicker,
}: GeneralSettingsProps) {
  const [logoSrc, setLogoSrc] = useState(generalData?.logoSrc || '');
  const [businessType, setBusinessType] = useState(
    generalData?.businessType || ''
  );
  const [businessName, setBusinessName] = useState(
    generalData?.businessName || ''
  );
  const [businessCategory, setBusinessCategory] = useState(
    generalData?.businessCategory || ''
  );
  const [addressLine1, setAddressLine1] = useState(
    generalData?.addressLine1 || ''
  );
  const [addressLine2, setAddressLine2] = useState(
    generalData?.addressLine2 || ''
  );
  const [country, setCountry] = useState(generalData?.country || '');
  const [eircode, setEircode] = useState(generalData?.eircode || '');
  const [county, setCounty] = useState(generalData?.county || '');
  const [phone, setPhone] = useState(generalData?.phone || '');
  const [vatNo, setVatNo] = useState(generalData?.vatNo || '');
  const [businessNo, setBusinessNo] = useState(generalData?.businessNo || '');
  const [postalCodeLabel, setPostalCodeLabel] = useState('Postal Code');
  const [regionLabel, setRegionLabel] = useState('Region');
  const [require2FA, setRequire2FA] = useState(
    generalData?.require2FA || false
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (generalData) {
      setLogoSrc(generalData.logoSrc || '');
      setBusinessType(generalData.businessType);
      setBusinessName(generalData.businessName);
      setBusinessCategory(generalData.businessCategory);
      setAddressLine1(generalData.addressLine1);
      setAddressLine2(generalData.addressLine2);
      setCountry(generalData.country);
      setEircode(generalData.eircode);
      setCounty(generalData.county);
      setPhone(generalData.phone);
      setVatNo(generalData.vatNo);
      setBusinessNo(generalData.businessNo);
      setRequire2FA(generalData.require2FA || false);
    }
  }, [generalData]);

  useEffect(() => {
    setPostalCodeLabel(getPostalCodeLabel(country));
    setRegionLabel(getRegionLabel(country));
  }, [country]);

  const handleUploadLogo = () => {
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
        setLogoSrc(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoSrc('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenMapPicker = (field: 'addressLine1' | 'addressLine2') => {
    onOpenMapPicker?.(field);
  };

  if (!generalData) {
    return <div>Loading...</div>;
  }

  const mockRow = {
    original: {
      client: {
        name: businessName,
        surname: '',
        avatarSrc: logoSrc,
      },
    },
  };

  const hasChanges =
    logoSrc !== (generalData.logoSrc || '') ||
    businessType !== generalData.businessType ||
    businessName !== generalData.businessName ||
    businessCategory !== generalData.businessCategory ||
    addressLine1 !== generalData.addressLine1 ||
    addressLine2 !== generalData.addressLine2 ||
    country !== generalData.country ||
    eircode !== generalData.eircode ||
    county !== generalData.county ||
    phone !== generalData.phone ||
    vatNo !== generalData.vatNo ||
    businessNo !== generalData.businessNo ||
    require2FA !== (generalData.require2FA || false);

  const handleSave = () => {
    const updatedGeneralData = {
      ...generalData,
      logoSrc: logoSrc,
      businessType,
      businessName,
      businessCategory,
      addressLine1,
      addressLine2,
      country,
      eircode,
      county,
      phone,
      vatNo,
      businessNo,
      require2FA,
    };

    onSave?.(updatedGeneralData);
  };

  const handleCancel = () => {
    setLogoSrc(generalData.logoSrc || '');
    setBusinessType(generalData.businessType);
    setBusinessName(generalData.businessName);
    setBusinessCategory(generalData.businessCategory);
    setAddressLine1(generalData.addressLine1);
    setAddressLine2(generalData.addressLine2);
    setCountry(generalData.country);
    setEircode(generalData.eircode);
    setCounty(generalData.county);
    setPhone(generalData.phone);
    setVatNo(generalData.vatNo);
    setBusinessNo(generalData.businessNo);
    setRequire2FA(generalData.require2FA || false);
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-5 ">
        <SettingsTabHeader icon="settings" title="General" />

        <div className="space-y-4 ">
          <div className="flex items-start gap-5 pb-3">
            <Avatar
              row={mockRow}
              size="xxl"
              className="w-20 h-20"
              rounded="xl"
              showTooltip={false}
            />
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  variant="default"
                  size="default"
                  onClick={handleUploadLogo}
                >
                  Upload logo
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleRemoveLogo}
                  disabled={!logoSrc}
                >
                  Remove logo
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                We support Png, JPEG, and GIF under 2 Mb
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-basic-white">
            <SimpleSectionHeader title="Organisation details" />
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-2 w-full">
                  <Label>Business type</Label>
                  <div className="relative w-full">
                    <CustomSelect
                      options={businessTypeOptions}
                      value={businessType}
                      onValueChange={(value) => setBusinessType(value)}
                      placeholder="Select business type"
                      className="w-full"
                      triggerClassName="w-full"
                      renderPopup={({
                        options,
                        value,
                        onValueChange,
                        close,
                      }) => (
                        <div className="bg-white rounded-md shadow-lg border border-basic-white max-h-60 overflow-y-auto py-1 w-full">
                          {options.map((option) => {
                            const isSelected = value === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  onValueChange?.(option.value);
                                  close();
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-basic-white focus:bg-basic-white focus:outline-none transition-colors duration-150 cursor-pointer"
                              >
                                <span className="truncate flex-1">
                                  {option.label}
                                </span>
                                {isSelected && (
                                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 ml-2">
                                    <Check className="w-4 h-4 text-basic-green" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  <Label>Business name</Label>
                  <Input className="w-full">
                    <Input.Content
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Enter business name"
                      className="w-full p-0.5"
                    />
                  </Input>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label>Business category</Label>
                <div className="relative w-full">
                  <CustomSelect
                    options={businessCategoryOptions}
                    value={businessCategory}
                    onValueChange={(value) => setBusinessCategory(value)}
                    placeholder="Select business category"
                    className="w-full"
                    triggerClassName="w-full"
                    renderPopup={({ options, value, onValueChange, close }) => (
                      <div className="bg-white rounded-md shadow-lg border border-basic-white max-h-60 overflow-y-auto py-1 w-full">
                        {options.map((option) => {
                          const isSelected = value === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                onValueChange?.(option.value);
                                close();
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-basic-white focus:bg-basic-white focus:outline-none transition-colors duration-150 cursor-pointer"
                            >
                              <span className="truncate flex-1">
                                {option.label}
                              </span>
                              {isSelected && (
                                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 ml-2">
                                  <Check className="w-4 h-4 text-basic-green" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-basic-white">
            <SimpleSectionHeader title="Additional details" />
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2 w-full">
                  <div className="flex justify-between items-center">
                    <Label>Address line 1</Label>
                    <button
                      type="button"
                      className="text-xs text-basic-green hover:text-basic-green cursor-pointer"
                      onClick={() => handleOpenMapPicker('addressLine1')}
                    >
                      Use map picker
                    </button>
                  </div>
                  <Input className="w-full">
                    <Input.Content
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Enter address line 1"
                      className="w-full"
                    />
                  </Input>
                </div>
                <div className="space-y-2 w-full">
                  <div className="flex justify-between items-center">
                    <Label>Address line 2</Label>
                    <button
                      type="button"
                      className="text-xs text-basic-green hover:text-basic-green cursor-pointer"
                      onClick={() => handleOpenMapPicker('addressLine2')}
                    >
                      Use map picker
                    </button>
                  </div>
                  <Input className="w-full">
                    <Input.Content
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Enter address line 2"
                      className="w-full"
                    />
                  </Input>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2 w-full">
                  <Label>Country</Label>
                  <CountrySelect
                    value={country}
                    onChange={setCountry}
                    placeholder="Select country"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <Label>{postalCodeLabel}</Label>
                  <Input className="w-full">
                    <Input.Content
                      type="text"
                      value={eircode}
                      onChange={(e) => setEircode(e.target.value)}
                      placeholder={`Enter ${postalCodeLabel.toLowerCase()}`}
                      className="w-full"
                    />
                  </Input>
                </div>
              </div>
              <div className="space-y-2 w-full">
                <Label>{regionLabel}</Label>
                <RegionSelect
                  value={county}
                  onChange={setCounty}
                  country={country}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2 w-full">
                  <Label>Phone</Label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    defaultCountry="ie"
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <Label>VAT No</Label>
                  <Input className="w-full">
                    <Input.Content
                      type="text"
                      value={vatNo}
                      onChange={(e) => setVatNo(e.target.value)}
                      placeholder="Enter VAT number"
                      className="w-full p-[3px]"
                    />
                  </Input>
                </div>
              </div>
              <div className="space-y-2 w-full">
                <Label>Business No</Label>
                <Input className="w-full">
                  <Input.Content
                    type="text"
                    value={businessNo}
                    onChange={(e) => setBusinessNo(e.target.value)}
                    placeholder="Enter business number"
                    className="w-full"
                  />
                </Input>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5 border-basic-white">
          <PreferenceOption
            titleClassName="font-semibold"
            title="Require 2FA for all users"
            description="This setting enforces two-factor authentication for all users in your organization."
            enabled={require2FA}
            onToggle={() => setRequire2FA(!require2FA)}
          />
        </div>
      </div>

      {hasChanges && (
        <div className="flex justify-between gap-3 w-full pt-8">
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
    </div>
  );
}
