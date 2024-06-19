import { View, Text, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import {icons} from '../../constants'
import CardElem from '../../components/CardElem'
import CardElem2 from '../../components/CardElem2'

import {db, firebase_auth} from '../../lib/FirebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, query, where } from "firebase/firestore";

const userRef = collection(db, "users")

const profile = () => {
  const [userId, setUserID] = useState(null)
  const [userName, setUserName] = useState("")
  // Store user id, when userID is stored, fetch doc (run the following useEffect)
  useEffect(() => {
    onAuthStateChanged(firebase_auth, (user) => {
      if(user){
        setUserID(user.uid)
      }
    })
  }, []);

  
  useEffect(() => {
    const ftch = async() => {
      if(userId){
        const q = query(userRef, where("uID", "==", userId))
        const querySnapShot = await getDocs(q)
        querySnapShot.forEach((doc) => {
          setUserName(doc.data().Name)
          console.log(doc.id, "=>", doc.data().Name)
        console.log(userName)
        })  
      }
    }
    ftch()  
  }, [userId])

  useEffect(() => {
    console.log("userName has been updated to: ", userName)
  }, [userName])

  return (
    <View className="w-[100%] h-full flex-1 items-center justify-top bg-[#F4F4F4] pt-[25%]">
      <View className="w-[100%] flex-row justify-center gap-[40%]">
        <Text className="font-psemibold text-2xl"> {userName} </Text>
        <Image source={icons.settings} resizeMode="contain" className="w-8 h-8" />
      </View>
      <View className="w-[100%] flex-row justify-center mt-[10%]">
        <CardElem title="5" sub="Challenges" />
        <CardElem title="5" sub="Challenges" />
      </View>
      <View className="mt-[7%] justify-between items-center">
        <CardElem2 title="Weekly Progress" prog="20" goal="30"/>
      </View>
    </View>
  )
}

export default profile