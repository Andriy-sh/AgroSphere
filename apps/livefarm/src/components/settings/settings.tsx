'use client';

import React from 'react';
import { SettingsTabs, MapPicker } from '@@agrosphere/shared';
import { useState } from 'react';
import { type LabTest } from '@@agrosphere/shared';
import { useQueryState, parseAsString, parseAsFloat } from 'nuqs';
import AccountSettings from '@/components/settings/settings-account';
import { SecuritySettings } from '@/components/settings/settings-security';
import { PersonalPreferences } from '@/components/settings/settings-personal-preferences';
import { NotificationSettings } from '@/components/settings/settings-notification';
import GeneralSettings from '@/components/settings/settings-general';
import { BillingSubscription } from '@/components/settings/settings-billing-subscription';
import { LabSettings } from '@/components/settings/settings-lab';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatarSrc?: string;
  address?: string;
}

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

interface PersonalPreferencesData {
  units: 'metric' | 'imperial';
  language: string;
  autoTimezone: boolean;
  timezone: string;
}

interface NotificationData {
  email: {
    allEnabled: boolean;
    taskNotifications: boolean;
    reminders: boolean;
    labOrder: boolean;
    comments: boolean;
    subscription: boolean;
    systemUpdates: boolean;
  };
  desktop: {
    allEnabled: boolean;
    taskNotifications: boolean;
    reminders: boolean;
    labOrder: boolean;
  };
}

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
}

interface LabData {
  labName: string;
  isDefault: boolean;
  enabled: boolean;
  accountNumber: string;
  categories: LabCategory[];
}

interface LabCategory {
  id: string;
  name: string;
  tests: LabTest[];
  expanded: boolean;
  allSelected: boolean;
}

const mockUserData: UserData = {
  firstName: 'Robert',
  lastName: 'Fox',
  email: 'curtis.weaver@example.com',
  phone: '+353 85 123 4567',
  role: 'Administrator',
  avatarSrc: '',
  address: '',
};

const mockSecurityData: SecurityData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactor: {
    sms: false,
    totp: false,
  },
  devices: [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      location: 'London, UK',
      lastActive: 'August 7 at 10:20 AM',
      icon: 'mobile_2',
    },
    {
      id: '2',
      name: 'MacBook Pro',
      location: 'Dublin, Ireland',
      lastActive: 'August 5 at 20:00 PM',
      icon: 'computer',
    },
  ],
};

const mockPreferencesData: PersonalPreferencesData = {
  units: 'metric',
  language: 'en-us',
  autoTimezone: true,
  timezone: 'dublin',
};

const mockNotificationData: NotificationData = {
  email: {
    allEnabled: false,
    taskNotifications: true,
    reminders: true,
    labOrder: false,
    comments: false,
    subscription: true,
    systemUpdates: true,
  },
  desktop: {
    allEnabled: false,
    taskNotifications: true,
    reminders: true,
    labOrder: true,
  },
};

const mockGeneralData: GeneralData = {
  logoSrc: '',
  businessType: 'limited-company',
  businessName: 'GreenMark',
  businessCategory: 'advisor-agronomist',
  addressLine1: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
  addressLine2: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
  country: 'ie',
  eircode: '',
  county: '',
  phone: '+353 85 123 4567',
  vatNo: 'IE1234567A',
  businessNo: '123456',
};

const mockLabData: LabData = {
  labName: 'Southern Scientific',
  isDefault: true,
  enabled: true,
  accountNumber: 'SOU-3027-IRL',
  categories: [],
};

