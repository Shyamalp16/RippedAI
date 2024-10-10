import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDietContext } from '../../context/DietContext';
import { useRouter } from 'expo-router';
import { realtimeDB } from '../../lib/FirebaseConfig';
import { ref, set, push } from 'firebase/database';
import { apiCall } from '../../lib/FastSecret';

const AddFood = () => {
  const { macros, setMacros, consumedFoods, setConsumedFoods } = useDietContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsLoading(true);
      try {
        const endpoint = `/foods/search/v1?search_expression=${query}&format=json&page_number=0&max_results=10`;
        const response = await apiCall(endpoint, 'GET', { search_expression: query, max_results: 50 });
        if (response.foods && response.foods.food) {
          const formattedResults = response.foods.food.map(food => ({
            id: food.food_id,
            name: food.food_name,
            calories: parseFloat(food.food_description.split('|')[0].trim().split(' ')[0]),
            protein: parseFloat(food.food_description.split('|')[2].trim().split(' ')[0]),
            carbs: parseFloat(food.food_description.split('|')[1].trim().split(' ')[0]),
            fat: parseFloat(food.food_description.split('|')[3].trim().split(' ')[0]),
            iron: 0 // API doesn't provide iron content, so we're setting it to 0
          }));
          setSearchResults(formattedResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFood = async (food) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFood = {
      id: Date.now().toString(),
      ...food,
      time: currentTime
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
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderFoodItem}
          keyExtractor={item => item.id}
          style={styles.resultsList}
        />
      ) : (
        <Text style={styles.noResults}>No Food Item Found!</Text>
      )}
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
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666666',
  },
});

export default AddFood;
