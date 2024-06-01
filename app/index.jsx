import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router'
import {images} from "../constants"
import CustomButton from '../components/CustomButton';
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
        {/* <View className="w-full justify-center items-center h-[100vh] px-4"> */}
        <ImageBackground source={images.homepage} resizeMode="cover" className="w-[110%] h-[110%] flex-1 items-center justify-center">
            <Text className="text-3xl font-psemibold text-white">RippedAi</Text>
            <Text className="text-xl font-plight mt-1 text-white">Sore today, snack forever!</Text>
            <CustomButton title="Create Account" handlePress={() => router.push('/sign-up')} containerStyles="w-[75%] mt-7" />
            <Text className="text-white mt-4 font-medium"> Already have an account? <Text onPress={() => router.push('/sign-in')}className="font-plight"> Login! </Text></Text>
        </ImageBackground>
        <StatusBar backgroundColor='#161622' style='light' />
        {/* </View> */}
    </View>
  );
}
