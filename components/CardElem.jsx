import { View, Text } from 'react-native'
import React from 'react'

const CardElem = ({title, sub}) => {
  return (
    <View className="bg-[#FFFFFF] flex-1 ml-[5%] mr-[5%] text-start justify-center border-2 border-gray-400 rounded-2xl">
      <Text className="font-psemibold text-3xl p-[5%] pb-[4%]">{title}</Text>
      <Text className="text-gray-400 text-lg p-[5%]">{sub}</Text>
    </View>
  )
}

export default CardElem