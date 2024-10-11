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

  const fetchSuggestions = async (query) => {
    try {
      const foodData = await apiCall('GET', '/server.api', {
        method: 'foods.autocomplete',
        expression: query,
        max_results: 10,
        format: 'json'
      });
      if (foodData.suggestions && foodData.suggestions.suggestion) {
        const suggestions = foodData.suggestions.suggestion.map((suggestion, index) => ({
          id: index.toString(),
          name: suggestion,
        }));
        setSearchResults(suggestions);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching food suggestions:', error);
      setSearchResults([]);
    }
  }

  const searchApi = async (query) => {
    try {
      const foodData = await apiCall('GET', '/server.api', {
        method: 'foods.search',
        search_expression: query,
        max_results: 1,
        format: 'json'
      });
      if (foodData.foods && foodData.foods.food){
        const foodItem = foodData.foods.food;  // Treating it as an object
        const { food_name, food_description } = foodItem;
        const macroMatches = food_description.match(/Calories: (\d+)kcal \| Fat: (\d+\.?\d*)g \| Carbs: (\d+\.?\d*)g \| Protein: (\d+\.?\d*)g/);
        if (macroMatches) {
          const [, calories, fat, carbs, protein] = macroMatches.map(Number);
          return {
            name: food_name,
            calories,
            fat,
            carbs,
            protein
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching food data:', error);
      return null;
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsLoading(true);
      try {
        await fetchSuggestions(query);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFood = async (food) => {
    setIsLoading(true);
    const foodDetails = await searchApi(food.name);
    setIsLoading(false);

    if (!foodDetails) {
      console.error('Failed to fetch food details');
      return;
    }

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFood = {
      id: Date.now().toString(),
      ...foodDetails,
      time: currentTime
    };

    setConsumedFoods(prevFoods => [...prevFoods, newFood]);

    setMacros(prevMacros => ({
      calories: { 
        ...prevMacros.calories, 
        current: (prevMacros.calories?.current || 0) + foodDetails.calories 
      },
      protein: { 
        ...prevMacros.protein, 
        current: (prevMacros.protein?.current || 0) + foodDetails.protein 
      },
      carbs: { 
        ...prevMacros.carbs, 
        current: (prevMacros.carbs?.current || 0) + foodDetails.carbs 
      },
      fat: { 
        ...prevMacros.fat, 
        current: (prevMacros.fat?.current || 0) + foodDetails.fat 
      },
      iron: { 
        ...prevMacros.iron, 
        current: (prevMacros.iron?.current || 0) + (foodDetails.iron || 0) 
      }
    }));

    await addFoodToDatabase(newFood);

    router.back();
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity style={styles.foodItem} onPress={() => handleAddFood(item)}>
      <Text style={styles.foodName}>{item.name}</Text>
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
          renderItem={renderSuggestionItem}
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
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666666',
  },
});

export default AddFood;
