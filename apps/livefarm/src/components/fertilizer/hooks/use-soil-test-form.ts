'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useCallback } from 'react';
import { calculateNMin } from '../utils/calculations';
import { soilTestFormSchema, type SoilTestFormData } from '../utils/validation';

export function useSoilTestForm(onSave?: () => void) {
  const form = useForm<SoilTestFormData>({
    resolver: zodResolver(soilTestFormSchema),
    defaultValues: {
      field: '',
      testDate: '',
      minNMin: undefined,
      maxNMin: undefined,
      scenario: '',
    },
    mode: 'onChange',
  });

  const watchedFields = form.watch(['minNMin', 'maxNMin', 'scenario']);
  const [watchedMinNMin, watchedMaxNMin, watchedScenario] = watchedFields;

  const nMinRange = useMemo(() => {
    const min = watchedMinNMin ?? 0;
    const max = watchedMaxNMin ?? 0;
    if (min === 0 && max === 0) return '0 - 0 kg/ha';
    return `${min} - ${max} kg/ha`;
  }, [watchedMinNMin, watchedMaxNMin]);

  const nValue = useMemo(() => {
    if (
      watchedMinNMin === undefined ||
      watchedMaxNMin === undefined ||
      !watchedScenario ||
      !Number.isFinite(watchedMinNMin) ||
      !Number.isFinite(watchedMaxNMin) ||
      watchedMinNMin < 0 ||
      watchedMaxNMin < 0
    ) {
      return 0;
    }

    const scenarioMap: Record<
      string,
      | 'Pessimistic (Low estimate)'
      | 'Medium (Average estimate)'
      | 'Optimistic (High estimate)'
    > = {
      pessimistic: 'Pessimistic (Low estimate)',
      medium: 'Medium (Average estimate)',
      optimistic: 'Optimistic (High estimate)',
    };

    const scenario =
      scenarioMap[watchedScenario] || 'Medium (Average estimate)';
    return calculateNMin(watchedMinNMin, watchedMaxNMin, scenario);
  }, [watchedMinNMin, watchedMaxNMin, watchedScenario]);

  const scenarioValues = useMemo(() => {
    const min = watchedMinNMin ?? 0;
    const max = watchedMaxNMin ?? 0;
    const avg =
      Number.isFinite(min) && Number.isFinite(max) && min > 0 && max > 0
        ? (min + max) / 2
        : 0;

    return {
      pessimistic: Number.isFinite(min) ? min : 0,
      medium: Number.isFinite(avg) ? avg : 0,
      optimistic: Number.isFinite(max) ? max : 0,
    };
  }, [watchedMinNMin, watchedMaxNMin]);

  const onSubmit = useCallback(
    async (data: SoilTestFormData) => {
      try {
        // await saveSoilTest(data);
        console.log('Soil test data:', data);
        onSave?.();
      } catch (error) {
        form.setError('root', {
          message:
            error instanceof Error ? error.message : 'Failed to save soil test',
        });
      }
    },
    [form, onSave]
  );

  return {
    form,
    nMinRange,
    nValue,
    scenarioValues,
    handleSubmit: form.handleSubmit(onSubmit),
    onSubmit,
  };
}
