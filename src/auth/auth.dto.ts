import { z } from "zod";

const AuthSchema = z.object({
    email: z.string({message: 'Preencha o email'}).email(),
    password: z.string({message: 'Preencha a senha'}).min(6)
})

type AuthSchemaDto = z.infer<typeof AuthSchema>

export type {AuthSchemaDto}

export {AuthSchema}