'use client';

import {
  Button,
  Toggle,
  SettingsTabHeader,
  Checkbox,
  CollapsibleWithToggle,
  Label,
  Input,
  SimpleSectionHeader,
} from '@@agrosphere/shared';
import { Fragment, useEffect, useState } from 'react';
import {
  mockLabSections,
  type LabSection,
  type LabTest,
} from '@@agrosphere/shared';

interface LabCategory {
  id: string;
  name: string;
  tests: LabTest[];
  expanded: boolean;
  allSelected: boolean;
}

interface LabData {
  labName: string;
  isDefault: boolean;
  enabled: boolean;
  accountNumber: string;
  categories: LabCategory[];
  labSections?: LabSection[];
}

interface LabSettingsProps {
  labData?: LabData;
  onSave?: (data: LabData) => void;
}

const LabSectionToggle = ({
  section,
  onToggleEnabled,
  onSetDefault,
}: {
  section: LabSection;
  onToggleEnabled: (sectionId: string) => void;
  onSetDefault: (sectionId: string) => void;
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-basic-black">Enable</span>
      <Toggle
        checked={section.enabled}
        onCheckedChange={() => onToggleEnabled(section.id)}
      />
      {!section.isDefault && (
        <>
          <div className="w-px h-4 bg-gray-300"></div>
          <span
            className="text-sm text-green-600 cursor-pointer hover:text-green-700"
            onClick={() => onSetDefault(section.id)}
          >
            Set as default
          </span>
        </>
      )}
    </div>
  );
};

