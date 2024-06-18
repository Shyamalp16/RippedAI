import { View, Text, ScrollView, Alert, TouchableOpacity, Image, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import icons from '../../constants/icons.js'
import images from '../../constants/images.js'
import { OnboardingContext } from '../../context/OnboardingContext.js'

const Onboarding = () => {
    const {state, setState} = useContext(OnboardingContext)

    const [selectedMenu , setSelectedMenu] = useState("Height")
    const [height, setHeight] = useState(null)
    const [weight, setWeight] = useState(null)
    const [age, setAge] = useState(null)
    const [bmi, setBMI] = useState(null)

    const validate = () => {
      if(!state.height || !state.weight || !state.age){
        Alert.alert("Please Fill All The Fields!")
      }else if(state.height >= 250 || state.height < 100){
        Alert.alert("Invalid Height!")
      }else if(state.age <= 14){
        Alert.alert("Too young")
      }else if(state.age >= 100){
        Alert.alert("Invalid Age!")
      }else{
        router.push("/goals")
      }
    }

    const calc = () => {
        const cmToInch = 0.393701
        const heightToInches = height * cmToInch
        inchSq = heightToInches * heightToInches
        setBMI((weight*703)/inchSq)
    }

  return (
    <SafeAreaView className="bg-#e6e5e3 h-full">
      <ScrollView>
        <View className="w-full justify-center h-full items-center bg-#e6e5e3">
            <View className="w-full justify-between  px-4 my-6 flex-row items-center bg-#ded8d7">
                <Image className="pr-[15%] w-6 h-6" resizeMode='contain' onPress={() => router.push("/gender")} source={icons.leftArrow} />
                <Text className="text-xl font-psemibold pr-[5%]" onPress={validate}> Next </Text>
            </View>
            <View className="w-full h-[65%] mt-[40%] justify-center flex-1 items-center bg-#ded8d7">
                <Text className="text-lg font-psemibold text-gray-500 "> STEP 3/5 </Text>
                <Text className="text-2xl text-center font-psemibold mx-[5%] mt-[5%]"> Lets Get A Little Personal? </Text>
                <View className="items-center justify-center w-full flex-row flex-wrap mt-[5%]">
                  <Pressable key={"Height"} onPress={() => setSelectedMenu("Height")} className={`basis-1/4`}>
                    <Text className={`text-2xl font-plight ${selectedMenu === "Height" ? "font-psemibold": ""}`}> Height </Text>
                  </Pressable>
                  <Pressable key={"Weight"} onPress={() => setSelectedMenu("Weight")} className={`basis-1/4`}>
                      <Text className={`text-2xl font-plight ${selectedMenu === "Weight" ? "font-psemibold": ""}`}> Weight </Text>
                  </Pressable>
                  <Pressable key={"Age"} onPress={() => setSelectedMenu("Age")} className={`basis-1/4`}>
                      <Text className={`text-2xl font-plight ${selectedMenu === "Age" ? "font-psemibold": ""}`}> Age </Text>
                  </Pressable>
                </View>
                <View> 
                </View>
                {selectedMenu === "Height" && <FormField title="" value={height} placeholder={"Enter Your Height (in CM)"} keyboardType='numeric' handleChangeText={(e) => setState({...state, height:e})} otherStyles=""/> }
                {selectedMenu === "Weight" && <FormField title="" value={weight} placeholder={"Enter Your Weight (in LBS)"} keyboardType='numeric' handleChangeText={(e) => setState({...state, weight:e})} otherStyles=""/> }
                {selectedMenu === "Age" && <FormField title="" value={age} placeholder={"Enter Your Age"} keyboardType='numeric' handleChangeText={(e) => setState({...state, age:e})} otherStyles=""/> }
                {/* {age && weight && height && <Text className="mt-[5%] text-gray-400"> BMI:{bmi} </Text> } */}
                {/* ADD THE BMI FUNCTIONANLITY ONCE DONE WITH ONBOARDING PART */}
                <CustomButton  title="Continue" handlePress={validate} containerStyles="w-[75%] mt-7 bg-black" textStyles="text-white"/>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Onboarding