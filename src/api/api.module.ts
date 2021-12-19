import { Module } from '@nestjs/common';
import { AuthModule } from './authentication/auth.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [UserModule, AuthModule, EventModule],
})
export class ApiModule {}
