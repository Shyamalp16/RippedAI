import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import icons from '../../constants/icons.js'

const Onboarding = () => {
    const [fullName, setFullName] = useState("")

    const validate = () => {
        if(fullName){
            router.push("/gender")
        }
        else{
            Alert.alert("Please Enter Your Name!")
        }
        
    }
  return (
    <SafeAreaView className="bg-#e6e5e3 h-full">
      <ScrollView>
        <View className="w-full justify-center h-full items-center bg-#e6e5e3">
            <View className="w-full justify-end  px-4 my-6 flex-row items-center bg-#ded8d7">
                <Text className="text-xl font-psemibold pr-[5%]" onPress={validate}> Next </Text>
            </View>
            <View className="w-full h-[65%] mt-[25%] justify-center flex-1 items-center bg-#ded8d7">
                <Text className="text-lg font-psemibold text-gray-500 "> STEP 1/5 </Text>
                <Text className="text-2xl text-center font-psemibold mx-[5%] mt-[5%]"> Your Account Was Created, time to customize it! </Text>
                <FormField title=" " value={fullName} placeholder={"Full Name"} handleChangeText={(e) => setFullName(e)} otherStyles="mt-5"/>
                <CustomButton title="Continue" handlePress={validate} containerStyles="w-[75%] mt-7 bg-black" textStyles="text-white"/>
                <Text className="text-center w-[80%] text-gray-400 mt-[5%]"> Be Careful: Once Submitted, No Information Can Be Changed till Onboarding is over! </Text>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Onboarding