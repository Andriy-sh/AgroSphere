import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { setupAuthInterceptor } from './interceptors/auth-interceptor';
import { setupErrorInterceptor } from './interceptors/error-interceptor';
import { setupLoggingInterceptor } from './interceptors/logging-interceptor';

interface ApiClientOptions {
  config?: AxiosRequestConfig;
  applyAuthInterceptor?: boolean;
  applyErrorInterceptor?: boolean;
  applyLoggingInterceptor?: boolean;
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(options: ApiClientOptions = {}) {
    const {
      config,
      applyAuthInterceptor = true,
      applyErrorInterceptor = true,
      applyLoggingInterceptor = true,
    } = options;

    const apiRoot = process.env.NEXT_PUBLIC_API_URL;
    const baseURL = apiRoot ? `${apiRoot}/api` : '/api';
    const defaultTimeout =
      process.env.NODE_ENV === 'development' ? 20000 : 10000;

    this.client = axios.create({
      baseURL,
      timeout: defaultTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    });

    this.setupInterceptors({
      applyAuthInterceptor,
      applyErrorInterceptor,
      applyLoggingInterceptor,
    });
  }

  private setupInterceptors(options: {
    applyAuthInterceptor: boolean;
    applyErrorInterceptor: boolean;
    applyLoggingInterceptor: boolean;
  }) {
    if (options.applyAuthInterceptor) {
      setupAuthInterceptor(this.client);
    }
    if (options.applyErrorInterceptor) {
      setupErrorInterceptor(this.client);
    }
    if (options.applyLoggingInterceptor) {
      setupLoggingInterceptor(this.client);
    }
  }

  public get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();

export const localApiClient = new ApiClient({
  config: {
    baseURL: '/api',
  },
});

export const eosdaApiClient = new ApiClient({
  config: {
    baseURL: 'https://api-connect.eos.com',
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_EOSDA_API_KEY,
    },
  },
  applyAuthInterceptor: false,
  applyErrorInterceptor: false,
  applyLoggingInterceptor: true,
});
