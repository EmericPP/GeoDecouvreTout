import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPolygonValidationToQuestions1718380000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ajouter la colonne polygone_validation
    await queryRunner.query(`
      ALTER TABLE questions 
      ADD COLUMN IF NOT EXISTS polygone_validation GEOMETRY(POLYGON, 4326)
    `);

    // Créer un index spatial pour le polygone
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_questions_polygone_validation 
      ON questions USING GIST(polygone_validation)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer l'index
    await queryRunner.query(`DROP INDEX IF EXISTS idx_questions_polygone_validation`);
    
    // Supprimer la colonne
    await queryRunner.query(`ALTER TABLE questions DROP COLUMN IF EXISTS polygone_validation`);
  }
}
