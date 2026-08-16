import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { store, persistor } from './src/store';
import RootStack from './src/navigation/RootStack';
import { View, Text, ScrollView } from 'react-native';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f8d7da' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#721c24', marginBottom: 10 }}>The app crashed!</Text>
          <ScrollView style={{ width: '100%', maxHeight: 400, backgroundColor: 'white', padding: 10 }}>
            <Text style={{ color: 'red' }}>{this.state.error?.toString()}</Text>
            <Text style={{ marginTop: 10, color: '#333' }}>{this.state.error?.stack}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
