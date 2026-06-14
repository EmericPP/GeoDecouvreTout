import { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import { QuestionLocalisation } from '../types/navigation';

interface GeoValidationState {
  isValid: boolean;
  distance: number | null; // Distance en mètres
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook pour vérifier si l'utilisateur est dans le polygone ou le rayon de validation d'une question de géolocalisation.
 * Utilise @turf/turf pour les calculs géospatiaux côté frontend.
 */
export const useGeoValidation = (
  userLat: number | null,
  userLng: number | null,
  question: QuestionLocalisation | null,
  checkInterval: number = 5000, // Vérifier toutes les 5 secondes
) => {
  const [validation, setValidation] = useState<GeoValidationState>({
    isValid: false,
    distance: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!userLat || !userLng || !question || question.type !== 'localisation') {
      setValidation({
        isValid: false,
        distance: null,
        isLoading: false,
        error: null,
      });
      return;
    }

    // Vérifier immédiatement
    const checkPosition = () => {
      try {
        const userPoint = turf.point([userLng, userLat]);

        // Si un polygone est défini, vérifier si le point est dedans
        if (question.polygone_validation) {
          const polygon = turf.polygon(question.polygone_validation.coordinates);
          const isValid = turf.booleanPointInPolygon(userPoint, polygon);
          
          setValidation({
            isValid,
            distance: null, // Pas de distance calculée pour un polygone
            isLoading: false,
            error: null,
          });
          return;
        }

        // Sinon, utiliser le point + rayon (ancienne méthode)
        if (question.point_cible && question.rayon_validation) {
          const targetPoint = turf.point(question.point_cible.coordinates);
          const distance = turf.distance(userPoint, targetPoint, { units: 'meters' });
          const isValid = distance <= question.rayon_validation;

          setValidation({
            isValid,
            distance,
            isLoading: false,
            error: null,
          });
          return;
        }

        // Si aucune méthode de validation n'est définie
        setValidation({
          isValid: false,
          distance: null,
          isLoading: false,
          error: 'Aucune zone de validation définie',
        });
      } catch (error) {
        console.error('Erreur lors de la validation géospatiale:', error);
        setValidation({
          isValid: false,
          distance: null,
          isLoading: false,
          error: 'Erreur de calcul de position',
        });
      }
    };

    // Vérifier immédiatement
    checkPosition();

    // Puis vérifier périodiquement
    const intervalId = setInterval(checkPosition, checkInterval);

    // Nettoyer l'intervalle
    return () => clearInterval(intervalId);
  }, [userLat, userLng, question, checkInterval]);

  return validation;
};
