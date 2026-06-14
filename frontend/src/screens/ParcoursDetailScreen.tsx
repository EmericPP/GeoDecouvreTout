import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ParcoursDetailScreenNavigationProp } from '../types/navigation';
import { fetchParcoursById } from '../utils/api';
import { ParcoursApiResponse } from '../types/api';

interface ParcoursDetailScreenProps {
  navigation: ParcoursDetailScreenNavigationProp;
  route: {
    params: {
      parcoursId: number;
    };
  };
}

const ParcoursDetailScreen: React.FC<ParcoursDetailScreenProps> = ({ navigation, route }) => {
  const { parcoursId } = route.params;
  const [parcours, setParcours] = useState<ParcoursApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParcours = async () => {
      try {
        setIsLoading(true);
        const data = await fetchParcoursById(parcoursId);
        setParcours(data);
        setError(null);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger le parcours');
      } finally {
        setIsLoading(false);
      }
    };

    loadParcours();
  }, [parcoursId]);

  const handleQuestionPress = (questionIndex: number) => {
    if (!parcours) return;
    navigation.navigate('Question', {
      parcoursId: parcours.id,
      questionIndex,
      questions: parcours.questions,
    });
  };

  const renderQuestionItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.questionItem}
      onPress={() => handleQuestionPress(index)}
    >
      <Text style={styles.questionText}>{item.texte}</Text>
      <Text style={styles.questionType}>
        Type: {item.type === 'qcm' ? 'QCM' : 'Géolocalisation'}
      </Text>
      {item.type === 'qcm' && (
        <Text style={styles.questionPoints}>Points: {item.points}</Text>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement du parcours...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!parcours) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Parcours non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{parcours.nom}</Text>
      {parcours.description && (
        <Text style={styles.description}>{parcours.description}</Text>
      )}
      <Text style={styles.meta}>
        Créé par: {parcours.createur?.prenom} {parcours.createur?.nom}
      </Text>
      
      <Text style={styles.subtitle}>Questions:</Text>
      <FlatList
        data={parcours.questions}
        renderItem={renderQuestionItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => handleQuestionPress(0)}
      >
        <Text style={styles.startButtonText}>Commencer le parcours</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  questionItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  questionType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  questionPoints: {
    fontSize: 12,
    color: '#999',
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ParcoursDetailScreen;
