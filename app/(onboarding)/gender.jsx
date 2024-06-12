import { View, Text, ScrollView, Alert, TouchableOpacity, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import icons from '../../constants/icons.js'
import images from '../../constants/images.js'

const Onboarding = () => {
    const [selectedGender , setSelectedGender] = useState(null)

    const validate = () => {
      if(selectedGender){
        router.push("/physique") 
      }else{
        Alert.alert("Please Select Your Gender")
      }
    }

    const skip = () => {
      setSelectedGender("Didnt Mention")
      router.push("/goals")
    }
  return (
    <SafeAreaView className="bg-#e6e5e3 h-full">
      <ScrollView>
        <View className="w-full justify-center h-full items-center bg-#e6e5e3">
            <View className="w-full justify-between  px-4 my-6 flex-row items-center bg-#ded8d7">
                <Image className="pr-[15%] w-6 h-6" resizeMode='contain' onPress={() => router.push("/onboarding")} source={icons.leftArrow} />
                { selectedGender === "Male" || selectedGender === "Female" ? <Text className="text-xl font-psemibold pr-[5%]" onPress={validate}> Next </Text> : <Text className="text-xl font-psemibold pr-[5%]" onPress={skip}> Skip </Text>}
            </View>
            <View className="w-full h-[65%] mt-[40%] justify-center flex-1 items-center bg-#ded8d7">
                <Text className="text-lg font-psemibold text-gray-500 "> STEP 2/5 </Text>
                <Text className="text-2xl text-center font-psemibold mx-[5%] mt-[5%]"> Which one are you? </Text>
                <View className="w-[50%] flex-row h-full justify-center items-center px-[5%] my-[5%]">
                  <Pressable key={"Male"} onPress={() => setSelectedGender("Male")} className={`w-[100%] h-[100%] justify-center items-center ${selectedGender === "Male" ? "border-2 border-gray-100 rounded-2xl" : ""}`}>
                    <View className="w-[100%] h-[100%] justify-center items-center focus:border-2 border-gray-100 rounded-2xl">
                        <Image className="w-[80%] h-[80%]" source={images.male} resizeMode='contain' />
                        <Text className="text-2xl font-psemibold mb-[15%]"> Male </Text>
                      </View>
                  </Pressable>
                  <Pressable key={"Female"} onPress={() => setSelectedGender("Female")} className={`w-[100%] h-[100%] justify-center items-center ${selectedGender === "Female" ? "border-2 border-gray-100 rounded-2xl" : ""}`}>
                    <View className="w-[100%] h-[100%] mr-[15%] justify-center items-center focus:border-2 border-gray-100 rounded-2xl">
                      <Image className="w-[80%] h-[80%]" source={images.female} resizeMode='contain' />
                      <Text className="text-2xl font-psemibold mb-[15%]"> Female </Text>
                    </View>
                  </Pressable>
                  </View>
                <Text className="text-center w-[80%] text-gray-400"> To give you a better experience, we need to know your gender. </Text>
                <CustomButton title="Continue" handlePress={validate} containerStyles="w-[75%] mt-7 bg-black" textStyles="text-white"/>
                <Text className="text-center w-[80%] font-psemibold mt-[2%]" onPress={skip}> Prefer Not To Choose? </Text>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Onboarding