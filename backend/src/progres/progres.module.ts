import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progres } from './progres.entity';
import { ProgresService } from './progres.service';
import { ProgresController } from './progres.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Progres])],
  providers: [ProgresService],
  controllers: [ProgresController],
  exports: [ProgresService],
})
export class ProgresModule {}
