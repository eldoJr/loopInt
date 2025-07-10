import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamModule } from './team/team.module';
import { CalendarModule } from './calendar/calendar.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TasksModule,
    ProjectsModule,
    TeamModule,
    CalendarModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
