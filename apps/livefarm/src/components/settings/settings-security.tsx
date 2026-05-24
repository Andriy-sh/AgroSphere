'use client';

import {
  Button,
  Input,
  Toggle,
  SettingsTabHeader,
  Icon,
} from '@@agrosphere/shared';
import { Fragment, useEffect, useState } from 'react';

interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactor: {
    sms: boolean;
    totp: boolean;
  };
  devices: Array<{
    id: string;
    name: string;
    location: string;
    lastActive: string;
    icon: string;
  }>;
}

interface SecuritySettingsProps {
  securityData?: SecurityData;
  onSave?: (data: SecurityData) => void;
}

const SimpleSectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-base font-semibold text-basic-black p-5 border-b border-basic-white">
    {title}
  </h2>
);

const PasswordField = ({
  label,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
}) => (
  <div className="space-y-2">
    <label className="text-xs font-normal text-basic-black ">{label}</label>
    <div className="relative">
      <Input className="w-full">
        <Input.Content
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="Enter password"
          className="w-full"
        />
      </Input>
      <Icon
        onClick={onToggleVisibility}
        icon={showPassword ? 'visibility_off' : 'visibility'}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-basic-gray hover:text-basic-black"
      />
    </div>
  </div>
);

const TwoFactorOption = ({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <Icon icon={icon}  />
        <h3 className="text-sm font-medium text-basic-black">{title}</h3>
      </div>
      <p className="text-sm font-normal text-basic-gray">{description}</p>
    </div>
    <Toggle checked={enabled} onCheckedChange={onToggle} />
  </div>
);

const DeviceItem = ({
  icon,
  name,
  location,
  onSignOut,
}: {
  icon: string;
  name: string;
  location: string;
  onSignOut: () => void;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <Icon icon={icon}/>
        <h3 className="text-sm font-medium text-basic-black">{name}</h3>
      </div>
      <p className="text-sm font-normal text-basic-gray">{location}</p>
    </div>
    <Button
      variant="ghost"
      size="sm"
      className="text-basic-black hover:text-black bg-basic-white"
      onClick={onSignOut}
    >
      Sign out
    </Button>
  </div>
);

export function SecuritySettings({
  securityData,
  onSave,
}: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState(
    securityData?.currentPassword || ''
  );
  const [newPassword, setNewPassword] = useState(
    securityData?.newPassword || ''
  );
  const [confirmPassword, setConfirmPassword] = useState(
    securityData?.confirmPassword || ''
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(
    securityData?.twoFactor?.sms || false
  );
  const [totpEnabled, setTotpEnabled] = useState(
    securityData?.twoFactor?.totp || false
  );

  useEffect(() => {
    if (securityData) {
      setCurrentPassword(securityData.currentPassword);
      setNewPassword(securityData.newPassword);
      setConfirmPassword(securityData.confirmPassword);
      setSmsEnabled(securityData.twoFactor.sms);
      setTotpEnabled(securityData.twoFactor.totp);
    }
  }, [securityData]);

  if (!securityData) {
    return <div>Loading...</div>;
  }

  const hasChanges =
    currentPassword !== securityData.currentPassword ||
    newPassword !== securityData.newPassword ||
    confirmPassword !== securityData.confirmPassword ||
    smsEnabled !== securityData.twoFactor.sms ||
    totpEnabled !== securityData.twoFactor.totp;

  const handleSave = () => {
    const updatedSecurityData = {
      ...securityData,
      currentPassword,
      newPassword,
      confirmPassword,
      twoFactor: {
        sms: smsEnabled,
        totp: totpEnabled,
      },
    };

    onSave?.(updatedSecurityData);
  };

  const handleCancel = () => {
    setCurrentPassword(securityData.currentPassword);
    setNewPassword(securityData.newPassword);
    setConfirmPassword(securityData.confirmPassword);
    setSmsEnabled(securityData.twoFactor.sms);
    setTotpEnabled(securityData.twoFactor.totp);
  };

  const passwordFields = [
    {
      label: 'Current password',
      value: currentPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setCurrentPassword(e.target.value),
      showPassword: showCurrentPassword,
      onToggleVisibility: () => setShowCurrentPassword(!showCurrentPassword),
    },
    {
      label: 'New password',
      value: newPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setNewPassword(e.target.value),
      showPassword: showNewPassword,
      onToggleVisibility: () => setShowNewPassword(!showNewPassword),
    },
    {
      label: 'Confirm password',
      value: confirmPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setConfirmPassword(e.target.value),
      showPassword: showConfirmPassword,
      onToggleVisibility: () => setShowConfirmPassword(!showConfirmPassword),
    },
  ];

  const twoFactorOptions = [
    {
      icon: 'drafts',
      title: 'Text message SMS',
      description: 'Receive a one-time passcode via SMS each time you log in.',
      enabled: smsEnabled,
      onToggle: () => setSmsEnabled(!smsEnabled),
    },
    {
      icon: 'encrypted',
      title: 'Authenticator app (TOTP)',
      description:
        'Use an app to receive a temporary one time passcode each time you log in.',
      enabled: totpEnabled,
      onToggle: () => setTotpEnabled(!totpEnabled),
    },
  ];

  return (
    <div className="flex flex-col">
      <SettingsTabHeader icon="lock" title="Security settings" />

      <div className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm border border-basic-white">
          <SimpleSectionHeader title="Password" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-5">
            <div className="lg:col-span-2 space-y-3">
              {passwordFields.map((field, index) => (
                <PasswordField key={index} {...field} />
              ))}
            </div>

            <div className="bg-basic-white rounded-lg p-5 space-y-3">
              <h3 className="text-sm font-semibold text-basic-black">
                Rules for password
              </h3>
              <p className="text-xs text-basic-gray">
                To create new password, you have to meet all of the following
                requirements:
              </p>
              <ul className="text-xs text-basic-gray space-y-0.5">
                <li>• Minimum 8 character;</li>
                <li>• At least one number;</li>
                <li>• At least one special character;</li>
                <li>• Can&apos;t be the same as a previous;</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-basic-white">
          <SimpleSectionHeader title="Two-factor authentication" />
          <div className="p-5">
            {twoFactorOptions.map((option, index) => (
              <Fragment key={index}>
                {index > 0 && (
                  <div className="border-t border-basic-white"></div>
                )}
                <div className={index === 0 ? 'pb-5' : 'pt-5'}>
                  <TwoFactorOption {...option} />
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-basic-white">
          <SimpleSectionHeader title="Devices" />
          <div className="p-5">
            <div className="space-y-0">
              {securityData.devices.map((device, index) => (
                <Fragment key={device.id}>
                  {index > 0 && (
                    <div className="border-t border-basic-white"></div>
                  )}
                  <div className={index === 0 ? 'pb-5' : 'pt-5'}>
                    <DeviceItem
                      icon={device.icon}
                      name={device.name}
                      location={`${device.location} | ${device.lastActive}`}
                      onSignOut={() => {
                        return;
                      }}
                    />
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
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
