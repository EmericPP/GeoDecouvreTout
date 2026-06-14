import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Types pour les parcours
interface Parcours {
  id: number;
  nom: string;
  description: string | null;
  date_creation: string;
  createur: {
    id: number;
    nom: string;
    prenom: string;
  };
  questions: Question[];
}

// Types pour les questions
interface QuestionBase {
  id: number;
  texte: string;
  type: 'qcm' | 'localisation';
  points: number;
  indice?: string;
}

interface QuestionQCM extends QuestionBase {
  type: 'qcm';
  reponse_correcte: string;
  options: string[];
}

interface QuestionLocalisation extends QuestionBase {
  type: 'localisation';
  point_cible: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  rayon_validation: number;
}

type Question = QuestionQCM | QuestionLocalisation;

// Types pour la navigation
export type RootStackParamList = {
  ParcoursList: undefined;
  ParcoursDetail: { parcoursId: number };
  Question: {
    parcoursId: number;
    questionIndex: number;
    questions: Question[];
  };
};

export type ParcoursListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ParcoursList'
>;

export type ParcoursDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ParcoursDetail'
>;

export type QuestionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Question'
>;

// Exporter les types pour les écrans
export type { Parcours, Question, QuestionQCM, QuestionLocalisation };
