import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReponsesService } from './reponses.service';
import { Reponse } from './reponse.entity';

@Controller('reponses')
export class ReponsesController {
  constructor(private readonly reponsesService: ReponsesService) {}

  // Récupérer les réponses d'un utilisateur pour une question
  @Get('utilisateur/:utilisateurId/question/:questionId')
  async findByUserAndQuestion(
    @Param('utilisateurId') utilisateurId: number,
    @Param('questionId') questionId: number,
  ): Promise<Reponse> {
    return this.reponsesService.findByUserAndQuestion(utilisateurId, questionId);
  }

  // Créer une nouvelle réponse (pour les QCM)
  @Post()
  async create(
    @Body() body: { utilisateurId: number; questionId: number; reponse: string; estCorrecte: boolean },
  ): Promise<Reponse> {
    return this.reponsesService.create(
      body.utilisateurId,
      body.questionId,
      body.reponse,
      body.estCorrecte,
    );
  }
}
