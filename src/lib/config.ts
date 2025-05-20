/**
 * Application configuration settings
 */

type ApiConfig = {
  useProxy: boolean;
  externalApiUrl: string;
  timeout: number;
};

export const apiConfig: ApiConfig = {
  // Set to true to use the local API proxy, false to directly access the external API
  useProxy: true,
  
  // The URL of the external API (only used when useProxy is false)
  externalApiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://lotus-hms.vercel.app/frontend_api',
  
  // API request timeout in milliseconds
  timeout: 30000,
};

export const getApiBaseUrl = (): string => {
  return apiConfig.useProxy ? '/api' : apiConfig.externalApiUrl;
}; 