'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { calculateNValue, PRODUCT_N_VALUES } from '../utils/calculations';
import {
  applicationFormSchema,
  type ApplicationFormData,
} from '../utils/validation';

const PRODUCT_VALUE_TO_NAME: Record<string, string> = {
  'can-27': 'CAN',
  'urea-46': 'Urea',
  '18-6-12': '18-6-12',
  'cattle-slurry': 'Cattle Slurry',
  'pig-slurry': 'Pig Slurry',
};

export function useApplicationForm() {
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      field: '',
      date: '', // Empty by default, DateSelector will set current date automatically
      applicationType: '',
      product: '',
      rate: undefined,
    },
    mode: 'onTouched',
  });

  const watchedFields = form.watch(['product', 'rate', 'applicationType']);
  const [watchedProduct, watchedRate, watchedApplicationType] = watchedFields;

  const rateUnit = useMemo<'kg/ha' | 'm³/ha'>(() => {
    if (watchedApplicationType === 'slurry') {
      return 'm³/ha';
    }
    return 'kg/ha';
  }, [watchedApplicationType]);

  const productName = useMemo(() => {
    if (!watchedProduct) return null;
    return PRODUCT_VALUE_TO_NAME[watchedProduct] || null;
  }, [watchedProduct]);

  const productData = useMemo(() => {
    if (!productName) return null;
    return PRODUCT_N_VALUES[productName] || null;
  }, [productName]);

  const nValue = useMemo(() => {
    if (
      !productName ||
      watchedRate === undefined ||
      watchedRate === null ||
      !Number.isFinite(watchedRate) ||
      watchedRate <= 0
    ) {
      return 0;
    }

    return calculateNValue(productName, watchedRate, rateUnit);
  }, [productName, watchedRate, rateUnit]);

  const applicationRate = useMemo(() => {
    if (
      watchedRate === undefined ||
      watchedRate === null ||
      !Number.isFinite(watchedRate)
    ) {
      return '0';
    }
    return watchedRate > 0 ? watchedRate.toString() : '0';
  }, [watchedRate]);

  const nPercentage = useMemo(() => {
    if (!productData || watchedApplicationType !== 'chemical') return null;
    return productData.nPercentage;
  }, [productData, watchedApplicationType]);

  const nAvailability = useMemo(() => {
    if (!productData || watchedApplicationType !== 'slurry') return null;
    return productData.nPercentage;
  }, [productData, watchedApplicationType]);

  return {
    form,
    applicationRate,
    rateUnit,
    nValue,
    nPercentage,
    nAvailability,
    handleSubmit: form.handleSubmit,
  };
}
