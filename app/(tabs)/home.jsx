import { View, Text, Alert } from 'react-native'
import React from 'react'
import { getAuth, signOut } from "firebase/auth";
import CustomButton from '../../components/CustomButton';



const home = () => {
    const auth = getAuth();
    const logOut = () => {
        signOut(auth).then(() => {
            setUser(null)
            setIsLoggedIn(false)
            // Alert.alert("Success!", "Signout Successful.")
            console.log("Success!", "Signout Successful.")
        }).catch((error) => {
            Alert.alert("Error!", error)
        })
    }
  return (
    <View>
      {/* <Text className="text-2xl" handlePress={logOut}>LOG OUT</Text> */}
      <CustomButton title="Logout" handlePress={logOut} containerStyles="w-[75%] mt-7 bg-black" textStyles="text-white"/>
    </View>
  )
}

export default home