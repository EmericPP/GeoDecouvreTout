import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reponse } from './reponse.entity';

@Injectable()
export class ReponsesService {
  constructor(
    @InjectRepository(Reponse)
    private reponsesRepository: Repository<Reponse>,
  ) {}

  // Récupérer les réponses d'un utilisateur pour une question
  async findByUserAndQuestion(
    utilisateurId: number,
    questionId: number,
  ): Promise<Reponse | null> {
    return this.reponsesRepository.findOne({
      where: { utilisateur: { id: utilisateurId }, question: { id: questionId } },
      relations: ['utilisateur', 'question'],
    });
  }

  // Créer une nouvelle réponse (pour les QCM)
  async create(
    utilisateurId: number,
    questionId: number,
    reponse: string,
    estCorrecte: boolean,
  ): Promise<Reponse> {
    const nouvelleReponse = this.reponsesRepository.create({
      utilisateur: { id: utilisateurId },
      question: { id: questionId },
      reponse,
      est_correcte: estCorrecte,
    });
    return this.reponsesRepository.save(nouvelleReponse);
  }
}
