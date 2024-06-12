import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router'
import {images} from "../constants"
import CustomButton from '../components/CustomButton';
import 'react-native-url-polyfill/auto'
import { useGlobalContext } from "../context/GlobalProvider";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();
  // const { isLoggedIn, isLoggedIn } = useGlobalContext();
  if (!isLoading && isLoggedIn) return <Redirect href="/onboarding" />;
  return (
    <View className="flex-1 items-center justify-center bg-white">
        <ImageBackground source={images.homepage} resizeMode="cover" className="w-[110%] h-[110%] flex-1 items-center justify-center">
            <Text className="text-3xl font-psemibold text-white">RippedAi</Text>
            <Text className="text-xl font-plight mt-1 text-white">Sore today, snack forever!</Text>
            <CustomButton title="Get Started" handlePress={() => router.push('/sign-up')} containerStyles="w-[75%] mt-7 bg-white" textStyles="text-primary" />
            {/* <Text className="text-white mt-4 font-medium"> Already have an account? <Text onPress={() => router.push('/sign-in')}className="font-plight"> Login! </Text></Text> */}
        </ImageBackground>
        <StatusBar backgroundColor='#161622' style='light' />
    </View>
  );
}
