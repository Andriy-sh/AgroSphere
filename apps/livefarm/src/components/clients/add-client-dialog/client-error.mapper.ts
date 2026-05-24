interface ServerErrorResponse {
  errors?: Record<string, string[]>;
  message?: string;
}

interface AxiosError {
  response?: {
    data?: ServerErrorResponse;
  };
}

const FIELD_MAPPING: Record<string, string> = {
  mobile: 'phone',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  businessName: 'businessName',
  addressLine1: 'addressLine1',
  address_line_1: 'addressLine1',
  addressLine2: 'addressLine2',
  address_line_2: 'addressLine2',
  city: 'city',
  county: 'county',
  country: 'country',
  eircode: 'eircode',
  accountNo: 'accountNo',
  account_number: 'accountNo',
  herdNo: 'herdNo',
  herd_no: 'herdNo',
  businessType: 'businessType',
  business_type: 'businessType',
};

const ERROR_CODE_MAPPING: Record<string, string> = {
  EMAIL_EXISTS: 'Client with this email already exists',
  INVALID_PHONE: 'Invalid UK/IE phone number',
  DUPLICATE_CLIENT: 'A client with this information already exists',
};

export function mapServerErrors(error: unknown): {
  fieldErrors: Record<string, string>;
  generalError?: string;
} {
  const fieldErrors: Record<string, string> = {};
  let generalError: string | undefined;

  if (!error || typeof error !== 'object') {
    return { fieldErrors, generalError };
  }

  let errorData: ServerErrorResponse | null = null;

  // Handle axios error
  if ('response' in error) {
    const axiosError = error as AxiosError;
    errorData = axiosError.response?.data || null;
  }
  // Handle direct error object
  else if ('errors' in error || 'message' in error) {
    errorData = error as ServerErrorResponse;
  }

  if (!errorData) {
    generalError = 'An error occurred while saving the client';
    return { fieldErrors, generalError };
  }

  // Map field errors
  if (errorData.errors && typeof errorData.errors === 'object') {
    Object.keys(errorData.errors).forEach((field) => {
      const fieldErrorsArray = errorData.errors?.[field];
      if (Array.isArray(fieldErrorsArray) && fieldErrorsArray.length > 0) {
        const formField = FIELD_MAPPING[field] || field;
        let errorMessage = fieldErrorsArray[0];

        // Try to map by error code if message contains known patterns
        const errorCode = extractErrorCode(errorMessage);
        if (errorCode && ERROR_CODE_MAPPING[errorCode]) {
          errorMessage = ERROR_CODE_MAPPING[errorCode];
        }

        fieldErrors[formField] = errorMessage;
      }
    });
  }

  // Map general error message
  if (errorData.message) {
    const errorCode = extractErrorCode(errorData.message);
    if (errorCode && ERROR_CODE_MAPPING[errorCode]) {
      generalError = ERROR_CODE_MAPPING[errorCode];
    } else {
      generalError = errorData.message;
    }
  }

  if (Object.keys(fieldErrors).length === 0 && !generalError) {
    generalError = 'An error occurred while saving the client';
  }

  return { fieldErrors, generalError };
}

function extractErrorCode(message: string): string | null {
  // Try to extract error code from message
  // This is a placeholder - adjust based on your backend error format
  if (message.includes('email') && message.includes('already exists')) {
    return 'EMAIL_EXISTS';
  }
  if (message.includes('phone') && message.includes('valid')) {
    return 'INVALID_PHONE';
  }
  if (message.includes('already exists')) {
    return 'DUPLICATE_CLIENT';
  }
  return null;
}
