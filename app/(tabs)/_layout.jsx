import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const TabsLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false}} />
      </Stack>
      <StatusBar backgroundColor="#161122" style="dark" />
    </>
  )
}

export default TabsLayout