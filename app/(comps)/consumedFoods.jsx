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
      let hours;

      if (food.timestamp) {
        // Convert timestamp to Date object
        const date = new Date(food.timestamp);
        hours = date.getHours();
        // Add a formatted time string to the food object
        food.time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (typeof food.time === 'string') {
        // If time is already a string, parse it (keeping the existing logic)
        const timeMatch = food.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (!timeMatch) {
          console.warn(`Unable to parse time for food item ${index}:`, food);
          meals.Snacks.push({ ...food, uniqueKey: `food-${index}` });
          return;
        }

        let [_, hoursStr, minutes, period] = timeMatch;
        hours = parseInt(hoursStr);
        
        if (period) {
          period = period.toUpperCase();
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
        }
      } else {
        console.warn(`Invalid time format for food item ${index}:`, food);
        meals.Snacks.push({ ...food, uniqueKey: `food-${index}` });
        return;
      }

      // Assign a unique key to each food item
      const foodWithKey = { ...food, uniqueKey: `food-${index}` };

      if (hours >= 5 && hours < 11) {
        meals.Breakfast.push(foodWithKey);
      } else if (hours >= 11 && hours < 15) {
        meals.Lunch.push(foodWithKey);
      } else if (hours >= 17 && hours < 21) {
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
