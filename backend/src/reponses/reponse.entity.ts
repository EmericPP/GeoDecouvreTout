import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Utilisateur } from '../utilisateurs/utilisateur.entity';
import { Question } from '../questions/question.entity';

@Entity()
export class Reponse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.reponses)
  utilisateur: Utilisateur;

  @ManyToOne(() => Question, (question) => question.reponses)
  question: Question;

  @Column({ type: 'text', nullable: true })
  reponse: string; // Réponse donnée par l'utilisateur (pour les QCM)

  @Column({ type: 'boolean', nullable: true })
  est_correcte: boolean;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  date_reponse: Date;
}
