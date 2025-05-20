import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UserModule, MongooseModule.forRoot('mongodb+srv://work-tasks:h0Dg8ziyZGLALXT8@cluster0.j8jry5z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    dbName: 'work-tasks',
    // Additional options here, e.g.,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
