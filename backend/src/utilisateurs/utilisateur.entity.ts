import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Parcours } from '../parcours/parcours.entity';
import { Progres } from '../progres/progres.entity';

@Entity()
export class Utilisateur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  nom: string;

  @Column({ nullable: true })
  prenom: string;

  @Column()
  mot_de_passe_hash: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  date_inscription: Date;

  @Column({ type: 'timestamp', nullable: true })
  dernier_connexion: Date;

  @OneToMany(() => Parcours, (parcours) => parcours.createur)
  parcours_crees: Parcours[];

  @OneToMany(() => Progres, (progres) => progres.utilisateur)
  progres: Progres[];
}
