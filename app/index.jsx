import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router'
import {images} from "../constants"
import CustomButton from '../components/CustomButton';
import 'react-native-url-polyfill/auto'
import { useGlobalContext } from "../context/GlobalProvider";
import { OnboardingContext, getItem } from '../context/OnboardingContext'
import { useContext, useEffect, useState } from 'react';
import { authorize, apiCall } from '../lib/FastSecret';

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();
  const {state, setState} = useContext(OnboardingContext)
  const [onboarding, setOnboarding] = useState(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [expiresIn, setExpiresIn] = useState(null)

  const checkAuth = async () => {
    try {
      const authData = await authorize();
      setIsAuthorized(true);
      setExpiresIn(authData.expires_in);
      console.log('Authorization successful');
    } catch (error) {
      console.error('Authorization failed:', error);
    }
  }

  // useEffect(() => {
  //   if (!isAuthorized) {
  //     checkAuth();
  //   }
  //   checkIfAlreadyOnboarded();
  // }, [])

  // useEffect(() => {
  //   if (expiresIn) {
  //     const timer = setTimeout(() => {
  //       checkAuth();
  //     }, (expiresIn - 300) * 1000); // Refresh 5 minutes before expiration
  //     return () => clearTimeout(timer);
  //   }
  // }, [expiresIn]);

  const checkIfAlreadyOnboarded = async () => {
    let onboarded = await getItem('onboarded');
    if(onboarded == 1){
      // if alreadyOnboarded is true, we set showOnboarding false cause we dont need it
      setOnboarding(false)
    }else{
      setOnboarding(true)
    }
  }

  // if (!isLoading && isLoggedIn){
  //   if(!onboarding){
  //     // If it is not loading, it is already logged in AND setOnboarding is false we show home (Meaning usere logged in and finished onboarding)
  //     return <Redirect href="/home" />
  //     // return <Redirect href="/onboarding" />
  //   }else{
  //     // if it is not loading, already logged in AND showOnboarding is true we show onboarding (Meaning user just logged in)
  //     return <Redirect href="/onboarding" />
  //   }
  // }

  return (
    <View className="flex-1 items-center justify-center bg-[#ffffff]">
        <ImageBackground source={images.homepage} resizeMode="cover" className="w-[110%] h-[110%] flex-1 items-center justify-center">
            <Text className="text-3xl font-psemibold text-white">RippedAi</Text>
            <Text className="text-xl font-plight mt-1 text-white">Sore today, snack forever!</Text>
            <CustomButton title="Get Started" handlePress={() => router.push('/sign-up')} containerStyles="w-[75%] mt-7 bg-white" textStyles="text-primary" />
        </ImageBackground>
        <StatusBar backgroundColor='#161622' style='light' />
    </View>
  );
}
