import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Utilisateur } from '../utilisateurs/utilisateur.entity';
import { Question } from '../questions/question.entity';
import { Progres } from '../progres/progres.entity';

@Entity()
export class Parcours {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.parcours_crees)
  createur: Utilisateur;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  date_creation: Date;

  @OneToMany(() => Question, (question) => question.parcours)
  questions: Question[];

  @OneToMany(() => Progres, (progres) => progres.parcours)
  progres: Progres[];
}
