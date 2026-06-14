import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';
import { Utilisateur } from './utilisateur.entity';

@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private readonly utilisateursService: UtilisateursService) {}

  // Récupérer un utilisateur par son ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Utilisateur> {
    return this.utilisateursService.findOne(id);
  }

  // Créer un nouvel utilisateur
  @Post('inscription')
  async create(
    @Body() body: { email: string; nom: string; prenom: string; motDePasse: string },
  ): Promise<Utilisateur> {
    return this.utilisateursService.create(
      body.email,
      body.nom,
      body.prenom,
      body.motDePasse,
    );
  }

  // Connexion (à implémenter avec JWT plus tard)
  @Post('connexion')
  async login(
    @Body() body: { email: string; motDePasse: string },
  ): Promise<{ message: string }> {
    const utilisateur = await this.utilisateursService.findByEmail(body.email);
    if (!utilisateur) {
      throw new Error('Utilisateur non trouvé');
    }

    const isPasswordValid = await this.utilisateursService.verifyPassword(
      utilisateur,
      body.motDePasse,
    );

    if (!isPasswordValid) {
      throw new Error('Mot de passe incorrect');
    }

    // TODO: Générer un token JWT ici
    return { message: 'Connexion réussie' };
  }
}
