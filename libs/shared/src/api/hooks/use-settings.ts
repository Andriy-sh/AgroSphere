'use client';
import { useApi } from './use-api';
import { SettingsService } from '../services/settings/settings-service';
import {
  SubscriptionListResponse,
  CustomerSecretResponse,
} from '../services/settings/settings-types';
import { useCallback } from 'react';

export function useSubscriptions() {
  const {
    data: subscriptions,
    loading,
    error,
    execute,
  } = useApi<SubscriptionListResponse>();

  const fetchSubscriptions = useCallback(async () => {
    const result = await execute(() => SettingsService.getSubscriptions());
    return result;
  }, [execute]);

  return {
    subscriptions: subscriptions?.data || [],
    loading,
    error,
    fetchSubscriptions,
  };
}

export function useCustomerSecret() {
  const {
    data: customerSecretData,
    loading,
    error,
    execute,
  } = useApi<CustomerSecretResponse>();

  const createCustomerSecret = useCallback(async () => {
    const result = await execute(() => SettingsService.createCustomerSecret());
    return result;
  }, [execute]);

  return {
    customerSecret: customerSecretData?.client_secret || '',
    loading,
    error,
    createCustomerSecret,
  };
}

export function useSettings() {
  const subscriptionHook = useSubscriptions();
  const customerSecretHook = useCustomerSecret();

  return {
    subscriptions: subscriptionHook,
    customerSecret: customerSecretHook,
    // Add other settings-related hooks here as they're created
  };
}

