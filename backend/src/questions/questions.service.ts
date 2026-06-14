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

  // Vérifier si un point (lat/lng) est dans le polygone ou le rayon de validation d'une question de géolocalisation
  async isUserAtTarget(
    lat: number,
    lng: number,
    questionId: number,
  ): Promise<boolean> {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId, type: 'localisation' },
    });

    if (!question) {
      return false;
    }

    // Si un polygone est défini, vérifier si le point est dedans
    if (question.polygone_validation) {
      const result = await this.questionsRepository.query(
        `SELECT ST_Within(
          ST_GeomFromText('POINT(${lng} ${lat})', 4326),
          ST_GeomFromText('${JSON.stringify(question.polygone_validation)}', 4326)
        ) AS is_inside`,
      );
      return result[0]?.is_inside || false;
    }

    // Sinon, vérifier avec le point + rayon (ancienne méthode)
    if (question.point_cible && question.rayon_validation) {
      const result = await this.questionsRepository.query(
        `SELECT ST_DWithin(
          ST_GeomFromText('POINT(${lng} ${lat})', 4326),
          ST_GeomFromText('${JSON.stringify(question.point_cible)}', 4326),
          ${question.rayon_validation}
        ) AS is_near`,
      );
      return result[0]?.is_near || false;
    }

    return false;
  }

  // Créer une nouvelle question
  async create(questionData: Partial<Question>): Promise<Question> {
    const question = this.questionsRepository.create(questionData);
    return this.questionsRepository.save(question);
  }
}
