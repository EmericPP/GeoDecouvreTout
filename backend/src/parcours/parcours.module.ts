import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parcours } from './parcours.entity';
import { ParcoursService } from './parcours.service';
import { ParcoursController } from './parcours.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Parcours])],
  providers: [ParcoursService],
  controllers: [ParcoursController],
  exports: [ParcoursService],
})
export class ParcoursModule {}
