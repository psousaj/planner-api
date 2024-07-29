import { z } from 'zod';

// Regex para validar pelo menos uma letra minúscula, uma maiúscula, um número e um símbolo
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string()
    .min(6, { message: 'Senha deve ter 6 ou mais caracteres' }) // Verifica o comprimento mínimo
    .regex(passwordRegex, { message: 'Sua senha deve conter letras maiúsculas, minúsculas e um número' }),
  image: z.string().optional(),
  socialProvider: z.string().optional(),
  socialProviderId: z.string().optional(),
});

const UpdateUserSchema = z.object({
    name: z.string().optional(),
    password: z.string().optional(),
    image: z.string().optional()
  })

const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  image: z.string().optional(),
  socialProvider: z.string().optional(),
  socialProviderId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});


export { CreateUserSchema, UpdateUserSchema, UserResponseSchema };
