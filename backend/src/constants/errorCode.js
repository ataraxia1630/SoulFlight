const ERROR_CODES = {
  //token
  INVALID_ACCESS_TOKEN: {
    message: 'Invalid access token',
    statusCode: 401,
    code: 'INVALID_ACCESS_TOKEN',
  },
  INVALID_REFRESH_TOKEN: {
    message: 'Invalid refresh token',
    statusCode: 401,
    code: 'INVALID_REFRESH_TOKEN',
  },
  EXPIRED_ACCESS_TOKEN: {
    message: 'Access token has expired or not found',
    statusCode: 401,
    code: 'EXPIRED_ACCESS_TOKEN',
  },
  EXPIRED_REFRESH_TOKEN: {
    message: 'Refresh token has expired or not found',
    statusCode: 401,
    code: 'EXPIRED_REFRESH_TOKEN',
  },
  REVOKED_REFRESH_TOKEN: {
    message: 'Refresh token has been revoked',
    statusCode: 401,
    code: 'REVOKED_REFRESH_TOKEN',
  },

  // signup
  INVALID_CREDENTIALS: {
    message: 'Invalid email or password',
    statusCode: 401,
    code: 'INVALID_CREDENTIALS',
  },
  EMAIL_REGISTERED: {
    message: 'Email already registered',
    statusCode: 400,
    code: 'EMAIL_REGISTERED',
  },

  // otp
  OTP_EXPIRED: {
    message: 'OTP has expired or not found',
    statusCode: 400,
    code: 'OTP_EXPIRED',
  },
  OTP_INVALID: {
    message: 'Invalid OTP',
    statusCode: 400,
    code: 'OTP_INVALID',
  },
  OTP_LIMIT_EXCEEDED: {
    message: 'OTP request limit exceeded. Please try again later.',
    statusCode: 429,
    code: 'OTP_LIMIT_EXCEEDED',
  },

  // create user
  INVALID_VERIFICATION_TOKEN: {
    message: 'Invalid or expired verification token',
    statusCode: 400,
    code: 'INVALID_VERIFICATION_TOKEN',
  },
  USERNAME_TAKEN: {
    message: 'Username already taken',
    statusCode: 400,
    code: 'USERNAME_TAKEN',
  },
  PHONE_REGISTERED: {
    message: 'Phone number already registered',
    statusCode: 400,
    code: 'PHONE_REGISTERED',
  },
  EMAIL_MISMATCH: {
    message: 'Email mismatch',
    statusCode: 400,
    code: 'EMAIL_MISMATCH',
  },

  USER_NOT_FOUND: {
    message: 'User not found',
    statusCode: 404,
    code: 'USER_NOT_FOUND',
  },

  //login
  WRONG_CREDENTIALS: {
    message: 'Wrong username/email or password',
    statusCode: 401,
    code: 'WRONG_CREDENTIALS',
  },
  ACCOUNT_LOCKED: {
    message: 'Account is locked. Please contact support.',
    statusCode: 403,
    code: 'ACCOUNT_LOCKED',
  },

  //missing fields
  MISSING_FIELDS: {
    message: 'Missing required fields',
    statusCode: 400,
    code: 'MISSING_FIELDS',
  },

  //profile
  PROFILE_NOT_FOUND: {
    message: 'Profile not found',
    statusCode: 404,
    code: 'PROFILE_NOT_FOUND',
  },
  PROFILE_ALREADY_EXISTS: {
    message: 'Profile already exists',
    statusCode: 400,
    code: 'PROFILE_ALREADY_EXISTS',
  },

  //menu
  MENU_NOT_FOUND: {
    message: 'Menu not found',
    statusCode: 404,
    code: 'MENU_NOT_FOUND',
  },

  //menu item
  MENU_ITEM_NOT_FOUND: {
    message: 'Menu Item not found',
    statusCode: 404,
    code: 'MENU_ITEM_NOT_FOUND',
  },

  //service tag
  SERVICE_TAG_NOT_FOUND: {
    message: 'Service Tag not found',
    statusCode: 404,
    code: 'SERVICE_TAG_NOT_FOUND',
  },

  //service type
  SERVICE_TYPE_NOT_FOUND: {
    message: 'Service Type not found',
    statusCode: 404,
    code: 'SERVICE_TYPE_NOT_FOUND',
  },
};

module.exports = { ERROR_CODES };
