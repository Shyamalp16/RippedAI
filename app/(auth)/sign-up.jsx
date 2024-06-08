import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { firebase_auth } from '../../lib/FirebaseConfig'
import { createUserWithEmailAndPassword } from "firebase/auth";


const Signup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const auth = firebase_auth;

  const signUp = async () => {
    if(form.email && form.password) {
      setIsSubmitting(true)
      try{
        const res = await createUserWithEmailAndPassword(auth, form.email, form.password)
        .then((userCredential) => {
          const user = userCredential.user
          // setUser(user)
          // setIsLoggedIn(true)
          router.replace('/home')
        })
      }catch(error){
        // let e = error.toString().split('/')[1]
        // e = e.substring(0, e.length - 2)
        // e = e.replaceAll("-", " ")
        console.log(error)
        // Alert.alert('Error', e.charAt(0).toUpperCase() + e.slice(1))
      }finally{
        setIsSubmitting(false)
      }
    }else{
      Alert.alert('Error', 'Please Enter Both Email and Password')
    }    
  }
  
  return (
    <SafeAreaView className="bg-#e6e5e3 h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6 flex-1 items-center">
          <Text className="text-3xl font-psemibold mt-10"> Create Account </Text>

          <FormField title="Email" value={form.email} placeholder={"Email Address"} handleChangeText={(e) => setForm({ ...form, email: e })} otherStyles="mt-5" keyboardType="email-address" />

          <FormField title="Password" value={form.password} placeholder={"Password"} handleChangeText={(e) => setForm({ ...form, password: e })} otherStyles="mt-5"/>

          <CustomButton title="Create Account" handlePress={() => signUp()} containerStyles="w-[75%] mt-7 bg-black" textStyles="text-white" isLoading={isSubmitting} />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular"> ------ or ------ </Text>
          </View>

          {/* ADD FIREBASE GOOGLE LOGIN BUTTON BELOW!!!! */}
          {/* <View className="flex-1 w-full items-center justify-center">
            <CustomButton title="Sign in with Google" handlePress={googleAuth} containerStyles="w-[75%] mt-7 bg-black" textStyles="text-white" isLoading={isSubmitting} />
          </View> */}

          <View className="justify-center items-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular"> Already have an account? </Text>
            <Text className="text-lg font-psemibold" onPress={() => router.push('/sign-in')}> Login </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Signup