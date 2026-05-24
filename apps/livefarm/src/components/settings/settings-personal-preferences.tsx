'use client';

import {
  SimpleSectionHeader,
  Toggle,
  SettingsTabHeader,
  TimezoneSelect,
  Icon,
} from '@@agrosphere/shared';
import { CustomSelect } from '@@agrosphere/shared';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

interface PersonalPreferencesData {
  units: 'metric' | 'imperial';
  language: string;
  autoTimezone: boolean;
  timezone: string;
}

interface PersonalPreferencesProps {
  preferencesData?: PersonalPreferencesData;
  onSave?: (data: PersonalPreferencesData) => void;
}

const PreferenceOption = ({
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
      <div className="flex items-center gap-3">
        <Icon icon={icon}/>
        <h3 className="text-sm font-medium text-basic-black">{title}</h3>
      </div>
      <p className="text-sm font-normal text-basic-gray">{description}</p>
    </div>
    <Toggle checked={enabled} onCheckedChange={onToggle} />
  </div>
);

const SelectOption = ({
  icon,
  title,
  description,
  value,
  options,
  onChange,
}: {
  icon: string;
  title: string;
  description: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <Icon icon={icon}/>
        <h3 className="text-sm font-medium text-basic-black">{title}</h3>
      </div>
      <p className="text-sm font-normal text-basic-gray">{description}</p>
    </div>
    <div className="w-52">
      {title === 'Timezone' && (
        <TimezoneSelect value={value} onChange={onChange} />
      )}
      {title !== 'Timezone' && (
        <CustomSelect
          options={options}
          value={value}
          onValueChange={onChange}
          placeholder={`Select ${title.toLowerCase()}`}
          className="w-full"
          triggerClassName="w-full"
          popupClassName="w-52 "
          renderTrigger={({ selectedOption, isOpen, onClick, disabled }) => (
            <button
              type="button"
              onClick={onClick}
              disabled={disabled}
              className="w-full h-9 px-3 py-2 text-sm text-basic-black bg-white border border-basic-white rounded-md focus-within:border-basic-green focus:outline-none flex items-center justify-between gap-2 cursor-pointer transition-colors duration-200"
            >
              <span className="truncate text-left flex-1">
                {selectedOption?.label || `Select ${title.toLowerCase()}`}
              </span>
              <Icon icon="expand_all" className="text-basic-gray transition-transform duration-200 flex-shrink-0" />
            </button>
          )}
        />
      )}
    </div>
  </div>
);

export function PersonalPreferences({
  preferencesData,
  onSave,
}: PersonalPreferencesProps) {
  const isInitialRender = useRef(true);
  const previousValues = useRef<PersonalPreferencesData | null>(null);

  const [metricEnabled, setMetricEnabled] = useState<boolean>(
    preferencesData?.units === 'metric' || true
  );
  const [imperialEnabled, setImperialEnabled] = useState<boolean>(
    preferencesData?.units === 'imperial' || false
  );
  const [language, setLanguage] = useState<string>(
    preferencesData?.language || 'en-us'
  );
  const [autoTimezone, setAutoTimezone] = useState<boolean>(
    preferencesData?.autoTimezone ?? true
  );
  const [timezone, setTimezone] = useState<string>(
    preferencesData?.timezone || 'dublin'
  );

  useEffect(() => {
    if (preferencesData) {
      const hasChanged =
        !previousValues.current ||
        JSON.stringify(preferencesData) !==
          JSON.stringify(previousValues.current);

      if (hasChanged) {
        setMetricEnabled(preferencesData.units === 'metric');
        setImperialEnabled(preferencesData.units === 'imperial');
        setLanguage(preferencesData.language);
        setAutoTimezone(preferencesData.autoTimezone);
        setTimezone(preferencesData.timezone);
        previousValues.current = preferencesData;
      }
    }
    isInitialRender.current = false;
  }, [preferencesData]);

  useEffect(() => {
    if (preferencesData && !isInitialRender.current) {
      const preferences: PersonalPreferencesData = {
        units: metricEnabled ? 'metric' : 'imperial',
        language,
        autoTimezone,
        timezone,
      };

      const hasChanged =
        !previousValues.current ||
        JSON.stringify(preferences) !== JSON.stringify(previousValues.current);

      if (hasChanged) {
        previousValues.current = preferences;
        onSave?.(preferences);
      }
    }
  }, [
    metricEnabled,
    imperialEnabled,
    language,
    autoTimezone,
    timezone,
    onSave,
    preferencesData,
  ]);

  if (!preferencesData) {
    return <div>Loading...</div>;
  }

  const languageOptions = [
    { value: 'en-us', label: 'English (US)' },
    { value: 'en-gb', label: 'English (UK)' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
  ];

  const timezoneOptions = [
    { value: 'dublin', label: 'Dublin (GMT +1:00)' },
    { value: 'london', label: 'London (GMT +0:00)' },
    { value: 'new-york', label: 'New York (GMT -5:00)' },
    { value: 'tokyo', label: 'Tokyo (GMT +9:00)' },
    { value: 'sydney', label: 'Sydney (GMT +10:00)' },
  ];

  const handleMetricToggle = () => {
    setMetricEnabled(true);
    setImperialEnabled(false);
  };

  const handleImperialToggle = () => {
    setImperialEnabled(true);
    setMetricEnabled(false);
  };

  return (
    <div className="flex flex-col">
      <SettingsTabHeader icon="discover_tune" title="Personal preferences" />

      <div className="space-y-3">
        <div className="bg-white rounded-xl shadow-sm border border-basic-white">
          <SimpleSectionHeader title="Units of measurement" />
          <div className="p-5">
            <div className="space-y-0">
              <div className="pb-5">
                <PreferenceOption
                  icon="straighten"
                  title="Metric"
                  description="Hectares, meters etc."
                  enabled={metricEnabled}
                  onToggle={handleMetricToggle}
                />
              </div>

              <div className="border-t border-basic-white"></div>

              <div className="pt-5">
                <PreferenceOption
                  icon="architecture"
                  title="Imperial"
                  description="Acres, feet, pounds etc."
                  enabled={imperialEnabled}
                  onToggle={handleImperialToggle}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-basic-white">
          <SimpleSectionHeader title="Language & Time" />
          <div className="p-5">
            <div className="space-y-0">
              <div className="pb-5">
                <SelectOption
                  icon="translate"
                  title="Language"
                  description="Change the language used in the user interface."
                  value={language}
                  options={languageOptions}
                  onChange={setLanguage}
                />
              </div>

              <div className="border-t border-basic-white"></div>

              <div className="py-5">
                <PreferenceOption
                  icon="language"
                  title="Set timezone automatically using your location"
                  description="Reminders, notifications and emails are delivered based on your time zone."
                  enabled={autoTimezone}
                  onToggle={() => setAutoTimezone(!autoTimezone)}
                />
              </div>

              <div className="border-t border-basic-white"></div>

              <div className="pt-5">
                <SelectOption
                  icon="language"
                  title="Timezone"
                  description="Current timezone setting."
                  value={timezone}
                  options={timezoneOptions}
                  onChange={setTimezone}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
