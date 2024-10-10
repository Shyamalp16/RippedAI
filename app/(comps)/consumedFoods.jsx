import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { realtimeDB } from '../../lib/FirebaseConfig';

const ConsumedFoods = () => {
  const [foodSections, setFoodSections] = useState([]);

  useEffect(() => {
    const foodsRef = ref(realtimeDB, 'consumedFoods');
    const unsubscribe = onValue(foodsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const foodsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        const groupedFoods = groupFoodsByMeal(foodsArray);
        setFoodSections(groupedFoods);
      }
    });

    return () => unsubscribe();
  }, []);

  const groupFoodsByMeal = (foods) => {
    const meals = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snacks: []
    };

    foods.forEach((food, index) => {
      const [hours, minutes, period] = food.time.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);
      const hour = parseInt(hours) + (period === 'PM' && hours !== '12' ? 12 : 0);

      // Assign a unique key to each food item
      const foodWithKey = { ...food, uniqueKey: `food-${index}` };

      if (hour >= 5 && hour < 11) {
        meals.Breakfast.push(foodWithKey);
      } else if (hour >= 11 && hour < 15) {
        meals.Lunch.push(foodWithKey);
      } else if (hour >= 17 && hour < 21) {
        meals.Dinner.push(foodWithKey);
      } else {
        meals.Snacks.push(foodWithKey);
      }
    });

    return Object.entries(meals)
      .filter(([_, foods]) => foods.length > 0)
      .map(([mealType, foods], index) => ({
        title: mealType,
        data: foods,
        key: `section-${index}`
      }));
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodCard}>
      <View style={styles.foodHeader}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodTime}>{item.time}</Text>
      </View>
      <Text style={styles.macros}>
        Calories: {item.calories} | Protein: {item.protein}g | Carbs: {item.carbs}g | Fat: {item.fat}g
      </Text>
    </View>
  );

  const renderSection = ({ item }) => (
    <View>
      <Text style={styles.mealTitle}>{item.title}</Text>
      {item.data.map((food) => (
        <View key={food.uniqueKey}>
          {renderFoodItem({ item: food })}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Consumed Foods</Text>
      <FlatList
        data={foodSections}
        renderItem={renderSection}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
    paddingLeft: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 15,
    marginBottom: 10,
    paddingLeft: 10,
  },
  foodCard: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  foodTime: {
    fontSize: 14,
    color: '#666666',
  },
  macros: {
    fontSize: 14,
    color: '#000000',
  },
});

export default ConsumedFoods;
