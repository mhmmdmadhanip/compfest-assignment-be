import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [CommonModule, UserModule, ServiceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
