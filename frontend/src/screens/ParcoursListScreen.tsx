import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ParcoursListScreenNavigationProp } from '../types/navigation';
import { fetchParcours } from '../utils/api';
import { ParcoursApiResponse } from '../types/api';

interface ParcoursListScreenProps {
  navigation: ParcoursListScreenNavigationProp;
}

const ParcoursListScreen: React.FC<ParcoursListScreenProps> = ({ navigation }) => {
  const [parcours, setParcours] = useState<ParcoursApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParcours = async () => {
      try {
        setIsLoading(true);
        const data = await fetchParcours();
        setParcours(data);
        setError(null);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les parcours');
      } finally {
        setIsLoading(false);
      }
    };

    loadParcours();
  }, []);

  const handleParcoursPress = (parcoursId: number) => {
    navigation.navigate('ParcoursDetail', { parcoursId });
  };

  const renderParcoursItem = ({ item }: { item: ParcoursApiResponse }) => (
    <TouchableOpacity
      style={styles.parcoursItem}
      onPress={() => handleParcoursPress(item.id)}
    >
      <Text style={styles.parcoursTitle}>{item.nom}</Text>
      {item.description && (
        <Text style={styles.parcoursDescription}>{item.description}</Text>
      )}
      <Text style={styles.parcoursMeta}>
        {item.questions?.length || 0} questions
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des parcours...</Text>
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parcours disponibles</Text>
      {parcours.length === 0 ? (
        <Text style={styles.emptyText}>Aucun parcours disponible</Text>
      ) : (
        <FlatList
          data={parcours}
          renderItem={renderParcoursItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    marginBottom: 20,
    textAlign: 'center',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  parcoursItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  parcoursTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  parcoursDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  parcoursMeta: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default ParcoursListScreen;
