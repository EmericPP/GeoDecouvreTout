-- Script SQL pour insérer un parcours test avec un polygone de validation
-- Coordonnées du polygone :
-- 48.08381521078038, -1.6068614782792183
-- 48.0839734359057, -1.6066450032423307
-- 48.083901979457764, -1.6064259814403037
-- 48.083738650061136, -1.6065686002881354

-- 1. Vérifier que PostGIS est activé
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Insérer un utilisateur test (si ce n'est pas déjà fait)
INSERT INTO utilisateurs (email, nom, prenom, mot_de_passe_hash)
VALUES ('test@example.com', 'Test', 'User', '$2b$10$somehashedpassword')
ON CONFLICT (email) DO NOTHING;

-- 3. Récupérer l'ID de l'utilisateur
DO $$
DECLARE
  user_id INTEGER;
BEGIN
  SELECT id INTO user_id FROM utilisateurs WHERE email = 'test@example.com' LIMIT 1;
  
  -- 4. Insérer un parcours test
  INSERT INTO parcours (nom, description, createur_id)
  VALUES ('Parcours Test Polygone', 'Un parcours pour tester la validation par polygone', user_id)
  ON CONFLICT (nom) DO NOTHING;
END $$;

-- 5. Récupérer l'ID du parcours
DO $$
DECLARE
  parcours_id INTEGER;
  user_id INTEGER;
BEGIN
  SELECT id INTO user_id FROM utilisateurs WHERE email = 'test@example.com' LIMIT 1;
  SELECT id INTO parcours_id FROM parcours WHERE nom = 'Parcours Test Polygone' LIMIT 1;
  
  IF parcours_id IS NOT NULL THEN
    -- 6. Insérer une question de géolocalisation avec un polygone
    INSERT INTO questions (parcours_id, texte, type, polygone_validation, indice)
    VALUES (
      parcours_id,
      'Rejoignez la zone secrète où les chevaliers se rassemblaient autrefois.',
      'localisation',
      ST_GeomFromText(
        'POLYGON((
          -1.6068614782792183 48.08381521078038,
          -1.6066450032423307 48.0839734359057,
          -1.6064259814403037 48.083901979457764,
          -1.6065686002881354 48.083738650061136,
          -1.6068614782792183 48.08381521078038
        ))',
        4326
      ),
      'Indice : Cherchez près des coordonnées fournies.'
    ) ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- 7. Vérifier que tout a été inséré
SELECT 
  p.id AS parcours_id,
  p.nom AS parcours_nom,
  q.id AS question_id,
  q.texte AS question_texte,
  ST_AsText(q.polygone_validation) AS polygone
FROM parcours p
JOIN questions q ON q.parcours_id = p.id
WHERE p.nom = 'Parcours Test Polygone';
