import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import icons from '../constants/icons.js'

const FormField = ({title, value, placeholder, keyboardType, handleChangeText, otherStyles, ...props}) => {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-black-100 font-pmedium"> {title}</Text>
      <View className="w-[40vh] h-16 px-3 bg-#FFFFFF-100 border-2 border-gray-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput className="flex-1 text-black font-psemibold text-base" keyboardType={keyboardType} value={value} placeholder={placeholder} placeholderTextColor={"#7b7b8b"} onChangeText={handleChangeText} secureTextEntry={title === 'Password' && !showPassword} />
        {title === 'Password' && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image className="w-6 h-6" resizeMode='contain' source={!showPassword ? icons.eye : icons.eyeHide} />
            </TouchableOpacity>
        )}
        {/* ADD CLEAR INPUT FIELD BUTTON FOR ALL OTHER FIELDS */}
      </View>
    </View>
  )
}

export default FormField