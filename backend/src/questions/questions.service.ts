import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  // Récupérer toutes les questions d'un parcours
  async findByParcours(parcoursId: number): Promise<Question[]> {
    return this.questionsRepository.find({
      where: { parcours: { id: parcoursId } },
      relations: ['parcours'],
    });
  }

  // Récupérer une question par son ID
  async findOne(id: number): Promise<Question | null> {
    return this.questionsRepository.findOne({
      where: { id },
      relations: ['parcours'],
    });
  }

  // Vérifier si un point (lat/lng) est dans le rayon de validation d'une question de géolocalisation
  async isUserAtTarget(
    lat: number,
    lng: number,
    questionId: number,
  ): Promise<boolean> {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId, type: 'localisation' },
    });

    if (!question || !question.point_cible) {
      return false;
    }

    // Requête PostGIS pour vérifier si le point est dans le rayon
    const result = await this.questionsRepository.query(
      `SELECT ST_DWithin(
        ST_GeomFromText('POINT(${lng} ${lat})', 4326),
        ST_GeomFromText('${JSON.stringify(question.point_cible)}', 4326),
        ${question.rayon_validation}
      ) AS is_near`,
    );

    return result[0]?.is_near || false;
  }

  // Créer une nouvelle question
  async create(questionData: Partial<Question>): Promise<Question> {
    const question = this.questionsRepository.create(questionData);
    return this.questionsRepository.save(question);
  }
}
