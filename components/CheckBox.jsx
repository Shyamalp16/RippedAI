import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import icons from "../constants/icons.js"

const CheckBox = ({options, checkedValues, onChange, ...props}) => {
    let updatedCheckedValues = [...checkedValues]

  return (
    <View className="w-full items-center">
      {options.map((option) => {
        let active = updatedCheckedValues.includes(option.value)
        return(
            <TouchableOpacity key={option.value} onPress={() => {
                if(active){
                    updatedCheckedValues = updatedCheckedValues.filter((checkedValue) => checkedValue !== option.value)
                    return onChange(updatedCheckedValues)
                }
                updatedCheckedValues.push(option.value)
                onChange(updatedCheckedValues)
            }} className="h-[15%] w-[80%] flex-row items-center mb-3 bg-white px-[5%] border-2 border-gray-100 rounded-lg">
                <Image className="h-6 w-6 mr-[5%]"  resizeMode='contain' source={active ? icons.checkbox : icons.unchecked}  />
                <Text className="font-psemibold">{option.label}</Text>
            </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default CheckBox