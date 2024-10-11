import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { router, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, onValue, query, limitToLast, orderByChild } from 'firebase/database';
import { realtimeDB } from '../../lib/FirebaseConfig';

const Diet = () => {
  const router = useRouter();

  const [macros, setMacros] = useState({
    calories: { current: 0, target: 2000 },
    protein: { current: 0, target: 150 },
    carbs: { current: 0, target: 250 },
    fat: { current: 0, target: 65 },
    iron: { current: 0, target: 18 },
  });

  const [consumedFoods, setConsumedFoods] = useState([]);

  useEffect(() => {
    const macrosRef = ref(realtimeDB, 'macros');
    const foodsRef = ref(realtimeDB, 'consumedFoods');

    const unsubscribeMacros = onValue(macrosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMacros(prevMacros => ({
          ...prevMacros,
          ...data,
        }));
      }
    });

    const unsubscribeFoods = onValue(foodsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const foodsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
          timestamp: value.timestamp || Date.now() // Ensure timestamp exists
        }));
        
        // Sort foods by timestamp in descending order (latest first)
        foodsArray.sort((a, b) => b.timestamp - a.timestamp);
        
        // Calculate total macros from all consumed foods
        const totalMacros = foodsArray.reduce((acc, food) => {
          acc.calories.current += Math.round(food.calories || 0);
          acc.protein.current += Math.round(food.protein || 0);
          acc.carbs.current += Math.round(food.carbs || 0);
          acc.fat.current += Math.round(food.fat || 0);
          acc.iron.current += Math.round(food.iron || 0);
          return acc;
        }, {
          calories: { current: 0, target: macros.calories.target },
          protein: { current: 0, target: macros.protein.target },
          carbs: { current: 0, target: macros.carbs.target },
          fat: { current: 0, target: macros.fat.target },
          iron: { current: 0, target: macros.iron.target },
        });

        setMacros(totalMacros);
        
        // Take only the first 3 items (most recent) for display
        const recentFoods = foodsArray.slice(0, 3);
        setConsumedFoods(recentFoods);
      }
    });

    return () => {
      unsubscribeMacros();
      unsubscribeFoods();
    };
  }, []);

  const renderMacroBar = (macro, value) => (
    <View style={styles.macroBar} key={macro}>
      <Text style={styles.macroText}>{macro}</Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${Math.min(100, Math.round((value?.current || 0) / (value?.target || 1) * 100))}%` }]} />
      </View>
      <Text style={styles.macroText}>{`${Math.round(value?.current) || 0}/${value?.target || 0}`}</Text>
    </View>
  );

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodName} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
      <Text style={styles.foodCalories}>{Math.round(item.calories)} cal</Text>
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

        <TouchableOpacity 
          style={styles.consumedFoodsContainer}
          onPress={() => router.push({pathname: "/consumedFoods"})}
        >
          <Text style={styles.sectionTitle}>Recently Consumed Foods</Text>
          <FlatList
            data={consumedFoods}
            renderItem={renderFoodItem}
            keyExtractor={item => `${item.id}-${item.timestamp}`}
            style={styles.foodList}
          />
          <Text style={styles.viewAllText}>View all...</Text>
        </TouchableOpacity>

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
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  calorieCircle: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circularProgress: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    position: 'relative',
  },
  circularFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    zIndex: 10,
  },
  calorieValue: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  macrosContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  macroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  macroText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  progressContainer: {
    flex: 2,
    height: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 5,
  },
  consumedFoodsContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  foodList: {
    maxHeight: 200,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  foodName: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
    marginRight: 10,
  },
  foodCalories: {
    fontSize: 14,
    color: '#666666',
  },
  viewAllText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Diet;