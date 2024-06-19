import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const home = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>home</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default home