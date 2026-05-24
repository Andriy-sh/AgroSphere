'use client';

import React from 'react';
import { Control, UseFormRegister } from 'react-hook-form';
import { BusinessNameField } from './form-fields/business-name-field';
import { BusinessEmailField } from './form-fields/business-email-field';
import { BusinessTypeSelector } from './form-fields/business-type-selector';
import { CategorySelector } from './form-fields/category-selector';
import { BusinessProfileFormData } from '../types/form';
import {
  FARM_CATEGORY_OPTIONS,
  FARMER_BUSINESS_TYPE_OPTIONS,
} from '../constants/form-options';

interface FarmerFormSectionProps {
  control: Control<BusinessProfileFormData>;
  register: UseFormRegister<BusinessProfileFormData>;
  errors: {
    businessType?: { message?: string };
    businessName?: { message?: string };
    email?: { message?: string };
    farmCategory?: { message?: string };
  };
}

export const FarmerFormSection: React.FC<FarmerFormSectionProps> = ({
  control,
  register,
  errors,
}) => {
  return (
    <>
      <BusinessTypeSelector
        control={control}
        options={FARMER_BUSINESS_TYPE_OPTIONS}
        error={errors.businessType?.message}
        layout="two-columns"
      />

      <BusinessNameField
        register={register('businessName')}
        error={errors.businessName?.message}
        placeholder="Enter business name"
      />

      <BusinessEmailField
        register={register('email')}
        error={errors.email?.message}
      />

      <CategorySelector
        control={control}
        fieldName="farmCategory"
        options={FARM_CATEGORY_OPTIONS}
        label="Select your category"
        error={errors.farmCategory?.message}
        layout="two-columns"
      />
    </>
  );
};