export default function Settings() {
  const [activeTab, setActiveTab] = useQueryState(
    'settingsTab',
    parseAsString.withDefault('account')
  );

  const [, setMapLat] = useQueryState('mapLat', parseAsFloat.withDefault(0));

  const [, setMapLng] = useQueryState('mapLng', parseAsFloat.withDefault(0));

  const [, setMapAddress] = useQueryState(
    'mapAddress',
    parseAsString.withDefault('')
  );

  const [userData, setUserData] = useState<UserData>(mockUserData);
  const [securityData, setSecurityData] =
    useState<SecurityData>(mockSecurityData);
  const [preferencesData, setPreferencesData] =
    useState<PersonalPreferencesData>(mockPreferencesData);
  const [notificationData, setNotificationData] =
    useState<NotificationData>(mockNotificationData);
  const [generalData, setGeneralData] = useState<GeneralData>(mockGeneralData);
  const [labData, setLabData] = useState<LabData>(mockLabData);

  const [isMapPickerMode, setIsMapPickerMode] = useState(false);
  const [mapPickerField, setMapPickerField] = useState<
    'addressLine1' | 'addressLine2' | 'accountAddress' | null
  >(null);

  const handleAccountSave = (updatedData: UserData) => {
    setUserData(updatedData);
  };

  const handleSecuritySave = (updatedData: SecurityData) => {
    setSecurityData(updatedData);
  };

  const handlePreferencesSave = (updatedData: PersonalPreferencesData) => {
    setPreferencesData(updatedData);
  };

  const handleNotificationSave = (updatedData: NotificationData) => {
    setNotificationData(updatedData);
  };

  const handleGeneralSave = (updatedData: GeneralData) => {
    setGeneralData(updatedData);
  };

  const handleLabSave = (updatedData: LabData) => {
    setLabData(updatedData);
  };

  const handleManageSubscription = () => {
    const stripePortalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL;
    if (stripePortalUrl) {
      window.open(stripePortalUrl, '_blank');
    } else {
      console.error(
        'NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL environment variable is not defined'
      );
    }
  };
  const handleOpenMapPicker = (
    field: 'addressLine1' | 'addressLine2' | 'accountAddress'
  ) => {
    setMapPickerField(field);
    setIsMapPickerMode(true);
  };

  const handleAddressSelect = (
    address: string,
    coordinates: { lat: number; lng: number }
  ) => {
    setMapLat(coordinates.lat);
    setMapLng(coordinates.lng);
    setMapAddress(address);

    if (mapPickerField === 'addressLine1') {
      setGeneralData((prev) => ({ ...prev, addressLine1: address }));
    } else if (mapPickerField === 'addressLine2') {
      setGeneralData((prev) => ({ ...prev, addressLine2: address }));
    } else if (mapPickerField === 'accountAddress') {
      setUserData((prev) => ({ ...prev, address: address }));
    }
    setIsMapPickerMode(false);
    setMapPickerField(null);
  };

  const handleCloseMapPicker = () => {
    setIsMapPickerMode(false);
    setMapPickerField(null);
    setMapLat(0);
    setMapLng(0);
    setMapAddress('');
  };

  const tabs = [
    {
      id: 'account',
      label: 'Account settings',
      icon: 'person',
      group: 'Account settings',
    },
    {
      id: 'security',
      label: 'Security settings',
      icon: 'lock',
      group: 'Account settings',
    },
    {
      id: 'preferences',
      label: 'Personal preferences',
      icon: 'tune',
      group: 'Account settings',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'notifications',
      group: 'Account settings',
    },
    {
      id: 'general',
      label: 'General',
      icon: 'settings',
      group: 'Organisation settings',
    },
    {
      id: 'billing',
      label: 'Billing & Subscription',
      icon: 'credit_card',
      group: 'Organisation settings',
    },
    {
      id: 'lab',
      label: 'Lab settings',
      icon: 'experiment',
      group: 'Organisation settings',
    },
  ];

  return (
    <div className="flex h-full gap-2 min-h-0">
      {!isMapPickerMode && (
        <div className="w-60 bg-white rounded-xl shadow-sm border border-basic-gray-light flex flex-col min-h-0">
          <SettingsTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      )}

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-basic-gray-light  flex flex-col min-h-0 overflow-hidden">
        {isMapPickerMode ? (
          <div className="h-full">
            <MapPicker
              isOpen={true}
              onClose={handleCloseMapPicker}
              onAddressSelect={handleAddressSelect}
              initialAddress={
                mapPickerField === 'addressLine1'
                  ? generalData.addressLine1
                  : mapPickerField === 'addressLine2'
                  ? generalData.addressLine2
                  : userData.address || ''
              }
            />
          </div>
        ) : (
          <div className="p-5 flex-1 min-h-0 overflow-y-auto">
            {activeTab === 'account' && (
              <AccountSettings
                accountData={userData}
                onSave={handleAccountSave}
                onOpenMapPicker={handleOpenMapPicker}
              />
            )}

            {activeTab === 'security' && (
              <SecuritySettings
                securityData={securityData}
                onSave={handleSecuritySave}
              />
            )}

            {activeTab === 'preferences' && (
              <PersonalPreferences
                preferencesData={preferencesData}
                onSave={handlePreferencesSave}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettings
                notificationData={notificationData}
                onSave={handleNotificationSave}
              />
            )}

            {activeTab === 'general' && (
              <GeneralSettings
                generalData={generalData}
                onSave={handleGeneralSave}
                onOpenMapPicker={handleOpenMapPicker}
              />
            )}

            {activeTab === 'billing' && (
              <BillingSubscription
                onManageSubscription={handleManageSubscription}
              />
            )}

            {activeTab === 'lab' && (
              <LabSettings labData={labData} onSave={handleLabSave} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
