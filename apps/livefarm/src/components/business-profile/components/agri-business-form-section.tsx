'use client';

import React from 'react';
import { Control, UseFormRegister } from 'react-hook-form';
import { BusinessNameField } from './form-fields/business-name-field';
import { BusinessEmailField } from './form-fields/business-email-field';
import { BusinessTypeSelector } from './form-fields/business-type-selector';
import { CategorySelector } from './form-fields/category-selector';
import { BusinessProfileFormData } from '../types/form';
import { AGRI_BUSINESS_TYPE_OPTIONS, BUSINESS_CATEGORY_OPTIONS } from '../constants/form-options';


interface AgriBusinessFormSectionProps {
  control: Control<BusinessProfileFormData>;
  register: UseFormRegister<BusinessProfileFormData>;
  errors: {
    businessType?: { message?: string };
    businessName?: { message?: string };
    email?: { message?: string };
    businessCategory?: { message?: string };
  };
}

export const AgriBusinessFormSection: React.FC<
  AgriBusinessFormSectionProps
> = ({ control, register, errors }) => {
  return (
    <>
      <BusinessTypeSelector
        control={control}
        options={AGRI_BUSINESS_TYPE_OPTIONS}
        error={errors.businessType?.message}
        layout="single-column"
      />

      <BusinessNameField
        register={register('businessName')}
        error={errors.businessName?.message}
        placeholder="Enter business or legal name"
      />

      <BusinessEmailField
        register={register('email')}
        error={errors.email?.message}
      />

      <CategorySelector
        control={control}
        fieldName="businessCategory"
        options={BUSINESS_CATEGORY_OPTIONS}
        label="Select your category"
        error={errors.businessCategory?.message}
        layout="two-columns"
      />
    </>
  );
};

