import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progres } from './progres.entity';

@Injectable()
export class ProgresService {
  constructor(
    @InjectRepository(Progres)
    private progresRepository: Repository<Progres>,
  ) {}

  // Récupérer le progrès d'un utilisateur pour un parcours
  async findOne(
    utilisateurId: number,
    parcoursId: number,
  ): Promise<Progres | null> {
    return this.progresRepository.findOne({
      where: { utilisateur: { id: utilisateurId }, parcours: { id: parcoursId } },
      relations: ['utilisateur', 'parcours'],
    });
  }

  // Créer ou mettre à jour le progrès d'un utilisateur
  async upsert(
    utilisateurId: number,
    parcoursId: number,
    questionActuelle: number,
  ): Promise<Progres> {
    let progres = await this.progresRepository.findOne({
      where: { utilisateur: { id: utilisateurId }, parcours: { id: parcoursId } },
    });

    if (!progres) {
      progres = this.progresRepository.create({
        utilisateur: { id: utilisateurId },
        parcours: { id: parcoursId },
        question_actuelle: questionActuelle,
        date_debut: new Date(),
      });
    } else {
      progres.question_actuelle = questionActuelle;
    }

    return this.progresRepository.save(progres);
  }

  // Marquer un parcours comme terminé
  async markAsCompleted(utilisateurId: number, parcoursId: number): Promise<Progres> {
    const progres = await this.progresRepository.findOne({
      where: { utilisateur: { id: utilisateurId }, parcours: { id: parcoursId } },
    });

    if (!progres) {
      throw new Error('Progrès non trouvé');
    }

    progres.termine = true;
    progres.date_fin = new Date();

    return this.progresRepository.save(progres);
  }
}
