export const headers = {
  acceptLanguage: 'Accept-Language',
  authorization: 'Authorization',
} as const;

export class MissingTokenError extends Error {
  name = MissingTokenError.name;
}
