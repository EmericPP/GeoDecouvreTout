import axios from 'axios';
import {
  ParcoursApiResponse,
  QuestionApiResponse,
  LocationVerificationResponse,
  VerifyLocationRequest,
} from '../types/api';

// URL de base de l'API (à adapter si ton backend est sur un autre port/URL)
const API_BASE_URL = 'http://localhost:3000';

// Créer une instance Axios avec une URL de base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Récupérer tous les parcours
export const fetchParcours = async (): Promise<ParcoursApiResponse[]> => {
  try {
    const response = await api.get('/parcours');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des parcours:', error);
    throw error;
  }
};

// Récupérer un parcours par son ID
export const fetchParcoursById = async (id: number): Promise<ParcoursApiResponse> => {
  try {
    const response = await api.get(`/parcours/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du parcours ${id}:`, error);
    throw error;
  }
};

// Vérifier si l'utilisateur est à l'emplacement cible (pour les questions de géolocalisation)
export const verifyLocation = async (
  data: VerifyLocationRequest,
): Promise<LocationVerificationResponse> => {
  try {
    const response = await api.post('/questions/verifier-localisation', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la vérification de la position:', error);
    throw error;
  }
};

// Valider une réponse QCM
export const validateQCM = async (
  utilisateurId: number,
  questionId: number,
  reponse: string,
): Promise<{ estCorrecte: boolean }> => {
  try {
    const response = await api.post('/reponses', {
      utilisateurId,
      questionId,
      reponse,
      estCorrecte: false, // Le backend déterminera si c'est correct
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la validation de la réponse QCM:', error);
    throw error;
  }
};

export default api;
