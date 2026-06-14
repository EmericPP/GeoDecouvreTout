import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from './utilisateur.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilisateursService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateursRepository: Repository<Utilisateur>,
  ) {}

  // Récupérer un utilisateur par son ID
  async findOne(id: number): Promise<Utilisateur | null> {
    return this.utilisateursRepository.findOne({ where: { id } });
  }

  // Récupérer un utilisateur par son email
  async findByEmail(email: string): Promise<Utilisateur | null> {
    return this.utilisateursRepository.findOne({ where: { email } });
  }

  // Créer un nouvel utilisateur
  async create(email: string, nom: string, prenom: string, motDePasse: string): Promise<Utilisateur> {
    const mot_de_passe_hash = await bcrypt.hash(motDePasse, 10);
    const utilisateur = this.utilisateursRepository.create({
      email,
      nom,
      prenom,
      mot_de_passe_hash,
    });
    return this.utilisateursRepository.save(utilisateur);
  }

  // Vérifier le mot de passe
  async verifyPassword(utilisateur: Utilisateur, motDePasse: string): Promise<boolean> {
    return bcrypt.compare(motDePasse, utilisateur.mot_de_passe_hash);
  }
}
