import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiCall } from '../../lib/FastSecret';
import { realtimeDB } from '../../lib/FirebaseConfig';
import { ref, push, set } from 'firebase/database';

const ServingFood = () => {
  const [selectedServing, setSelectedServing] = useState('');
  const [servingUnits, setServingUnits] = useState(1);
  const [food, setFood] = useState(null);
  const params = useLocalSearchParams();
  const router = useRouter();

  const searchApi = async () => {
    try {
      const foodData = await apiCall('GET', '/server.api', {
        method: 'foods.search.v3',
        search_expression: `${params.foodName}`,
        max_results: 1,
        include_food_images: true,
        flag_default_serving: true,
        format: 'json',
      });
      if (foodData.foods_search && foodData.foods_search.results && foodData.foods_search.results.food) {
        foodData.foods_search.results.food.forEach((foodItem, index) => {
        });
        setFood(foodData.foods_search.results.food[0]);
      }
    } catch (error) {
      console.error('Error fetching food data:', error);
    }
  }

  useEffect(() => {
    searchApi();
  }, []);

  const renderMacros = () => {
    if (!selectedServing || !food) return null;
    const serving = food.servings.serving.find(s => s.serving_description === selectedServing);
    return (
      <View style={styles.macrosContainer}>
        <View style={styles.macroColumn}>
          <MacroItem label="Grams" value={`${(parseFloat(serving.metric_serving_amount) * servingUnits).toFixed(2)}${serving.metric_serving_unit}`} />
          {serving.calories && <MacroItem label="Calories" value={(parseFloat(serving.calories) * servingUnits).toFixed(0)} />}
          {serving.protein && <MacroItem label="Protein" value={`${(parseFloat(serving.protein) * servingUnits).toFixed(2)}g`} />}
        </View>
        <View style={styles.macroColumn}>
          {serving.carbohydrate && <MacroItem label="Carbs" value={`${(parseFloat(serving.carbohydrate) * servingUnits).toFixed(2)}g`} />}
          {serving.fat && <MacroItem label="Fat" value={`${(parseFloat(serving.fat) * servingUnits).toFixed(2)}g`} />}
          {serving.iron && <MacroItem label="Iron" value={`${(parseFloat(serving.iron) * servingUnits).toFixed(2)}mg`} />}
        </View>
      </View>
    );
  };

  const MacroItem = ({ label, value }) => (
    <View style={styles.macroItem}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value}</Text>
    </View>
  );

  const handleServingSelect = (serving) => {
    setSelectedServing(serving);
  };

  const renderServingItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.servingOption,
        selectedServing === item.serving_description && styles.selectedServingOption
      ]}
      onPress={() => handleServingSelect(item.serving_description)}
    >
      <Text style={[
        styles.servingOptionText,
        selectedServing === item.serving_description && styles.selectedServingOptionText
      ]}>
        {item.serving_description}
      </Text>
    </TouchableOpacity>
  );

  const handleServingUnitsChange = (change) => {
    setServingUnits(prevUnits => {
      const newUnits = prevUnits + change;
      return newUnits >= 1 && newUnits <= 5 ? newUnits : prevUnits;
    });
  };

  const handleAddFood = async () => {
    if (!selectedServing || !food) return;
    const serving = food.servings.serving.find(s => s.serving_description === selectedServing);
    const foodData = {
      name: food.food_name,
      calories: serving.calories ? parseFloat(serving.calories) : 0,
      protein: serving.protein ? parseFloat(serving.protein) : 0,
      carbs: serving.carbohydrate ? parseFloat(serving.carbohydrate) : 0,
      fat: serving.fat ? parseFloat(serving.fat) : 0,
      iron: serving.iron ? parseFloat(serving.iron) : 0,
      timestamp: Date.now()
    };

    try {
      const foodsRef = ref(realtimeDB, 'consumedFoods');
      const newFoodRef = push(foodsRef);
      await set(newFoodRef, foodData);
      router.push('/diet');
    } catch (error) {
      console.error('Error adding food to database:', error);
    }
  };

  if (!food) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {food.food_images && food.food_images.food_image && food.food_images.food_image[1] ? (
        <Image
          source={{ uri: food.food_images.food_image[1].image_url }}
          style={styles.image}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="image-outline" size={100} color="#CCCCCC" />
        </View>
      )}
      <Text style={styles.foodName}>{food.food_name}</Text>
      <Text style={styles.foodType}>{food.food_type}</Text>
      
      <Text style={styles.servingLabel}>Select a serving:</Text>
      <FlatList
        data={food.servings.serving}
        renderItem={renderServingItem}
        keyExtractor={(item) => item.serving_id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.servingList}
      />

      <View style={styles.unitsContainer}>
        <Text style={styles.unitsLabel}>Units of Servings:</Text>
        <View style={styles.unitsControl}>
          <TouchableOpacity onPress={() => handleServingUnitsChange(-1)} style={styles.unitButton}>
            <Text style={styles.unitButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.unitsValue}>{servingUnits}</Text>
          <TouchableOpacity onPress={() => handleServingUnitsChange(1)} style={styles.unitButton}>
            <Text style={styles.unitButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderMacros()}

      <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
        <Text style={styles.addButtonText}>Add Food</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 15,
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 20,
  },
  foodType: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.6,
  },
  servingLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  servingList: {
    marginBottom: 20,
  },
  servingOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginRight: 10,
  },
  selectedServingOption: {
    backgroundColor: '#CCCCCC',
    borderColor: '#CCCCCC',
  },
  servingOptionText: {
    fontSize: 16,
  },
  selectedServingOptionText: {
    color: '#000000',
  },
  unitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  unitsLabel: {
    fontSize: 18,
  },
  unitsControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  unitsValue: {
    fontSize: 18,
    marginHorizontal: 15,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F7F7F7',
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  macroColumn: {
    flex: 1,
  },
  macroItem: {
    marginBottom: 15,
  },
  macroLabel: {
    fontSize: 14,
    marginBottom: 5,
    opacity: 0.6,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ServingFood;