import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, onValue } from 'firebase/database';
import { realtimeDB } from '../../lib/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const MealSection = ({ title, meals }) => {
  const [consumedFoods, setConsumedFoods] = useState({});
  
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    const foodsRef = ref(realtimeDB, 'consumedFoods');
    
    const unsubscribe = onValue(foodsRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const consumed = {};
        Object.values(data).forEach(food => {
          if (food.date === currentDate) {
            consumed[food.name.toLowerCase()] = true;
          }
        });
        setConsumedFoods(consumed);
      } else {
        setConsumedFoods({});
      }
    });

    return () => unsubscribe();
  }, []);

  const getCurrentDay = () => {
    const now = new Date();
    const options = { weekday: 'long' };
    const day = now.toLocaleDateString('en-US', options);
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  if (!meals || meals.length === 0) return null;
  
  const handleFoodItemPress = async (foodName) => {
    router.push({
      pathname: '/servingFood',
      params: { 
        foodName: foodName,
        day: getCurrentDay()
      }
    });
  };
  
  return (
    <View style={styles.mealSection}>
      <Text style={styles.mealTypeTitle}>{title}</Text>
      {meals.map((item, index) => {
        const foodName = typeof item === 'object' ? item.name : item;
        const isConsumed = Boolean(consumedFoods[foodName.toLowerCase()]);
        
        return (
          <TouchableOpacity 
            key={`${title}-${index}`} 
            style={styles.foodItem}
            onPress={() => handleFoodItemPress(foodName)}
          >
            <Text style={styles.foodName} numberOfLines={1} ellipsizeMode='tail'>
              {foodName}
            </Text>
            <View style={styles.checkbox}>
              {isConsumed && <Ionicons name="checkmark" size={24} color="#4CAF50" />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Diet = () => {
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState({});
  const [targetMacros, setTargetMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    iron: 0,
  });
  const [currentMacros, setCurrentMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    iron: 0,
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
        
        if (targetData?.target_macros) {
          setTargetMacros({
            calories: parseInt(targetData.target_macros.calories) || 0,
            protein: parseInt(targetData.target_macros.protein) || 0,
            carbs: parseInt(targetData.target_macros.carbs) || 0,
            fat: parseInt(targetData.target_macros.fats) || 0,
            iron: parseInt(targetData.target_macros.iron) || 0
          });
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
    const foodsRef = ref(realtimeDB, 'consumedFoods');
    const currentDate = new Date().toISOString().split('T')[0];

    const unsubscribeFoods = onValue(foodsRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        let dailyTotals = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          iron: 0
        };

        Object.values(data).forEach(food => {
          if (food.date === currentDate) {
            dailyTotals.calories += food.calories || 0;
            dailyTotals.protein += food.protein || 0;
            dailyTotals.carbs += food.carbs || 0;
            dailyTotals.fat += food.fat || 0;
            dailyTotals.iron += food.iron || 0;
          }
        });

        setCurrentMacros(dailyTotals);
      }
    });

    return () => unsubscribeFoods();
  }, []);

  const renderMacroBar = (macro) => {
    const current = currentMacros[macro];
    const target = targetMacros[macro];
    return (
      <View style={styles.macroBar} key={macro}>
        <Text style={styles.macroText}>{macro.charAt(0).toUpperCase() + macro.slice(1)}</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${Math.min(100, Math.round((current || 0) / (target || 1) * 100))}%` }]} />
        </View>
        <Text style={styles.macroText}>{`${Math.round(current) || 0}/${target || 0}`}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Daily Nutrition Tracker</Text>
        
        <View style={styles.calorieCircle}>
          <View style={styles.circularProgress}>
            <View style={[styles.circularFill, { height: `${Math.min(100, Math.round((currentMacros.calories || 0) / (targetMacros.calories || 1) * 100))}%` }]} />
            <View style={styles.circularContent}>
              <Text style={styles.calorieText}>Calories</Text>
              <Text style={styles.calorieValue}>{`${Math.round(currentMacros.calories) || 0}/${targetMacros.calories || 0}`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.macrosContainer}>
          {Object.keys(targetMacros).map(renderMacroBar)}
        </View>

        <View style={styles.mealPlanContainer}>
          <View style={styles.mealPlanHeader}>
            <Text style={styles.sectionTitle}>Today's Meal Plan</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push('/consumedFoods')}
              >
                <Ionicons name="bar-chart" size={28} color="#1A1A1A" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push('/addFood')}
              >
                <Ionicons name="add-circle" size={32} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
          </View>
          <MealSection title="Breakfast" meals={mealPlan.breakfast} />
          <MealSection title="Lunch" meals={mealPlan.lunch} />
          <MealSection title="Dinner" meals={mealPlan.dinner} />
          <MealSection title="Snacks" meals={mealPlan.snacks} />
        </View>
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
    color: '#1A1A1A',
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
  mealPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
});

export default Diet;