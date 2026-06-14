import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcours } from './parcours.entity';

@Injectable()
export class ParcoursService {
  constructor(
    @InjectRepository(Parcours)
    private parcoursRepository: Repository<Parcours>,
  ) {}

  // Récupérer tous les parcours
  async findAll(): Promise<Parcours[]> {
    return this.parcoursRepository.find({
      relations: ['createur', 'questions'],
    });
  }

  // Récupérer un parcours par son ID
  async findOne(id: number): Promise<Parcours | null> {
    return this.parcoursRepository.findOne({
      where: { id },
      relations: ['createur', 'questions'],
    });
  }

  // Créer un nouveau parcours
  async create(parcoursData: Partial<Parcours>): Promise<Parcours> {
    const parcours = this.parcoursRepository.create(parcoursData);
    return this.parcoursRepository.save(parcours);
  }
}
