import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProgresService } from './progres.service';
import { Progres } from './progres.entity';

@Controller('progres')
export class ProgresController {
  constructor(private readonly progresService: ProgresService) {}

  // Récupérer le progrès d'un utilisateur pour un parcours
  @Get('utilisateur/:utilisateurId/parcours/:parcoursId')
  async findOne(
    @Param('utilisateurId') utilisateurId: number,
    @Param('parcoursId') parcoursId: number,
  ): Promise<Progres> {
    return this.progresService.findOne(utilisateurId, parcoursId);
  }

  // Mettre à jour le progrès (question actuelle)
  @Post('mettre-a-jour')
  async upsert(
    @Body() body: { utilisateurId: number; parcoursId: number; questionActuelle: number },
  ): Promise<Progres> {
    return this.progresService.upsert(
      body.utilisateurId,
      body.parcoursId,
      body.questionActuelle,
    );
  }

  // Marquer un parcours comme terminé
  @Post('terminer')
  async markAsCompleted(
    @Body() body: { utilisateurId: number; parcoursId: number },
  ): Promise<Progres> {
    return this.progresService.markAsCompleted(body.utilisateurId, body.parcoursId);
  }
}
