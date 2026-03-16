import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { RootStackParamList } from './src/types';
import { TitleScreen } from './src/screens/TitleScreen';
import { ArchiveMapScreen } from './src/screens/ArchiveMapScreen';
import { PuzzleScreen } from './src/screens/PuzzleScreen';
import { RewardScreen } from './src/screens/RewardScreen';
import { InvestigationBoardScreen } from './src/screens/InvestigationBoardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Title"
          screenOptions={{ headerShown: false, animation: 'fade' }}
        >
          <Stack.Screen name="Title" component={TitleScreen} />
          <Stack.Screen name="ArchiveMap" component={ArchiveMapScreen} />
          <Stack.Screen name="Puzzle" component={PuzzleScreen} />
          <Stack.Screen name="Reward" component={RewardScreen} />
          <Stack.Screen name="InvestigationBoard" component={InvestigationBoardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