export function LabSettings({ labData, onSave }: LabSettingsProps) {
  const [labName, setLabName] = useState(labData?.labName || '');
  const [isDefault, setIsDefault] = useState(labData?.isDefault || false);
  const [enabled, setEnabled] = useState(labData?.enabled || false);
  const [accountNumber, setAccountNumber] = useState(
    labData?.accountNumber || ''
  );
  const [categories, setCategories] = useState<LabCategory[]>(
    labData?.categories || []
  );

  const [initialLabSections, setInitialLabSections] = useState<LabSection[]>(
    labData?.labSections || mockLabSections
  );

  const [labSections, setLabSections] = useState<LabSection[]>(
    labData?.labSections || mockLabSections
  );

  useEffect(() => {
    if (labData) {
      setLabName(labData.labName);
      setIsDefault(labData.isDefault);
      setEnabled(labData.enabled);
      setAccountNumber(labData.accountNumber);
      setCategories(labData.categories);
      if (labData.labSections) {
        setLabSections(labData.labSections);
        setInitialLabSections(labData.labSections);
      } else {
        setLabSections(mockLabSections);
        setInitialLabSections(mockLabSections);
      }
    }
  }, [labData]);

  if (!labData) {
    return <div>Loading...</div>;
  }

  const hasChanges =
    labName !== labData.labName ||
    isDefault !== labData.isDefault ||
    enabled !== labData.enabled ||
    accountNumber !== labData.accountNumber ||
    JSON.stringify(categories) !== JSON.stringify(labData.categories) ||
    JSON.stringify(labSections) !== JSON.stringify(initialLabSections);

  const handleCancel = () => {
    setLabName(labData.labName);
    setIsDefault(labData.isDefault);
    setEnabled(labData.enabled);
    setAccountNumber(labData.accountNumber);
    setCategories(labData.categories);
    if (labData.labSections) {
      setLabSections(labData.labSections);
      setInitialLabSections(labData.labSections);
    } else {
      setLabSections(mockLabSections);
      setInitialLabSections(mockLabSections);
    }
  };

  const handleToggleTestCategory = (sectionId: string, categoryId: string) => {
    setLabSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              testCategories: section.testCategories.map((cat) =>
                cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
              ),
            }
          : section
      )
    );
  };

  const handleToggleTest = (
    sectionId: string,
    categoryId: string,
    testId: string
  ) => {
    setLabSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              testCategories: section.testCategories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      tests: cat.tests.map((test) =>
                        test.id === testId
                          ? { ...test, checked: !test.checked }
                          : test
                      ),
                      allSelected: cat.tests.every((test) =>
                        test.id === testId ? !test.checked : test.checked
                      ),
                      enabled: cat.tests.every((test) =>
                        test.id === testId ? !test.checked : test.checked
                      ),
                    }
                  : cat
              ),
            }
          : section
      )
    );
  };

  const handleToggleAllTests = (
    sectionId: string,
    categoryId: string,
    shouldSelect: boolean
  ) => {
    setLabSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              testCategories: section.testCategories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      tests: cat.tests.map((test) => ({
                        ...test,
                        checked: shouldSelect,
                      })),
                      allSelected: shouldSelect,
                    }
                  : cat
              ),
            }
          : section
      )
    );
  };

  const handleAccountNumberChange = (sectionId: string, value: string) => {
    setLabSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, accountNumber: value }
          : section
      )
    );
  };

  const handleToggleSectionEnabled = (sectionId: string) => {
    setLabSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
  };

  const handleSetDefault = (sectionId: string) => {
    setLabSections((prev) =>
      prev.map((section) => ({
        ...section,
        isDefault: section.id === sectionId,
      }))
    );
  };

  const handleSave = () => {
    const sortedLabSections = [...labSections].sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return 0;
    });

    const updatedLabData = {
      ...labData,
      labName,
      isDefault,
      enabled,
      accountNumber,
      categories,
      labSections: sortedLabSections,
    };

    setInitialLabSections(sortedLabSections);

    onSave?.(updatedLabData);
  };

  return (
    <div className="flex flex-col">
      <SettingsTabHeader icon="science" title="Lab settings" />
      <div className="space-y-5">
        {labSections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-xl shadow-sm border border-basic-white"
          >
            <SimpleSectionHeader title={section.name}>
              <LabSectionToggle
                section={section}
                onToggleEnabled={handleToggleSectionEnabled}
                onSetDefault={handleSetDefault}
              />
            </SimpleSectionHeader>
            <div className="p-5">
              <div className="space-y-4">
                <div className="flex flex-col w-full gap-2">
                  <Label htmlFor={`account-${section.id}`}>
                    Account number
                  </Label>
                  <Input
                    id={`account-${section.id}`}
                    type="text"
                    value={section.accountNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleAccountNumberChange(section.id, e.target.value);
                    }}
                    placeholder="Enter your account number"
                  />
                </div>
                <div className="space-y-4">
                  {section.testCategories.map((category, index) => (
                    <div key={category.id}>
                      <CollapsibleWithToggle
                        title={category.name}
                        defaultOpen={false}
                        defaultEnabled={
                          category.tests.filter(
                            (test) => test.name.trim() !== ''
                          ).length > 0
                            ? category.enabled
                            : false
                        }
                        disabled={
                          category.tests.filter(
                            (test) => test.name.trim() !== ''
                          ).length === 0
                        }
                        onToggleChange={(enabled) => {
                          if (
                            category.tests.filter(
                              (test) => test.name.trim() !== ''
                            ).length > 0
                          ) {
                            handleToggleTestCategory(section.id, category.id);
                            handleToggleAllTests(
                              section.id,
                              category.id,
                              enabled
                            );
                          }
                        }}
                      >
                        {category.tests.filter(
                          (test) => test.name.trim() !== ''
                        ).length > 0 ? (
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                              {category.tests
                                .slice(0, Math.ceil(category.tests.length / 2))
                                .filter((test) => test.name.trim() !== '')
                                .map((test) => (
                                  <div
                                    key={test.id}
                                    className="flex items-center gap-2"
                                  >
                                    <Checkbox
                                      checked={test.checked}
                                      onCheckedChange={() =>
                                        handleToggleTest(
                                          section.id,
                                          category.id,
                                          test.id
                                        )
                                      }
                                    />
                                    <span className="text-sm text-basic-black">
                                      {test.name}
                                    </span>
                                  </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                              {category.tests
                                .slice(Math.ceil(category.tests.length / 2))
                                .filter((test) => test.name.trim() !== '')
                                .map((test) => (
                                  <div
                                    key={test.id}
                                    className="flex items-center gap-2"
                                  >
                                    <Checkbox
                                      checked={test.checked}
                                      onCheckedChange={() =>
                                        handleToggleTest(
                                          section.id,
                                          category.id,
                                          test.id
                                        )
                                      }
                                    />
                                    <span className="text-sm text-basic-black">
                                      {test.name}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <span className="text-sm text-gray-500">
                              No data available
                            </span>
                          </div>
                        )}
                      </CollapsibleWithToggle>
                      {index < section.testCategories.length - 1 && (
                        <div className="my-3 h-px bg-basic-white"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
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
