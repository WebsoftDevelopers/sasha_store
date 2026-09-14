const env = (name: string, fallback = '') =>
  process.env[`API_${name}`] || process.env[name] || fallback;

const apiUrl = env('AUTH_URL') || env('SUPABASE_URL');

export default () => ({
  app: {
    name: env('APP_NAME', 'Sasha Store API'),
    port: Number(env('PORT')) || 8000,
    nodeEnv: process.env.NODE_ENV,
    apiPrefix: process.env.API_PREFIX || 'api',
    frontendUrl: env('FRONTEND_URL', 'http://localhost:3000'),
    corsAllowedOrigins: env('CORS_ALLOWED_ORIGINS'),
    docsEnabled: process.env.API_DOCS_ENABLED === 'true',
    trustProxy: env('TRUST_PROXY') === 'true',
    rateLimitWindowMs: Number(env('RATE_LIMIT_WINDOW_MS')) || 60_000,
    rateLimitMax: Number(env('RATE_LIMIT_MAX')) || 180,
  },
  database: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_URL'),
  },
  auth: {
    provider: env('AUTH_PROVIDER', 'supabase'),
    url: apiUrl,
    publicKey: env('AUTH_PUBLIC_KEY') || env('SUPABASE_ANON_KEY') || env('SUPABASE_PUBLISHABLE_KEY'),
    serviceKey: env('AUTH_SERVICE_KEY') || env('SUPABASE_SERVICE_ROLE_KEY') || env('SUPABASE_SECRET_KEY'),
    jwtSecret: env('AUTH_JWT_SECRET') || env('SUPABASE_JWT_SECRET'),
    jwksUrl:
      env('AUTH_JWKS_URL') ||
      env('SUPABASE_JWKS_URL') ||
      (apiUrl
        ? `${apiUrl.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`
        : ''),
    jwtIssuer:
      env('AUTH_JWT_ISSUER') || (apiUrl ? `${apiUrl.replace(/\/$/, '')}/auth/v1` : ''),
    jwtAudience: env('AUTH_JWT_AUDIENCE', 'authenticated'),
    requiredRole: env('AUTH_REQUIRED_ROLE', 'authenticated'),
    roleClaim: env('AUTH_ROLE_CLAIM', 'role'),
  },
  supabase: {
    url: env('SUPABASE_URL'),
    anonKey: env('SUPABASE_ANON_KEY') || env('SUPABASE_PUBLISHABLE_KEY'),
    serviceRoleKey: env('SUPABASE_SERVICE_ROLE_KEY') || env('SUPABASE_SECRET_KEY'),
    jwtSecret: env('SUPABASE_JWT_SECRET'),
    jwksUrl:
      env('SUPABASE_JWKS_URL') ||
      (env('SUPABASE_URL')
        ? `${env('SUPABASE_URL').replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`
        : ''),
  },
  storage: {
    provider: env('STORAGE_PROVIDER', 's3'),
    endpoint: env('S3_ENDPOINT'),
    publicUrl: env('S3_PUBLIC_URL'),
    bucket: env('S3_BUCKET', 'sasha-store'),
    region: env('S3_REGION', 'us-east-1'),
    accessKey: env('S3_ACCESS_KEY'),
    secretKey: env('S3_SECRET_KEY'),
    forcePathStyle: env('S3_FORCE_PATH_STYLE') !== 'false',
  },
  cache: {
    provider: 'redis',
    redisUrl: env('REDIS_URL') || env('UPSTASH_REDIS_URL'),
    redisToken: env('UPSTASH_REDIS_TOKEN'),
    supabaseCacheEnabled: env('SUPABASE_DB_CACHE_ENABLED') === 'true',
  },
  email: {
    provider: 'namecheap',
    host: env('NAMECHEAP_SMTP_HOST'),
    port: Number(env('NAMECHEAP_SMTP_PORT')) || 587,
    user: env('NAMECHEAP_SMTP_USER'),
    password: env('NAMECHEAP_SMTP_PASSWORD'),
    from: env('EMAIL_FROM'),
  },
  events: {
    queueProvider: 'bullmq',
    redisUrl: env('BULLMQ_REDIS_URL') || env('UPSTASH_REDIS_URL'),
  },
});
