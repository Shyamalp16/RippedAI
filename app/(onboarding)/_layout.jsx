import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const OnboardingLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false}} />
        <Stack.Screen name="gender" options={{ headerShown: false}} />
        <Stack.Screen name="physique" options={{ headerShown: false}} />
        <Stack.Screen name="goals" options={{ headerShown: false}} />
      </Stack>
      <StatusBar backgroundColor="#161122" style="dark" />
    </>
  )
}

export default OnboardingLayout