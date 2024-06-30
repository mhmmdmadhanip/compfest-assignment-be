import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';
import { BranchModule } from './branch/branch.module';

@Module({
  imports: [CommonModule, UserModule, ServiceModule, BranchModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
