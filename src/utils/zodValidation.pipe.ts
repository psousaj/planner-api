import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { z, ZodSchema } from 'zod';

/**
 * Um pipe de validação para validar dados com Zod.
 */
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodSchema<T>) {}

  transform(value: any, { metatype }: ArgumentMetadata): T {
    if (!metatype || !this.schema) {
      return value;
    }

    try {
      // Valida os dados com o esquema Zod
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Lança uma exceção de BadRequest com detalhes do erro Zod
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      // Re-throw erros inesperados
      throw error;
    }
  }
}
