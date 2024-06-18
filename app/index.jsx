import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router'
import {images} from "../constants"
import CustomButton from '../components/CustomButton';
import 'react-native-url-polyfill/auto'
import { useGlobalContext } from "../context/GlobalProvider";
import { OnboardingContext } from '../context/OnboardingContext'
import { useContext } from 'react';

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();
  const {state, setState} = useContext(OnboardingContext)

  if (!isLoading && isLoggedIn){
    console.log(state.onbDone)
    if(state.onbDone){
      return <Redirect href="/home" />
    }else{
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
