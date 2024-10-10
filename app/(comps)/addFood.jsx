import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDietContext } from '../../context/DietContext';
import { useRouter } from 'expo-router';
import { realtimeDB } from '../../lib/FirebaseConfig';
import { ref, set, push } from 'firebase/database';

const AddFood = () => {
  const { macros, setMacros, consumedFoods, setConsumedFoods } = useDietContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const addFoodToDatabase = async (food) => {
    try {
      const foodsRef = ref(realtimeDB, 'consumedFoods');
      const newFoodRef = push(foodsRef);
      await set(newFoodRef, food);
      console.log('Food added to database successfully');
    } catch (error) {
      console.error('Error adding food to database:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Mock search results - replace this with actual API call or database query
    const mockResults = [
      { id: '1', name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, iron: 0.2 },
      { id: '2', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, iron: 0.3 },
      { id: '3', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, iron: 1 },
    ];
    setSearchResults(mockResults.filter(food => food.name.toLowerCase().includes(query.toLowerCase())));
  };

  const handleAddFood = async (food) => {
    const newFood = {
      id: Date.now().toString(),
      ...food
    };

    setConsumedFoods(prevFoods => [...prevFoods, newFood]);

    setMacros(prevMacros => ({
      calories: { 
        ...prevMacros.calories, 
        current: (prevMacros.calories?.current || 0) + food.calories 
      },
      protein: { 
        ...prevMacros.protein, 
        current: (prevMacros.protein?.current || 0) + food.protein 
      },
      carbs: { 
        ...prevMacros.carbs, 
        current: (prevMacros.carbs?.current || 0) + food.carbs 
      },
      fat: { 
        ...prevMacros.fat, 
        current: (prevMacros.fat?.current || 0) + food.fat 
      },
      iron: { 
        ...prevMacros.iron, 
        current: (prevMacros.iron?.current || 0) + food.iron 
      }
    }));

    await addFoodToDatabase(newFood);

    router.back();
  };

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity style={styles.foodItem} onPress={() => handleAddFood(item)}>
      <Text style={styles.foodName}>{item.name}</Text>
      <Text style={styles.foodCalories}>{item.calories} calories | {item.protein}g protein | {item.carbs}g carbs | {item.fat}g fat</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Food</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a food item"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={searchResults}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id}
        style={styles.resultsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    paddingTop: 50,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  resultsList: {
    flex: 1,
  },
  foodItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  foodName: {
    fontSize: 18,
    fontWeight: '500',
  },
  foodCalories: {
    fontSize: 14,
    color: '#666666',
  },
});

export default AddFood;
