import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { useLocation } from '../hooks/useLocation';
import { useGeoValidation } from '../hooks/useGeoValidation';
import { QuestionScreenNavigationProp } from '../types/navigation';
import { Question, QuestionQCM, QuestionLocalisation } from '../types/navigation';

MapboxGL.setAccessToken('TA_CLE_API_MAPBOX'); // À remplacer par ta clé Mapbox

interface QuestionScreenProps {
  navigation: QuestionScreenNavigationProp;
  route: {
    params: {
      parcoursId: number;
      questionIndex: number;
      questions: Question[];
    };
  };
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ navigation, route }) => {
  const { questionIndex, questions } = route.params;
  const currentQuestion = questions[questionIndex];
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Hook pour la géolocalisation
  const location = useLocation();

  // Hook pour la validation géospatiale (uniquement pour les questions de localisation)
  const geoValidation = useGeoValidation(
    location.latitude,
    location.longitude,
    currentQuestion?.type === 'localisation' ? currentQuestion : null,
  );

  // Vérifier si la question est validée (pour les questions de localisation)
  useEffect(() => {
    if (currentQuestion?.type === 'localisation' && geoValidation.isValid) {
      setIsAnswerSubmitted(true);
      setIsCorrect(true);
    }
  }, [geoValidation.isValid, currentQuestion]);

  // Soumettre une réponse (pour les QCM)
  const handleSubmitAnswer = (answer: string) => {
    if (currentQuestion.type !== 'qcm') return;

    setSelectedAnswer(answer);
    setIsAnswerSubmitted(true);

    // Vérifier si la réponse est correcte
    const isCorrect = answer === currentQuestion.reponse_correcte;
    setIsCorrect(isCorrect);
  };

  // Passer à la question suivante
  const handleNextQuestion = () => {
    if (questionIndex + 1 < questions.length) {
      navigation.replace('Question', {
        parcoursId: route.params.parcoursId,
        questionIndex: questionIndex + 1,
        questions: route.params.questions,
      });
    } else {
      // Fin du parcours
      navigation.navigate('ParcoursList');
    }
  };

  // Rendre une question QCM
  const renderQCMQuestion = () => {
    if (currentQuestion.type !== 'qcm') return null;

    return (
      <View style={styles.qcmContainer}>
        <Text style={styles.questionText}>{currentQuestion.texte}</Text>
        
        {currentQuestion.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option && styles.selectedOption,
              isAnswerSubmitted && option === currentQuestion.reponse_correcte
                ? styles.correctOption
                : null,
              isAnswerSubmitted && selectedAnswer === option && !isCorrect
                ? styles.wrongOption
                : null,
            ]}
            onPress={() => !isAnswerSubmitted && handleSubmitAnswer(option)}
            disabled={isAnswerSubmitted}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}

        {isAnswerSubmitted && (
          <View style={styles.feedbackContainer}>
            <Text style={isCorrect ? styles.correctText : styles.wrongText}>
              {isCorrect ? '✅ Bravo ! Réponse correcte.' : '❌ Mauvaise réponse.'}
            </Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextQuestion}
            >
              <Text style={styles.nextButtonText}>
                {questionIndex + 1 < questions.length ? 'Question suivante' : 'Terminer le parcours'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Rendre une question de géolocalisation
  const renderGeoQuestion = () => {
    if (currentQuestion.type !== 'localisation') return null;

    return (
      <View style={styles.geoContainer}>
        <Text style={styles.questionText}>{currentQuestion.texte}</Text>
        {currentQuestion.indice && (
          <Text style={styles.indiceText}>Indice: {currentQuestion.indice}</Text>
        )}

        {/* Carte Mapbox */}
        <View style={styles.mapContainer}>
          {location.latitude && location.longitude && (
            <MapboxGL.MapView style={styles.map}>
              <MapboxGL.Camera
                zoomLevel={15}
                centerCoordinate={[location.longitude, location.latitude]}
              />
              
              {/* Position de l'utilisateur */}
              <MapboxGL.PointAnnotation
                id="userLocation"
                coordinate={[location.longitude, location.latitude]}
              >
                <View style={styles.userMarker} />
              </MapboxGL.PointAnnotation>

              {/* Point cible (optionnel: à afficher ou non selon ton choix) */}
              {/* <MapboxGL.PointAnnotation
                id="target"
                coordinate={currentQuestion.point_cible.coordinates}
              >
                <View style={styles.targetMarker} />
              </MapboxGL.PointAnnotation> */}
            </MapboxGL.MapView>
          )}
        </View>

        {/* Afficher la distance si disponible */}
        {geoValidation.distance !== null && (
          <Text style={styles.distanceText}>
            Distance: {Math.round(geoValidation.distance)}m
          </Text>
        )}

        {/* Feedback */}
        {isAnswerSubmitted && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.correctText}>✅ Bravo ! Tu es au bon endroit.</Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextQuestion}
            >
              <Text style={styles.nextButtonText}>
                {questionIndex + 1 < questions.length ? 'Question suivante' : 'Terminer le parcours'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Message d'attente */}
        {!isAnswerSubmitted && location.error && (
          <Text style={styles.errorText}>{location.error}</Text>
        )}

        {!isAnswerSubmitted && !location.error && location.latitude && (
          <Text style={styles.waitingText}>
            Approche-toi de l'endroit indiqué...
          </Text>
        )}
      </View>
    );
  };

  // Afficher le chargement si la position n'est pas encore disponible
  if (currentQuestion.type === 'localisation' && location.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement de la position...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>
        Question {questionIndex + 1} / {questions.length}
      </Text>

      {currentQuestion.type === 'qcm' ? renderQCMQuestion() : renderGeoQuestion()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  indiceText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qcmContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  correctOption: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#ffebee',
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  feedbackContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  correctText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  wrongText: {
    color: '#F44336',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  geoContainer: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    borderWidth: 3,
    borderColor: 'white',
  },
  targetMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F44336',
    borderWidth: 3,
    borderColor: 'white',
  },
  distanceText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  waitingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
});

export default QuestionScreen;
