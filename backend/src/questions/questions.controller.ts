import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './question.entity';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // Récupérer toutes les questions d'un parcours
  @Get('parcours/:parcoursId')
  async findByParcours(@Param('parcoursId') parcoursId: number): Promise<Question[]> {
    return this.questionsService.findByParcours(parcoursId);
  }

  // Récupérer une question par son ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Question> {
    return this.questionsService.findOne(id);
  }

  // Vérifier si l'utilisateur est à l'emplacement cible (pour les questions de géolocalisation)
  @Post('verifier-localisation')
  async verifyLocation(
    @Body() body: { lat: number; lng: number; questionId: number },
  ): Promise<{ isValid: boolean }> {
    const isValid = await this.questionsService.isUserAtTarget(
      body.lat,
      body.lng,
      body.questionId,
    );
    return { isValid };
  }

  // Créer une nouvelle question
  @Post()
  async create(@Body() questionData: Partial<Question>): Promise<Question> {
    return this.questionsService.create(questionData);
  }
}
