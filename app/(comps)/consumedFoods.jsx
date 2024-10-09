import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';

const ConsumedFoods = () => {
  // const { consumedFoods } = useLocalSearchParams();
  // const parsedConsumedFoods = JSON.parse(consumedFoods || '[]');

  const placeholderFoods = [
    { id: '1', name: 'Grilled Chicken Breast', calories: 165, time: '12:00 PM' },
    { id: '2', name: 'Greek Yogurt', calories: 100, time: '10:30 AM' },
    { id: '3', name: 'Spinach Salad', calories: 78, time: '1:30 PM' },
    { id: '4', name: 'Banana', calories: 105, time: '3:00 PM' },
    { id: '5', name: 'Salmon Fillet', calories: 206, time: '7:00 PM' },
  ];

  const groupFoodsByMeal = (foods) => {
    const meals = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snacks: []
    };

    foods.forEach(food => {
      const [hours, minutes, period] = food.time.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);
      const hour = parseInt(hours) + (period === 'PM' && hours !== '12' ? 12 : 0);

      if (hour >= 5 && hour < 11) {
        meals.Breakfast.push(food);
      } else if (hour >= 11 && hour < 15) {
        meals.Lunch.push(food);
      } else if (hour >= 17 && hour < 21) {
        meals.Dinner.push(food);
      } else {
        meals.Snacks.push(food);
      }
    });

    return meals;
  };

  const groupedFoods = groupFoodsByMeal(placeholderFoods);

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodCard}>
      <View style={styles.foodHeader}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodTime}>{item.time}</Text>
      </View>
      <Text style={styles.macros}>
        Calories: {item.calories} | Protein: 10g | Carbs: 20g | Fat: 5g
      </Text>
    </View>
  );

  const renderMealSection = (mealType, foods) => (
    <View key={mealType}>
      <Text style={styles.mealTitle}>{mealType}</Text>
      <FlatList
        data={foods}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Consumed Foods</Text>
      <FlatList
        data={Object.entries(groupedFoods)}
        renderItem={({ item: [mealType, foods] }) => renderMealSection(mealType, foods)}
        keyExtractor={item => item[0]}
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
