import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reponse } from './reponse.entity';
import { ReponsesService } from './reponses.service';
import { ReponsesController } from './reponses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reponse])],
  providers: [ReponsesService],
  controllers: [ReponsesController],
  exports: [ReponsesService],
})
export class ReponsesModule {}
