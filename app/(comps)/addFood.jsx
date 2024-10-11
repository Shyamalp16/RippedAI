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
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await set(newFoodRef, { ...food, time: currentTime });
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

  const handleFoodSelect = (food) => {
    router.push({
      pathname: '/servingFood',
      params: { foodName: food.name }
    });
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity style={styles.foodItem} onPress={() => handleFoodSelect(item)}>
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
// 