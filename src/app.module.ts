import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';

import { ParticipantsController } from "@/http/controllers/participants.controller";
import { TripsController } from "@/http/controllers/trip.controller";

// import { DayJsProvider } from "@/common/providers/dayjs.provider";
import { PrismaService } from "@/common/providers/prisma.service";
import { TripsService } from "@/http/services/trip.service";
import { ParticipantsService } from "@/http/services/participants.service";
import { UserService } from "@/users/users.service";
import { UserController } from "@/users/users.controller";
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { PasswordService } from "@/common/security/password.service";
import { MailerModule } from "@nestjs-modules/mailer";

import { env } from "./env";
import { MailService } from "./common/providers/mail.service";
import { RedirectController } from './http/controllers/redirect.controller';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    MailerModule.forRoot({
      transport: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE, // upgrade later with STARTTLS
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS
        }
      }
    }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
  ],
  controllers: [TripsController, ParticipantsController, UserController, RedirectController],
  providers: [
    PrismaService,
    PasswordService,
    // DayJsProvider,
    MailService,
    ParticipantsService,
    TripsService,
    UserService
  ],
})
export class AppModule { }
