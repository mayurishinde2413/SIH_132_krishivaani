// Standardised API response helpers
export const ok = (data: unknown, message = 'Success') => ({
  success: true,
  message,
  data,
});

export const fail = (message: string, code = 400) => ({
  success: false,
  message,
  code,
});
