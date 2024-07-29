import { env } from "@/env"

export const jwtConstants = {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
}