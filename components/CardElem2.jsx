import { View, Text } from 'react-native'
import React from 'react'
import CircularProgress from './CircularProgress'

const CardElem = ({title, prog, goal}) => {
  return (
    <View className="flex flex-row justify-center items-center bg-[#FFFFFF] ml-[5%] mr-[3%] p-[3%] border-2 border-gray-400 rounded-2xl">
        <View className="basis-1/3 flex-1 justify-center items-center">
            <CircularProgress percentage={(prog/goal)*100} />
        </View>
        <View className="basis-2/3 text-left flex-1">
            <Text className="font-psemibold text-xl mb-[3%]"> {title}</Text>
            <View className="flex-row items-center text-left gap-[60]">
                <Text className="font-psemibold text-gray-400"> Workouts </Text>
                <Text className="font-psemibold"> {prog} </Text>
            </View>
            <View className="flex-row items-center text-left gap-[95]">
                <Text className="font-psemibold text-gray-400"> Goal </Text>
                <Text className="font-psemibold"> {goal} </Text>
            </View>
        </View>
    </View>
  )
}

export default CardElem