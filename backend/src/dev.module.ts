import { Module } from '@nestjs/common';
import { AppModule } from './app.module';
//import { AppFactoryModule } from "./database/app-factory.module";

@Module({
  imports: [AppModule],
})
export class DeveloperModule {}
