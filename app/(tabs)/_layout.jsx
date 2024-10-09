import React from 'react'
import { Stack, Tabs, Redirect} from 'expo-router'
import { Image, Text, View } from 'react-native'
import { icons } from '../../constants'

const TabIcon = ({icon, color, name, focused}) => {
  return(
    <View className="items-center justify-center gap-2 mt-[10%]">
      <Image source={icon} resizeMode='contain' tintColor={color} className="w-6 h-6" />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}> {name} </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs screenOptions={{ tabBarShowLabel: false, tabBarActiveTintColor:'black'}}>
        <Tabs.Screen name="home" 
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused}) => (
              <TabIcon icon={icons.home1} color={color} name="Home" focused={focused} />
            )
          }}
        />

        <Tabs.Screen name="trainingPlans" 
          options={{
            title: 'Training Plans',
            headerShown: false,
            tabBarIcon: ({ color, focused}) => (
              <TabIcon icon={icons.clipboard} color={color} name="Training Plans" focused={focused} />
            )
          }}
        />

        <Tabs.Screen name="diet" 
          options={{
            title: 'Diet',
            headerShown: false,
            tabBarIcon: ({ color, focused}) => (
              <TabIcon icon={icons.clipboard} color={color} name="Diet" focused={focused} />
            )
          }}
        />

        <Tabs.Screen name="profile" 
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused}) => (
              <TabIcon icon={icons.profile1} color={color} name="Profile" focused={focused} />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout