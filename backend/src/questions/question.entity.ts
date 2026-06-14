import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Parcours } from '../parcours/parcours.entity';
import { Reponse } from '../reponses/reponse.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Parcours, (parcours) => parcours.questions, { onDelete: 'CASCADE' })
  parcours: Parcours;

  @Column({ type: 'text' })
  texte: string;

  @Column({ type: 'varchar', length: 20 })
  type: 'qcm' | 'localisation';

  // Pour les QCM
  @Column({ type: 'text', nullable: true })
  reponse_correcte: string;

  @Column({ type: 'text', array: true, nullable: true })
  options: string[];

  // Pour la géolocalisation
  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  point_cible: any; // PostGIS Point

  @Column({ type: 'int', default: 20, nullable: true })
  rayon_validation: number; // Rayon en mètres

  @Column({ type: 'text', nullable: true })
  indice: string;

  @Column({ type: 'int', default: 1 })
  points: number; // Points attribués pour cette question

  @OneToMany(() => Reponse, (reponse) => reponse.question)
  reponses: Reponse[];
}
