export default () => ({
  app: {
    name: process.env.APP_NAME,
    port: Number(process.env.PORT) || 8000,
    nodeEnv: process.env.NODE_ENV,
    apiPrefix: process.env.API_PREFIX || 'api',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey:
      process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY,
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
    jwtSecret: process.env.SUPABASE_JWT_SECRET || '',
    jwksUrl:
      process.env.SUPABASE_JWKS_URL ||
      (process.env.SUPABASE_URL
        ? `${process.env.SUPABASE_URL.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`
        : ''),
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || 'sasha-store/products',
  },
});
