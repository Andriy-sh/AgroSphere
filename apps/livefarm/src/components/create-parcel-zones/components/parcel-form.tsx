'use client';

import { Input, Label, FormField, CustomSelect } from '@@agrosphere/shared';
import type { CreateParcelZonesFormData } from '../hooks/use-create-parcel-zones-form';

interface ParcelFormProps {
  formData: CreateParcelZonesFormData;
  errors: {
    name?: string;
    id?: string;
  };
  farmOptions: Array<{ value: string; label: string }>;
  soilTypeOptions: Array<{ value: string; label: string }>;
  cropOptions: Array<{ value: string; label: string }>;
  drawnArea: number;
  canCreateParcel: boolean;
  updateField: (field: keyof CreateParcelZonesFormData, value: string) => void;
}

export function ParcelForm({
  formData,
  errors,
  farmOptions,
  soilTypeOptions,
  cropOptions,
  drawnArea,
  canCreateParcel,
  updateField,
}: ParcelFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Farm</Label>
        <CustomSelect
          options={farmOptions}
          value={formData.farm}
          onValueChange={(value) => updateField('farm', value || '')}
          placeholder="Select farm"
          className="w-full"
          triggerClassName="h-9 w-full"
        />
      </div>

      <div
        className={`flex flex-col gap-2 ${
          !canCreateParcel ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <FormField label="Name" required error={errors.name}>
          <Input>
            <Input.Content
              placeholder="Enter parcel name"
              className="w-full"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              disabled={!canCreateParcel}
            />
          </Input>
        </FormField>
      </div>

      <div
        className={`flex flex-col gap-2 ${
          !canCreateParcel ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <FormField label="ID" error={errors.id}>
          <Input>
            <Input.Content
              placeholder="e.g. 1A"
              className="w-full"
              value={formData.id}
              onChange={(e) => updateField('id', e.target.value)}
              disabled={!canCreateParcel}
            />
          </Input>
        </FormField>
        <p className="text-basic-gray text-sm">max 4 characters</p>
      </div>

      <div
        className={`flex gap-5 ${
          !canCreateParcel ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <div className="flex-1 flex flex-col gap-2">
          <Label>
            Area <span className="text-green-600">(Auto-calculated)</span>
          </Label>
          <div className="relative">
            <Input className="bg-[#EEF0F629]" disabled>
              <Input.Content
                placeholder="≈0.0"
                className="w-full pr-8 cursor-not-allowed"
                value={
                  formData.area
                    ? formData.area.startsWith('≈')
                      ? formData.area
                      : `≈${formData.area}`
                    : ''
                }
                readOnly
                disabled
              />
            </Input>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-basic-gray text-sm">ha</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <Label>Effective area</Label>
          <div className="relative">
            <Input>
              <Input.Content
                placeholder="Enter area"
                className="w-full pr-8"
                value={formData.effectiveArea}
                onChange={(e) => updateField('effectiveArea', e.target.value)}
                disabled={!canCreateParcel}
              />
            </Input>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-basic-gray text-sm">ha</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col gap-2 ${
          !canCreateParcel ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <Label>Soil type</Label>
        <CustomSelect
          options={soilTypeOptions}
          value={formData.soilType === 'not_set' ? '' : formData.soilType}
          onValueChange={(value) => updateField('soilType', value || 'not_set')}
          placeholder="Select soil type"
          className="w-full"
          triggerClassName="h-9 w-full"
          disabled={!canCreateParcel}
        />
      </div>

      <div
        className={`flex flex-col gap-2 ${
          !canCreateParcel ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <Label>Crop</Label>
        <CustomSelect
          options={cropOptions}
          value={formData.crop === 'not_set' ? '' : formData.crop}
          onValueChange={(value) => updateField('crop', value || 'not_set')}
          placeholder="Select crop"
          className="w-full"
          triggerClassName="h-9 w-full"
          disabled={!canCreateParcel}
        />
      </div>
    </div>
  );
}
