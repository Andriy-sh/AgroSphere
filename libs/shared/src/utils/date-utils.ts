import { format } from 'date-fns';

export const formatTaskDate = (
  dateString: string | null | undefined
): string => {
  if (!dateString || dateString === 'Invalid Date') {
    return 'No date';
  }

  if (dateString.includes(' ')) {
    return dateString;
  }

  try {
    if (dateString.includes('-') && dateString.split('-').length === 3) {
      const parts = dateString.split('-');
      if (
        parts[0].length === 2 &&
        parts[1].length === 2 &&
        parts[2].length === 4
      ) {
        const [day, month, year] = parts;
        const isoDate = `${year}-${month}-${day}`;
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) {
          return 'Invalid date';
        }
        return format(date, 'MMM d');
      }
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return format(date, 'MMM d');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString || dateString === 'Invalid Date') {
    return 'No date';
  }

  if (dateString.includes(' ')) {
    return dateString;
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return format(date, 'MMM d');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatShortDate = (
  dateString: string | null | undefined
): string => {
  if (!dateString || dateString === 'Invalid Date') {
    return 'No date';
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return format(date, 'MMM dd');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDateWithYear = (
  dateString: string | null | undefined
): string => {
  if (!dateString || dateString === 'Invalid Date') {
    return 'No date';
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return format(date, 'MMMM dd, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export const isValidDate = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};

export const formatTaskType = (taskType: string | null | undefined): string => {
  if (!taskType) return '---';

  if (taskType.includes(' ') && /[A-Z]/.test(taskType)) {
    return taskType;
  }

  if (taskType.includes('_')) {
    return taskType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  return taskType.charAt(0).toUpperCase() + taskType.slice(1).toLowerCase();
};
