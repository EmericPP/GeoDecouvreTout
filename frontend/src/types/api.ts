// Types pour les réponses de l'API

// Réponse pour la vérification de localisation
export interface LocationVerificationResponse {
  isValid: boolean;
}

// Réponse pour la liste des parcours
export interface ParcoursApiResponse {
  id: number;
  nom: string;
  description: string | null;
  date_creation: string;
  createur: {
    id: number;
    nom: string;
    prenom: string;
  };
  questions: QuestionApiResponse[];
}

// Réponse pour une question
export interface QuestionApiResponse {
  id: number;
  texte: string;
  type: 'qcm' | 'localisation';
  points: number;
  indice?: string;
  reponse_correcte?: string;
  options?: string[];
  point_cible?: {
    type: string;
    coordinates: [number, number];
  };
  rayon_validation?: number;
}

// Requête pour vérifier une position
export interface VerifyLocationRequest {
  lat: number;
  lng: number;
  questionId: number;
}

// Réponse pour une validation de QCM
export interface ValidateQCMRequest {
  utilisateurId: number;
  questionId: number;
  reponse: string;
}

// Réponse pour une validation de QCM
export interface ValidateQCMResponse {
  estCorrecte: boolean;
  message: string;
}
