import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import icons from '../../constants/icons.js'
import CheckBox from '../../components/CheckBox.jsx'
import { OnboardingContext } from '../../context/OnboardingContext.js'



const goals = () => {
    const {state, setState} = useContext(OnboardingContext)
    
    const validate = () => {
      console.log(state.goals)
      console.log(state.goals.length)
      if(state.goals.length == 0 && !state.other){
          Alert.alert("Please Select Atleast One Option or Enter Your Needs Manualy!")
      }else{
          router.push("/finishedOnb")
      }
    }

  return (
    <SafeAreaView className="bg-#e6e5e3 h-full">
      <ScrollView>
        <View className="w-full justify-center h-full items-center bg-#e6e5e3">
            <View className="w-full justify-between  px-4 my-6 flex-row items-center bg-#ded8d7">
                <Image className="pr-[15%] w-6 h-6" resizeMode='contain' onPress={() => router.push("/gender")} source={icons.leftArrow} />
                <Text className="text-xl font-psemibold pr-[5%]" onPress={validate}> Next </Text>
            </View>
            <View className="w-full h-[65%] mt-[30%] justify-center flex-1 items-center bg-#ded8d7">
                <Text className="text-lg font-psemibold text-gray-500 "> STEP 4/5 </Text>
                <Text className="text-2xl text-center font-psemibold mx-[5%] mt-[5%] mb-[5%]"> What Do You Want To Achieve </Text>
                <CheckBox className="" 
                options={[
                    {label: "Lose Weight", value:"Lose Weight"},
                    {label: "Gain Muscle", value:"Gain Muscle"},
                    {label: "Strength Training", value:"Strength Training"},
                    {label: "Improve Sleep Quality", value:"Improve Sleep Quality"},
                    {label: "Reduce Stress", value:"Reduce Stress"},
                ]}
                checkedValues={state.goals}
                onChange={(newGoals) => setState({...state, goals:newGoals})} />
                <FormField title="" value={state.other} placeholder="Any Other Goals? (Optional)" handleChangeText={(e) => setState({...state, other:e})} otherStyles={"mt-[-15%] pt-0"} />
                <CustomButton title="Continue" handlePress={validate} containerStyles="w-[75%] mt-7 bg-black" textStyles="text-white"/>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default goals