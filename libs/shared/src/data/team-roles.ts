export interface TeamRole {
  value: string;
  label: string;
}

export const TEAM_ROLES: TeamRole[] = [
  {
    value: 'advisor_subscription_owner',
    label: 'Advisor Subscription Owner',
  },
  { value: 'advisor_admin', label: 'Advisor Admin' },
  { value: 'advisor_editor', label: 'Advisor Editor' },
  { value: 'advisor_viewer', label: 'Advisor Viewer' },
];
