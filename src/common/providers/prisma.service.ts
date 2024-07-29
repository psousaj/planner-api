import { Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  handlePrismaError(error: any): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return new Error(
          "Há uma violação de restrição exclusiva, um novo usuário não pode ser criado com este email",
        );
      }
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return new Error(`Ocorreu um erro desconhecido: ${error.message}`);
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      return new Error(
        `Ocorreu um pânico no mecanismo Prisma: ${error.message}`,
      );
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      return new Error(
        `Ocorreu um erro durante a inicialização do Prisma Client: ${error.message}`,
      );
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      return new Error(`A validação da consulta falhou: ${error.message}`);
    } else {
      return new Error(`Ocorreu um erro desconhecido: ${error}`);
    }
  }
}
