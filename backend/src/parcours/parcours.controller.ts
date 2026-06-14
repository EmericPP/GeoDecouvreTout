import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ParcoursService } from './parcours.service';
import { Parcours } from './parcours.entity';

@Controller('parcours')
export class ParcoursController {
  constructor(private readonly parcoursService: ParcoursService) {}

  // Récupérer tous les parcours
  @Get()
  async findAll(): Promise<Parcours[]> {
    return this.parcoursService.findAll();
  }

  // Récupérer un parcours par son ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Parcours> {
    return this.parcoursService.findOne(id);
  }

  // Créer un nouveau parcours
  @Post()
  async create(@Body() parcoursData: Partial<Parcours>): Promise<Parcours> {
    return this.parcoursService.create(parcoursData);
  }
}
