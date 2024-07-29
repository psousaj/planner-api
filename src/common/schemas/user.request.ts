import { UserResponseDto } from '@/http/dtos/user.dto';
import { FastifyRequest as OldFastifyRequest} from 'fastify';

export interface FastifyRequest extends OldFastifyRequest {
  user:  {
    userId: UserResponseDto['id'];
    email: UserResponseDto['email'];
  };
}
