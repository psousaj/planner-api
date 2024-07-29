import { z } from 'zod';

const ParticipantSchema = z.object({
    id:           z.string().uuid(),  
    user_id:      z.string().uuid(),
    trip_id:      z.string().uuid(),
    is_invited:   z.boolean().default(false), 
    is_confirmed: z.boolean().default(false),
    is_owner:     z.boolean(), 
})

const CreateParticipantSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  is_owner: z.boolean().default(false),
});


export { CreateParticipantSchema, ParticipantSchema };
