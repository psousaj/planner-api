import { PasswordService } from '@/common/security/password.service';
import { UserService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private passwordService: PasswordService,
    private jwtService: JwtService
  ) { }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    const passwordMatch = await this.passwordService.comparePassword(pass, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Senha ou email inválidos');
    }
    const { password, ...result } = user;
    const payload = { userId: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
