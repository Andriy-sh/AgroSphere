'use client';

import React from 'react';
import { Button } from '@@agrosphere/shared';
import { useBusinessForm } from '../hooks/use-business-form';
import { UserTypeSelector } from './user-type-selector';
import { FarmerFormSection } from './farmer-form-section';
import { AgriBusinessFormSection } from './agri-business-form-section';

export const BusinessInfoForm: React.FC = () => {
  const { form, onSubmit, isFormValid, userType, setValue, isLoading } =
    useBusinessForm();

  const {
    register,
    control,
    formState: { errors: formErrors },
  } = form;

  const handleUserTypeChange = (value: 'farmer' | 'agri-business') => {
    setValue('userType', value, { shouldValidate: true });
    if (value === 'farmer') {
      setValue('businessCategory', '');
    } else {
      setValue('farmCategory', '');
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="space-y-4">
        <UserTypeSelector
          userType={userType}
          onUserTypeChange={handleUserTypeChange}
          error={formErrors.userType?.message}
        />
      </div>

      {userType === 'agri-business' && (
        <AgriBusinessFormSection
          control={control}
          register={register}
          errors={formErrors}
        />
      )}

      {userType === 'farmer' && (
        <FarmerFormSection
          control={control}
          register={register}
          errors={formErrors}
        />
      )}

      <Button
        variant="complete"
        size="md"
        type="submit"
        className={`w-full ${
          isFormValid && !isLoading
            ? 'bg-basic-green !text-white'
            : 'opacity-50 bg-basic-green cursor-not-allowed'
        }`}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? 'Creating...' : 'Create account'}
      </Button>
    </form>
  );
};
