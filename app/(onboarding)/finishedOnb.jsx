import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { OnboardingContext, setItem } from '../../context/OnboardingContext'
import {images} from "../../constants"
import {setDoc, doc} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '../../lib/FirebaseConfig' 




const finishedOnb = () => {
  const {state, setState} = useContext(OnboardingContext)
  const [userID, setUserID] = useState(null)

  const ath = getAuth();
  
  useEffect(() => {
    onAuthStateChanged(ath, (user) => {
      if(user){
        setUserID(user.uid)
      }
    })
  }, [])

  // CHANGE STATE
  const validate = () => {
    setState((state) => ({
      ...state, onbDone: true
    }))
    setItem('onboarded', '1');
  }

  // WHEN STATE CHANGES, PUSH TO HOME
  useEffect(() => {
    async function submit(){
      if(state.onbDone && userID){
        try{
          await setDoc(doc(db, "users", userID), {
            uID: userID,
            Name: state.fullName,
            gender: state.gender,
            height: state.height,
            weight: state.weight,
            age: state.age,
            goals: state.goals,
            other: state.other,
          })
          router.push('/home')
        }catch(e){
          console.error("Error Submitting, please try again", e)
        }
      }
    }
    submit()
  }, [state.onbDone])

  return (
    <SafeAreaView className="bg-#e6e5e3 h-full">
      <ScrollView>
        <View className="w-full justify-center h-full items-center bg-#e6e5e3">
            <View className="w-full h-[65%] mt-[25%] justify-center flex-1 items-center bg-#ded8d7">
                <Text className="text-lg font-psemibold text-gray-500 "> STEP 5/5 </Text>
                <Text className="text-2xl text-center font-psemibold mx-[5%] mt-[5%]"> You are almost done! </Text>
                <View className="w-full items-center justify-center mt-[2%]">
                  <Image className="w-[100] h-[100]"  resizeMethod='poster' source={images.check} /> 
                </View>
                <CustomButton title="Continue" handlePress={validate} containerStyles="w-[75%] mt-5 bg-black" textStyles="text-white"/>
                <Text className="text-center w-[80%] text-gray-400 mt-[5%]"> Your data will  be submitted to the database. </Text>
                <Text className="text-center w-[80%] text-gray-400 mt-[2%]"> You will now be able to customize your profile! </Text>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default finishedOnb