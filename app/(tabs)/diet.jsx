import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, onValue } from 'firebase/database';
import { realtimeDB } from '../../lib/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const MealSection = ({ title, meals }) => {
  if (!meals || meals.length === 0) return null;
  
  return (
    <View style={styles.mealSection}>
      <Text style={styles.mealTypeTitle}>{title}</Text>
      {meals.map((item, index) => {
        const foodName = typeof item === 'object' ? item.name : item;
        return (
          <View key={`${title}-${index}`} style={styles.foodItem}>
            <Text style={styles.foodName} numberOfLines={1} ellipsizeMode='tail'>
              {foodName}
            </Text>
            <TouchableOpacity style={styles.checkbox}>
              <Ionicons name="checkmark" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const Diet = () => {
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState({});
  const [macros, setMacros] = useState({
    calories: { current: 0, target: 0 },
    protein: { current: 0, target: 0 },
    carbs: { current: 0, target: 0 },
    fat: { current: 0, target: 0 },
    iron: { current: 0, target: 0 },
  });

  const getCurrentDay = () => {
    const now = new Date();
    const options = { weekday: 'long' };
    const day = now.toLocaleDateString('en-US', options);
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('weekly_meal_plan');
      const data = jsonValue != null ? JSON.parse(jsonValue) : null;

      const targetValue = await AsyncStorage.getItem('target_macros');
      const targetData = targetValue != null ? JSON.parse(targetValue) : null;

      if (data) {
        const currentDay = getCurrentDay();
        if (data[currentDay]) {
          setMealPlan({
            breakfast: data[currentDay].breakfast || [],
            lunch: data[currentDay].lunch || [],
            dinner: data[currentDay].dinner || [],
            snacks: data[currentDay].snacks || []
          });
        }
        
        if (targetData.target_macros) {
          const newMacros = {
            calories: { ...macros.calories, target: parseInt(targetData.target_macros.calories) },
            protein: { ...macros.protein, target: parseInt(targetData.target_macros.protein) },
            carbs: { ...macros.carbs, target: parseInt(targetData.target_macros.carbs) },
            fat: { ...macros.fat, target: parseInt(targetData.target_macros.fats) },
            iron: { ...macros.iron, target: parseInt(targetData.target_macros.iron) }
          };
          setMacros(newMacros);
        }
      }
    } catch (e) {
      console.error("Error in getData:", e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const macrosRef = ref(realtimeDB, 'macros');
    const foodsRef = ref(realtimeDB, 'consumedFoods');

    const unsubscribeMacros = onValue(macrosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMacros(prevMacros => ({
          calories: { current: data.calories?.current || 0, target: prevMacros.calories.target },
          protein: { current: data.protein?.current || 0, target: prevMacros.protein.target },
          carbs: { current: data.carbs?.current || 0, target: prevMacros.carbs.target },
          fat: { current: data.fat?.current || 0, target: prevMacros.fat.target },
          iron: { current: data.iron?.current || 0, target: prevMacros.iron.target },
        }));
      }
    });

    const currentDay = getCurrentDay();

    const unsubscribeFoods = onValue(foodsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.weekly_meal_plan && data.weekly_meal_plan[currentDay]) {
          setMealPlan(data.weekly_meal_plan[currentDay]);
        } else {
          getData();
        }
      }
    });

    return () => {
      unsubscribeMacros();
      unsubscribeFoods();
    };
  }, []);

  const renderMacroBar = (macro, value) => (
    <View style={styles.macroBar} key={macro}>
      <Text style={styles.macroText}>{macro.charAt(0).toUpperCase() + macro.slice(1)}</Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${Math.min(100, Math.round((value?.current || 0) / (value?.target || 1) * 100))}%` }]} />
      </View>
      <Text style={styles.macroText}>{`${Math.round(value?.current) || 0}/${value?.target || 0}`}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Daily Nutrition Tracker</Text>
        
        <View style={styles.calorieCircle}>
          <View style={styles.circularProgress}>
            <View style={[styles.circularFill, { height: `${Math.min(100, Math.round((macros.calories?.current || 0) / (macros.calories?.target || 1) * 100))}%` }]} />
            <View style={styles.circularContent}>
              <Text style={styles.calorieText}>Calories</Text>
              <Text style={styles.calorieValue}>{`${Math.round(macros.calories?.current) || 0}/${macros.calories?.target || 0}`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.macrosContainer}>
          {Object.entries(macros).filter(([macro]) => macro !== 'calories').map(([macro, value]) => renderMacroBar(macro, value))}
        </View>

        <View style={styles.mealPlanContainer}>
          <Text style={styles.sectionTitle}>Today's Meal Plan</Text>
          <MealSection title="Breakfast" meals={mealPlan.breakfast} />
          <MealSection title="Lunch" meals={mealPlan.lunch} />
          <MealSection title="Dinner" meals={mealPlan.dinner} />
          <MealSection title="Snacks" meals={mealPlan.snacks} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/addFood')}
        >
          <Text style={styles.buttonText}>Add Food</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 16,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
    textAlign: 'center',
  },
  calorieCircle: {
    alignItems: 'center',
    marginBottom: 32,
  },
  circularProgress: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  circularFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50', // Green color for progress
  },
  circularContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calorieText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  calorieValue: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 4,
  },
  macrosContainer: {
    marginBottom: 32,
  },
  macroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  macroText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  progressContainer: {
    flex: 2,
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    marginHorizontal: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  mealPlanContainer: {
    marginBottom: 24,
  },
  mealSection: {
    marginBottom: 24,
  },
  mealTypeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  foodName: {
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
    fontWeight: '500',
  },
  checkbox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Diet;