import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { CertificatesModule } from './certificates/certificates.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    UsersModule,
    CoursesModule,
    AuthModule,
    SubmissionsModule,
    QuizzesModule,
    CertificatesModule,
    ReviewsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
