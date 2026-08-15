import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { store, persistor } from './src/store';
import RootStack from './src/navigation/RootStack';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
          <Toast position="bottom" />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
