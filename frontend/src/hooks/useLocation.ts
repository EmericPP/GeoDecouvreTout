import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        // Demander la permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setLocation({
            latitude: null,
            longitude: null,
            error: 'Permission de géolocalisation refusée',
            isLoading: false,
          });
          return;
        }

        // Récupérer la position actuelle
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          error: null,
          isLoading: false,
        });

        // Mettre à jour la position en temps réel
        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Mise à jour toutes les 5 secondes
            distanceInterval: 10, // Mise à jour si déplacement de 10m
          },
          (newLocation) => {
            setLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              error: null,
              isLoading: false,
            });
          },
        );

        // Nettoyer la subscription
        return () => {
          if (locationSubscription) {
            locationSubscription.remove();
          }
        };
      } catch (error) {
        console.error('Erreur de géolocalisation:', error);
        setLocation({
          latitude: null,
          longitude: null,
          error: 'Impossible de récupérer la position',
          isLoading: false,
        });
      }
    };

    requestLocationPermission();
  }, []);

  return location;
};
