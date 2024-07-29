import { Module } from '@nestjs/common';
import { UserService } from '@/users/users.service';
import { PasswordService } from '@/common/security/password.service';
import { PrismaService } from '@/common/providers/prisma.service';

@Module({
  providers: [
    UserService,
    PasswordService,
    PrismaService
  ],
  exports: [UserService]
})
export class UsersModule { }
