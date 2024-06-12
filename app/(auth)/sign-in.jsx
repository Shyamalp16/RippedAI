import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { firebase_auth } from '../../lib/FirebaseConfig'
import { signInWithEmailAndPassword } from "firebase/auth";

const Signin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const auth = firebase_auth;

  const signIn = async () => {
    if(form.email && form.password) {
      setIsSubmitting(true)
      try{
        const res = await signInWithEmailAndPassword(auth, form.email, form.password)
        .then((userCredential) => {
          const user = userCredential.user
          // setIsLoading(false)
          // setUser(user)
          // setIsLoggedIn(true)
          router.replace('/onboarding')
        })
      }catch(error){
        let e = error.toString().split('/')[1]
        console.log(error)
        e = e.substring(0, e.length - 2)
        e = e.replaceAll("-", " ")
        Alert.alert('Error', e.charAt(0).toUpperCase() + e.slice(1))
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
          <Text className="text-3xl font-psemibold mt-10"> Sign In </Text>
          <FormField title="Email" value={form.email} placeholder={"Email Address"} handleChangeText={(e) => setForm({...form, email:e})} otherStyles="mt-5" keyboardType="email-address" />
          <FormField title="Password" value={form.password} placeholder={"Password"} handleChangeText={(e) => setForm({...form, password:e})} otherStyles="mt-5"/>
          <CustomButton title="Login" handlePress={signIn} containerStyles="w-[75%] mt-7 bg-black" textStyles="text-white" isLoading={isSubmitting} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Signin