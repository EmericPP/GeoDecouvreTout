import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Utilisateur } from '../utilisateurs/utilisateur.entity';
import { Parcours } from '../parcours/parcours.entity';

@Entity()
export class Progres {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.progres)
  utilisateur: Utilisateur;

  @ManyToOne(() => Parcours, (parcours) => parcours.progres)
  parcours: Parcours;

  @Column({ type: 'int', nullable: true })
  question_actuelle: number; // ID de la question en cours

  @Column({ type: 'boolean', default: false })
  termine: boolean;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  date_debut: Date;

  @Column({ type: 'timestamp', nullable: true })
  date_fin: Date;
}
