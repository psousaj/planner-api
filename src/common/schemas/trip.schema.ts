import { z } from 'zod';

// Schema para validar a entrada de dados (DTO) para Trip
export const DtoTripSchema = z.object({
  invites: z.array(
    z.object({
      name: z.string(),
      email: z.string().email(),
      is_owner: z.boolean().default(false),
    })
  ),
  destination: z.string().min(4),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
  is_confirmed: z.boolean().default(false),
});

const CreateTripSchema = z.object({
  destination: z.string().min(4),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
  invites: z.array(
    z.object({
      name: z.string().min(4),
      email: z.string().email({message: 'Forneça um  email válido'}),
      is_owner: z.boolean().default(false)
    }),
    { message: 'Você deve convidar ao menos uma pessoa para a viagem' }
  ).optional()
});

const UpdateTripSchema = z.object({
  destination: z.string().min(4).optional(),
  starts_at: z.coerce.date().optional(),
  ends_at: z.coerce.date().optional(),
})


export { CreateTripSchema, UpdateTripSchema }