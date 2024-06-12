import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const DetailsLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="details" options={{ headerShown: false}} />
      </Stack>
      <StatusBar backgroundColor="#161122" style="dark" />
    </>
  )
}

export default DetailsLayout