import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const Signin = () => {
  const [form, setForm] = useState({
    email:'',
    password:''
  })

  const submit = (e) => {
    console.log(e)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  
  return (
    <SafeAreaView className="bg-#e6e5e3 h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6 flex-1 items-center">
          <Text className="text-3xl font-psemibold mt-10"> Sign In </Text>
          <FormField title="Email" value={form.email} placeholder={"Email Address"} handleChangeText={(e) => setForm({...form, email:e})} otherStyles="mt-5" keyboardType="email-address" />
          <FormField title="Password" value={form.password} placeholder={"Password"} handleChangeText={(e) => setForm({...form, password:e})} otherStyles="mt-5"/>
          <CustomButton title="Login" handlePress={submit} containerStyles="w-[75%] mt-7 bg-black" textStyles="text-white" isLoading={isSubmitting} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Signin