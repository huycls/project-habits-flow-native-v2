import { useEffect,useRef  } from 'react';
import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts,Poppins_400Regular,Poppins_500Medium,Poppins_600SemiBold,Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SplashScreen, router } from 'expo-router';
import { useSettingsStore } from '@/store/settings';
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  const { darkMode } = useSettingsStore();
  const { initialize, initialized, loading, session } = useAuth();
   const isLayoutMounted = useRef(false);

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-400': Poppins_400Regular,
    'Poppins-500': Poppins_500Medium,
    'Poppins-600': Poppins_600SemiBold,
    'Poppins-700': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    initialize();
  }, []);

  // Mark layout as mounted after first render
  useEffect(() => {
    isLayoutMounted.current = true;
    return () => {
      isLayoutMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!initialized || loading  || !isLayoutMounted.current) return;

    const checkFirstTimeUser = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        
       if (session) {
          router.replace('/(tabs)');
        } else if (hasSeenOnboarding === 'true') {
          router.replace('/(auth)/login');
        } else {
          router.replace('/(onboarding)');
        }
      } catch (error) {
        console.error('Error checking first time user:', error);
        setTimeout(() => {
          if (initialized && !loading) {
            router.replace('/(onboarding)');
          }
        }, 0);
      }
    };

    checkFirstTimeUser();
  }, [initialized, loading, session]);

  if (!fontsLoaded && !fontError) {
    return <Slot />;
  }

  if (!initialized || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
    </>
  );
}