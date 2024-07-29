import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/providers/prisma.service'; 
import { CreateUserDto, UpdateUserDto } from '@/http/dtos/user.dto';
import { User } from '@prisma/client';
import { PasswordService } from '@/common/security/password.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // Verifica se o usuário já existe
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    // Cria o novo usuário
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await this.hashPassword(password), // Exemplo de hash de senha
      },
    });
  }

  async findByEmail(email:string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const newPass = await this.passwordService.hashPassword(updateUserDto.password)

    const {id, email, updatedAt, ...updatedUser} = await this.prisma.user.update({ 
      where: { id: userId }, 
      data: {
        ...updateUserDto,
        password: newPass,
      }
    });

    return {
      id,
      email,
      updatedAt,
    }
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await this.prisma.user.delete({ where: { id } });
  }

  private async hashPassword(password: string): Promise<string> {
    return await this.passwordService.hashPassword(password)
  }
}
