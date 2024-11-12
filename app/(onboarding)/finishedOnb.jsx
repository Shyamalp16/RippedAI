import { View, Text, ScrollView, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { OnboardingContext, setItem } from '../../context/OnboardingContext'
import {images} from "../../constants"
import {setDoc, doc} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '../../lib/FirebaseConfig' 
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SECRET_KEY } from '@env';
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({apiKey: SECRET_KEY});
// openai.apiKey = SECRET_KEY

const finishedOnb = () => {
  const {state, setState} = useContext(OnboardingContext)
  const [userID, setUserID] = useState(null)
  const [isLoading, setIsLoading] = useState(false); // Added state for loader
  const [isGettingMealPlan, setIsGettingMealPlan] = useState(false); // Added state for meal plan loader

  const ath = getAuth();
  
  useEffect(() => {
    onAuthStateChanged(ath, (user) => {
      if(user){
        setUserID(user.uid)
      }
    })
  }, [])

  // CHANGE STATE
  const validate = () => {
    setState((state) => ({
      ...state, onbDone: true
    }))
    setItem('onboarded', '1');
  }

  // WHEN STATE CHANGES, PUSH TO DATABASE AND PUSH TO HOME
  useEffect(() => {
    async function submit(){
      if(state.onbDone && userID){
        setIsLoading(true); // Set loader to true
        try{
          await setDoc(doc(db, "users", userID), {
            uID: userID,
            Name: state.fullName,
            gender: state.gender,
            height: state.height,
            weight: state.weight,
            age: state.age,
            goals: state.goals,
            other: state.other,
          })
        }catch(e){
          console.error("Error Submitting, please try again", e)
        } finally {
          setIsLoading(false); // Set loader to false
        }
      }
    }
    submit()
  }, [state.onbDone])

  // WHEN STATE CHANGES, PUSH TO ASYNC STORAGE AND PUSH TO HOME
  useEffect(() => {
    async function submit(){
      if(state.onbDone && userID){
        setIsLoading(true); // Set loader to true
        try{
          await AsyncStorage.setItem('userData', JSON.stringify({
            uID: userID,
            Name: state.fullName,
            gender: state.gender,
            height: state.height,
            weight: state.weight,
            age: state.age,
            goals: state.goals,
            other: state.other,
          }));
          console.log("Added to async storage")
          getMealPlan(state.age, state.weight, state.height, state.gender, state.goals)
        }catch(e){
          console.error("Error Submitting, please try again", e)
        } finally {
          setIsLoading(false); // Set loader to false
        }
      }
    }
    submit()
  }, [state.onbDone])

  // Define the Zod schema for meal_plan
  const MealPlanSchema = z.object({
    weekly_meal_plan: z.object({
      Monday: zMealPlanForDay(),
      Tuesday: zMealPlanForDay(),
      Wednesday: zMealPlanForDay(),
      Thursday: zMealPlanForDay(),
      Friday: zMealPlanForDay(),
      Saturday: zMealPlanForDay(),
      Sunday: zMealPlanForDay(),
    }).strict()
  });

  // Define reusable day structure with detailed food item information
  function zMealPlanForDay() {
    return z.object({
      breakfast: z.array(zFoodItem()).describe("Breakfast items for the day."),
      lunch: z.array(zFoodItem()).describe("Lunch items for the day."),
      dinner: z.array(zFoodItem()).describe("Dinner items for the day."),
      snacks: z.array(zFoodItem()).describe("Snack items for the day.")
    }).strict();
  }

  // Define structure for each food item
  function zFoodItem() {
    return z.object({
      name: z.string().describe("Name of the food item."),
      serving_size: z.string().describe("Serving size of the food item."),
      calories_per_serving: z.number().describe("Calories per serving."),
      protein_per_serving: z.number().describe("Protein per serving."),
      fat_per_serving: z.number().describe("Fat per serving."),
      carbs_per_serving: z.number().describe("Carbohydrates per serving."),
      iron_per_serving: z.number().describe("Iron per serving.")
    }).strict();
  }

  // Split the schemas
  const TargetMacrosSchema = z.object({
    target_macros: z.object({
      calories: z.number().describe("Total calories goal for the day."),
      protein: z.number().describe("Total protein goal for the day."),
      carbs: z.number().describe("Total carbohydrates goal for the day."),
      fats: z.number().describe("Total fats goal for the day."),
      iron: z.number().describe("Total iron goal for the day."),
    }).strict()
  });

  const WeeklyMealPlanSchema = z.object({
    weekly_meal_plan: z.object({
      Monday: zMealPlanForDay(),
      Tuesday: zMealPlanForDay(),
      Wednesday: zMealPlanForDay(),
      Thursday: zMealPlanForDay(),
      Friday: zMealPlanForDay(),
      Saturday: zMealPlanForDay(),
      Sunday: zMealPlanForDay(),
    }).strict()
  });

  // Define a schema for a single day's meal plan
  const DailyMealPlanSchema = z.object({
    breakfast: z.array(zFoodItem()).describe("Breakfast items for the day."),
    lunch: z.array(zFoodItem()).describe("Lunch items for the day."),
    dinner: z.array(zFoodItem()).describe("Dinner items for the day."),
    snacks: z.array(zFoodItem()).describe("Snack items for the day.")
  }).strict();

  async function getMealPlan(age, weight, height, gender, goals) {
    setIsGettingMealPlan(true);
    try {
      // First API call for target macros
      console.log("Fetching target macros...");
      const macrosCompletion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: `Calculate and provide target macros based on user details:\n- Age: ${age}\n- Weight: ${weight} kg\n- Height: ${height} cm\n- Gender: ${gender}\n- Goals: ${goals}. DO NOT HALLUCINATE. TRY TO BE AS ACCURATE AS POSSIBLE`
          }
        ],
        response_format: zodResponseFormat(TargetMacrosSchema, "target_macros")
      });
      
      const targetMacros = macrosCompletion.choices[0].message.parsed;
      console.log("Target Macros received:", targetMacros);
      await AsyncStorage.setItem('target_macros', JSON.stringify(targetMacros));
      console.log("Target Macros stored in AsyncStorage");

      // Second API call for meal plan
      const weeklyMealPlan = {}
      const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

      // To tackle the limit of 100 parameters, split it into days and run the call 7 times
      for(const day of daysOfWeek){
        console.log(`Fetching weekly meal plan for day ${day}....`);
        const dailyMealPlanCompletion = await openai.beta.chat.completions.parse({
          model: "gpt-4o-2024-08-06",
          messages: [
            {
              role: "system",
              content: `Generate a meal plan for ${day} that meets these daily targets: ${JSON.stringify(targetMacros)}. User details:\n- Age: ${age}\n- Weight: ${weight} kg\n- Height: ${height} cm\n- Gender: ${gender}\n- Goals: ${goals}. DO NOT HALLUCINATE. TRY TO BE AS ACCURATE AS POSSIBLE`
            }
          ],
          max_tokens: 1000, // Set lower max tokens for each day
          response_format: zodResponseFormat(DailyMealPlanSchema, "daily_meal_plan")
        });
        // Store the parsed daily meal plan under the day key
        weeklyMealPlan[day] = dailyMealPlanCompletion.choices[0].message.parsed;
        console.log(`${day} Meal Plan received!`);
      }

      await AsyncStorage.setItem('weekly_meal_plan', JSON.stringify(weeklyMealPlan));
      console.log("Weekly Meal Plan stored in AsyncStorage");

      router.push('/home');
    } catch (error) {
      console.error("Error in meal plan generation:", error);
      Alert.alert("Error", "Failed to generate meal plan. Please try again.");
    } finally {
      setIsGettingMealPlan(false);
    }
  }

  if (isLoading || isGettingMealPlan) {
    return (
      <SafeAreaView className="bg-#e6e5e3 h-full">
        <View className="w-full justify-center h-full items-center bg-#e6e5e3">
          <ActivityIndicator size="large" color="#007bff" style={{ marginBottom: 20 }} />
          <Text>Setting Stuff Up For You!</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="bg-#e6e5e3 h-full">
      <ScrollView>
        <View className="w-full justify-center h-full items-center bg-#e6e5e3">
            <View className="w-full h-[65%] mt-[25%] justify-center flex-1 items-center bg-#ded8d7">
                <Text className="text-lg font-psemibold text-gray-500 "> STEP 5/5 </Text>
                <Text className="text-2xl text-center font-psemibold mx-[5%] mt-[5%]"> You are almost done! </Text>
                <View className="w-full items-center justify-center mt-[2%]">
                  <Image className="w-[100] h-[100]"  resizeMethod='poster' source={images.check} /> 
                </View>
                <CustomButton title="Continue" handlePress={validate} containerStyles="w-[75%] mt-5 bg-black" textStyles="text-white"/>
                <Text className="text-center w-[80%] text-gray-400 mt-[5%]"> Your data will  be submitted to the database. </Text>
                <Text className="text-center w-[80%] text-gray-400 mt-[2%]"> You will now be able to customize your profile! </Text>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default finishedOnb