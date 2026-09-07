import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  APP_NAME: Joi.string().optional(),
  PORT: Joi.number().default(8000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  API_PREFIX: Joi.string().default('api'),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
  DATABASE_URL: Joi.string().required(),
  DIRECT_URL: Joi.string().optional(),
  SUPABASE_URL: Joi.string().uri().required(),

  // Accept classic or new Supabase key names
  SUPABASE_ANON_KEY: Joi.string().optional(),
  SUPABASE_PUBLISHABLE_KEY: Joi.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().optional(),
  SUPABASE_SECRET_KEY: Joi.string().optional(),
  SUPABASE_JWT_SECRET: Joi.string().optional().allow(''),
  SUPABASE_JWKS_URL: Joi.string().uri().optional().allow(''),

  CLOUDINARY_CLOUD_NAME: Joi.string().optional(),
  CLOUDINARY_API_KEY: Joi.string().optional(),
  CLOUDINARY_API_SECRET: Joi.string().optional(),
  CLOUDINARY_FOLDER: Joi.string().optional(),
  UPSTASH_REDIS_URL: Joi.string().uri().optional().allow(''),
  UPSTASH_REDIS_TOKEN: Joi.string().optional().allow(''),
  SUPABASE_DB_CACHE_ENABLED: Joi.boolean().truthy('true').falsy('false').optional(),
  NAMECHEAP_SMTP_HOST: Joi.string().optional().allow(''),
  NAMECHEAP_SMTP_PORT: Joi.number().optional(),
  NAMECHEAP_SMTP_USER: Joi.string().optional().allow(''),
  NAMECHEAP_SMTP_PASSWORD: Joi.string().optional().allow(''),
  EMAIL_FROM: Joi.string().optional().allow(''),
  BULLMQ_REDIS_URL: Joi.string().uri().optional().allow(''),
})
  .or('SUPABASE_ANON_KEY', 'SUPABASE_PUBLISHABLE_KEY')
  .or('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY')
  .or('SUPABASE_JWT_SECRET', 'SUPABASE_JWKS_URL');
