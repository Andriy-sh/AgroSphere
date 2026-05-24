'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect } from 'react';
import { calculateNRemoved, HARVEST_N_FACTORS } from '../utils/calculations';
import { harvestFormSchema, type HarvestFormData } from '../utils/validation';

export function useHarvestForm(
  initialHarvestType: 'silage' | 'grazing' = 'silage'
) {
  const form = useForm<HarvestFormData>({
    resolver: zodResolver(harvestFormSchema),
    defaultValues: {
      field: '',
      date: '',
      harvestType: initialHarvestType === 'silage' ? 'silage' : 'grazing',
      yield: undefined,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const harvestTypeValue =
      initialHarvestType === 'silage' ? 'silage' : 'grazing';
    form.reset({
      ...form.getValues(),
      harvestType: harvestTypeValue,
    });
  }, [initialHarvestType, form]);

  const watchedFields = form.watch(['harvestType', 'yield']);
  const [watchedHarvestType, watchedYield] = watchedFields;

  const nFactor = useMemo(() => {
    const typeMap: Record<string, string> = {
      silage: 'Silage',
      grazing: 'Grazing',
      bale: 'Bale/Hay',
    };
    const mappedType = typeMap[watchedHarvestType] || 'Silage';
    return HARVEST_N_FACTORS[mappedType] || 0;
  }, [watchedHarvestType]);

  const nRemoved = useMemo(() => {
    if (
      watchedYield === undefined ||
      watchedYield === null ||
      !Number.isFinite(watchedYield) ||
      watchedYield <= 0
    ) {
      return 0;
    }

    const mappedType =
      watchedHarvestType === 'silage'
        ? 'Silage'
        : watchedHarvestType === 'grazing'
        ? 'Grazing'
        : 'Bale/Hay';

    return calculateNRemoved(mappedType, watchedYield);
  }, [watchedHarvestType, watchedYield]);

  const harvestYieldDisplay = useMemo(() => {
    if (
      watchedYield === undefined ||
      watchedYield === null ||
      !Number.isFinite(watchedYield)
    ) {
      return '0';
    }
    return watchedYield > 0 ? watchedYield.toString() : '0';
  }, [watchedYield]);

  return {
    form,
    nFactor,
    nRemoved,
    harvestYieldDisplay,
    handleSubmit: form.handleSubmit,
  };
}
