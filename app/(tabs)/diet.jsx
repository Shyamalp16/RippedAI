import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Redirect, router, useRouter } from 'expo-router'
import { useDietContext } from '../../context/DietContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Diet = () => {
  const { macros: contextMacros, setMacros: setContextMacros, consumedFoods: contextConsumedFoods, setConsumedFoods: setContextConsumedFoods } = useDietContext();
  const router = useRouter();

  const [macros, setMacros] = useState({
    calories: { current: 0, target: 2000 },
    protein: { current: 150, target: 150 },
    carbs: { current: 250, target: 250 },
    fat: { current: 65, target: 65 },
    iron: { current: 18, target: 18 },
  });

  // const [consumedFoods, setConsumedFoods] = useState([
  //   { id: '1', name: 'Grilled Chicken Breast', calories: 165 },
  //   { id: '2', name: 'Greek Yogurt', calories: 100 },
  //   { id: '3', name: 'Spinach Salad', calories: 78 },
  //   { id: '4', name: 'Banana', calories: 105 },
  //   { id: '5', name: 'Salmon Fillet', calories: 206 },
  // ]);

  const [consumedFoods, setConsumedFoods] = useState([]);


  useEffect(() => {
    // Update local state with context values when they change
    if (contextMacros) {
      setMacros(prevMacros => ({
        calories: { current: contextMacros.calories?.current || 0, target: prevMacros.calories.target },
        protein: { current: contextMacros.protein?.current || 0, target: prevMacros.protein.target },
        carbs: { current: contextMacros.carbs?.current || 0, target: prevMacros.carbs.target },
        fat: { current: contextMacros.fat?.current || 0, target: prevMacros.fat.target },
        iron: { current: contextMacros.iron?.current || 0, target: prevMacros.iron.target },
      }));
    }
    if (contextConsumedFoods) {
      setConsumedFoods(contextConsumedFoods);
    }
  }, [contextMacros, contextConsumedFoods]);

  const renderMacroBar = (macro, value) => (
    <View style={styles.macroBar} key={macro}>
      <Text style={styles.macroText}>{macro}</Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${((value?.current || 0) / (value?.target || 1)) * 100}%` }]} />
      </View>
      {value?.current >= value?.target && <Text style={styles.macroText}> Finished </Text>}
      {value?.current < value?.target && <Text style={styles.macroText}>{`${value?.current || 0}/${value?.target || 0}`}</Text>}
    </View>
  );

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodName}>{item.name}</Text>
      <Text style={styles.foodCalories}>{item.calories} cal</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Daily Nutrition Tracker</Text>
        
        <View style={styles.calorieCircle}>
          <View style={styles.circularProgress}>
            <View style={[styles.circularFill, { height: `${((macros.calories?.current || 0) / (macros.calories?.target || 1)) * 100}%` }]} />
            <View style={styles.circularContent}>
              <Text style={styles.calorieText}>Calories</Text>
              <Text style={styles.calorieValue}>{`${macros.calories?.current || 0}/${macros.calories?.target || 0}`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.macrosContainer}>
          {Object.entries(macros).map(([macro, value]) => renderMacroBar(macro, value))}
        </View>

        <TouchableOpacity 
          style={styles.consumedFoodsContainer}
          onPress={() => router.push({pathname: "/consumedFoods"})}
        >
          <Text style={styles.sectionTitle}>Consumed Foods</Text>
          <FlatList
            data={consumedFoods.slice(0, 3)}
            renderItem={renderFoodItem}
            keyExtractor={item => item.id}
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