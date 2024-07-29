import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('60m'),
  API_BASE_URL: z.string().url(),
  FRONT_BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  MAILGUN_API_KEY: z.string().optional(),
  MAILGUN_DOMAIN: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().default(25),
  SMTP_SECURE: z.coerce.boolean().default(true),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
})

export const env = envSchema.parse(process.env)
