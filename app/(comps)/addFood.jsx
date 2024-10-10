import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDietContext } from '../../context/DietContext';
import { useRouter } from 'expo-router';
import { realtimeDB } from '../../lib/FirebaseConfig';
import { ref, set, push } from 'firebase/database';

const AddFood = () => {
  const { macros, setMacros, consumedFoods, setConsumedFoods } = useDietContext();
  const router = useRouter();

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

  const handleAddFood = async () => {
    const newFood = {
      id: Date.now().toString(),
      name: 'Test Food Item',
      calories: 100,
      protein: 5,
      carbs: 10,
      fat: 3,
      iron: 1
    };

    setConsumedFoods(prevFoods => [...prevFoods, newFood]);

    setMacros(prevMacros => ({
      calories: { 
        ...prevMacros.calories, 
        current: (prevMacros.calories?.current || 0) + 100 
      },
      protein: { 
        ...prevMacros.protein, 
        current: (prevMacros.protein?.current || 0) + 5 
      },
      carbs: { 
        ...prevMacros.carbs, 
        current: (prevMacros.carbs?.current || 0) + 10 
      },
      fat: { 
        ...prevMacros.fat, 
        current: (prevMacros.fat?.current || 0) + 3 
      },
      iron: { 
        ...prevMacros.iron, 
        current: (prevMacros.iron?.current || 0) + 1 
      }
    }));

    await addFoodToDatabase(newFood);

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Food</Text>
      <Text style={styles.foodInfo}>Test Food Item: 100 calories</Text>
      <Button title="Add Test Food" onPress={handleAddFood} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  foodInfo: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default AddFood;
