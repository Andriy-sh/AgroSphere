export interface StatusColorConfig {
  backgroundColor: string;
  borderColor?: string;
}

export interface StatusColorOptions {
  includeBorder?: boolean;
  defaultBorderColor?: string;
}

export const getStatusColor = (
  status: string,
  options: StatusColorOptions = {}
): StatusColorConfig => {
  const { includeBorder = false, defaultBorderColor = '#fff' } = options;

  let backgroundColor: string;

  switch (status.toLowerCase()) {
    case 'completed':
      backgroundColor = '#29b54c';
      break;
    case 'in_progress':
      backgroundColor = '#41b0ff';
      break;
    case 'cancelled':
      backgroundColor = '#ff323f';
      break;
    case 'pending':
      backgroundColor = '#FF8A3D';
      break;
    case 'not started':
    case 'not_started':
      backgroundColor = '#ffc652';
      break;
    case 'assigned':
      backgroundColor = '#41b0ff';
      break;
    default:
      backgroundColor = '#818d99';
  }

  if (includeBorder) {
    return {
      backgroundColor,
      borderColor: defaultBorderColor,
    };
  }

  return {
    backgroundColor,
  };
};

export const getStatusBackgroundColor = (status: string): string => {
  return getStatusColor(status).backgroundColor;
};

export const getStatusLabel = (status: string): string => {
  return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};
