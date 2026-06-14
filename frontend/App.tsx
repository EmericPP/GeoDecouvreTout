import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ParcoursListScreen from './src/screens/ParcoursListScreen';
import ParcoursDetailScreen from './src/screens/ParcoursDetailScreen';
import QuestionScreen from './src/screens/QuestionScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="ParcoursList">
          <Stack.Screen
            name="ParcoursList"
            component={ParcoursListScreen}
            options={{ title: 'GeoDecouvreTout' }}
          />
          <Stack.Screen
            name="ParcoursDetail"
            component={ParcoursDetailScreen}
            options={{ title: 'Détails du parcours' }}
          />
          <Stack.Screen
            name="Question"
            component={QuestionScreen}
            options={{ title: 'Question' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
