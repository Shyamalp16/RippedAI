import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router'
import {images} from "../constants"
import CustomButton from '../components/CustomButton';
import 'react-native-url-polyfill/auto'
import { useGlobalContext } from "../context/GlobalProvider";
import { OnboardingContext, getItem } from '../context/OnboardingContext'
import { useContext, useEffect, useState } from 'react';

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();
  const {state, setState} = useContext(OnboardingContext)
  const [onboarding, setOnboarding] = useState(null)

  useEffect(() => {
    checkIfAlreadyOnboarded();
  }, [])

  const checkIfAlreadyOnboarded = async () => {
    let onboarded = await getItem('onboarded');
    if(onboarded == 1){
      console.log("checkIfAlreadyOnboarded is true")
      setOnboarding(false)
      console.log("setOnboarding is false so it should not show onboarding")
    }else{
      setOnboarding(true)
    }
  }

  if (!isLoading && isLoggedIn){
    if(!onboarding){
      console.log("is not loading, is logged in AND onboarding is false so we should show home")
      return <Redirect href="/home" />
    }else{
      console.log("is not loading and is logged in so we show onboarding")
      return <Redirect href="/onboarding" />
    }
    
  }

  

  return (
    <View className="flex-1 items-center justify-center bg-white">
        <ImageBackground source={images.homepage} resizeMode="cover" className="w-[110%] h-[110%] flex-1 items-center justify-center">
            <Text className="text-3xl font-psemibold text-white">RippedAi</Text>
            <Text className="text-xl font-plight mt-1 text-white">Sore today, snack forever!</Text>
            <CustomButton title="Get Started" handlePress={() => router.push('/sign-up')} containerStyles="w-[75%] mt-7 bg-white" textStyles="text-primary" />
        </ImageBackground>
        <StatusBar backgroundColor='#161622' style='light' />
    </View>
  );
}
