import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const CompLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="consumedFoods" options={{ headerShown: false}} />
        <Stack.Screen name="addFood" options={{ headerShown: false}} />
      </Stack>
      <StatusBar backgroundColor="#161122" style="dark" />
    </>
  )
}

export default CompLayout;