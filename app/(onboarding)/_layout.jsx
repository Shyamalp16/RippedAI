import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AppProvider } from '../../context/OnboardingContext'

const OnboardingLayout = () => {
  return (
    <AppProvider>
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false}} />
          <Stack.Screen name="gender" options={{ headerShown: false}} />
          <Stack.Screen name="physique" options={{ headerShown: false}} />
          <Stack.Screen name="goals" options={{ headerShown: false}} />
          <Stack.Screen name="finishedOnb" options={{ headerShown: false}} />
        </Stack>
      <StatusBar backgroundColor="#161122" style="dark" />
    </AppProvider>
  )
}

export default OnboardingLayout