export interface Subscription  {
    id: string;
    trial_ends_at: string | null;
    ends_at:  string | null;
    created_at: string;
    products: {
        name: string;
        description: string;
    }[];
}

export interface SubscriptionListResponse {
  data: Subscription[];
}

export interface CustomerSecretResponse {
  client_secret: string;
}