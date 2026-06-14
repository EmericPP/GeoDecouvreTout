import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ParcoursModule } from './parcours/parcours.module';
import { QuestionsModule } from './questions/questions.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { ProgresModule } from './progres/progres.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'geoadmin',
      password: process.env.DB_PASSWORD || 'geopassword',
      database: process.env.DB_NAME || 'geodecouvretout',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    ParcoursModule,
    QuestionsModule,
    UtilisateursModule,
    ProgresModule,
  ],
})
export class AppModule {}
