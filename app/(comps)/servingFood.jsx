import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiCall } from '../../lib/FastSecret';
import { realtimeDB } from '../../lib/FirebaseConfig';
import { ref, push, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SECRET_KEY } from '@env';
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../assets/loader.json';

const openai = new OpenAI({apiKey: SECRET_KEY});

const ServingFood = () => {
  const [selectedServing, setSelectedServing] = useState('');
  const [servingUnits, setServingUnits] = useState(1);
  const [userID, setUserID] = useState(null)
  const [food, setFood] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isFetchingRecipe, setIsFetchingRecipe] = useState(false);
  const params = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('ingredients');

  const RecipeSchema = z.object({
    response: z.object({
      isReadyMade: z.boolean(),
      recipeName: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          quantity: z.string()
        }).strict()
      ),
      steps: z.array(
        z.object({
          step: z.number().int(),
          description: z.string()
        }).strict()
      ),
      timing: z.object({
        prepTime: z.string(),
        cookTime: z.string(),
        totalTime: z.string()
      }).strict()
    }).strict()
  });

  async function getRecipeDetails(recipeName) {
    setIsFetchingRecipe(true);
    try {
      console.log("Fetching recipe details...");
      const recipeCompletion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: `Provide details for a recipe with the following information:\n- Respond if the food item is readymade or not. (Items such as Milk, Fruits, Vegetables are readymade, it should not have a recipe.)\n- Recipe name: ${recipeName}. Include ingredients, steps, and timing. Ensure the response adheres to the specified schema and avoids hallucination.`
          }
        ],
        response_format: zodResponseFormat(RecipeSchema, "response")
      });
  
      const recipeDetails = recipeCompletion.choices[0].message.parsed;
      console.log("Recipe Details received:", recipeDetails);
      setRecipeDetails(recipeDetails);
      await AsyncStorage.setItem('recipe_details', JSON.stringify(recipeDetails));
      console.log("Recipe Details stored in AsyncStorage");
  
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    } finally {
      setIsFetchingRecipe(false);
    }
  }

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

  const ath = getAuth();
  useEffect(() => {
    onAuthStateChanged(ath, (user) => {
      if(user){
        setUserID(user.uid)
      }
    })
  }, [])

  const renderMacros = () => {
    if (!selectedServing || !food) return null;
    const serving = food.servings.serving.find(s => s.serving_description === selectedServing);
    return (
      <View style={styles.macrosContainer}>
        <View style={styles.macroColumn}>
          {serving.metric_serving_amount && serving.metric_serving_unit && (
            <MacroItem 
              label="Grams" 
              value={`${(parseFloat(serving.metric_serving_amount) * servingUnits).toFixed(2)}${serving.metric_serving_unit}`} 
            />
          )}
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
    console.log("Serving selected:", serving);
    setSelectedServing(serving);
    console.log("Updated selectedServing:", serving);
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

  const getCurrentDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset*60*1000));
    return localDate.toISOString().split('T')[0];
  };

  const handleAddFood = async () => {
    if (!selectedServing || !food || !userID) {
        console.log('Missing required data:', {
            selectedServing: !!selectedServing,
            food: !!food,
            userID: !!userID
        });
        Alert.alert("Error", "Please select a serving before adding food.");
        return;
    }

    const serving = food.servings.serving.find(s => s.serving_description === selectedServing);
    
    const currentDate = getCurrentDate();
    
    const foodData = {
      name: params.foodName,
      calories: serving.calories ? parseFloat(serving.calories) * servingUnits : 0,
      protein: serving.protein ? parseFloat(serving.protein) * servingUnits : 0,
      carbs: serving.carbohydrate ? parseFloat(serving.carbohydrate) * servingUnits : 0,
      fat: serving.fat ? parseFloat(serving.fat) * servingUnits : 0,
      iron: serving.iron ? parseFloat(serving.iron) * servingUnits : 0,
      timestamp: Date.now(),
      date: currentDate,
      uID: userID,
      servingUnits: servingUnits,
      servingDescription: selectedServing
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

  const handleQuestionMarkClick = async () => {
    console.log("Question mark clicked.");
    console.log("Current selectedServing:", selectedServing);
    console.log("Current food data:", food);

    if (food) {
        const serving = food.servings.serving[0];
        console.log("Selected serving:", serving);
        setIsModalVisible(true);
        setIsFetchingRecipe(true);
        console.log("Fetching recipe details for:", params.foodName);
        await getRecipeDetails(params.foodName);

        const storedRecipeDetails = await AsyncStorage.getItem('recipe_details');
        if (storedRecipeDetails) {
            const parsedRecipeDetails = JSON.parse(storedRecipeDetails);
        } else {
            console.log("No recipe details found in AsyncStorage.");
        }
    } else {
        console.log("Missing food data.");
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
    <ScrollView style={[styles.container, { paddingTop: 50 }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.questionMark} onPress={handleQuestionMarkClick}>
          <Ionicons name="help-circle-outline" size={40} color="#000000" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.modalContent}>
            {isFetchingRecipe ? (
                <View style={styles.loaderContainer}>
                    <LottieView 
                        source={loaderAnimation}
                        autoPlay
                        loop
                        style={styles.loader}
                    />
                    <Text style={styles.loaderText}>Fetching recipe details...</Text>
                </View>
            ) : (
                <>
                    <Text style={styles.modalTitle}>
                        {recipeDetails ? recipeDetails.response.recipeName : "Loading..."}
                    </Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>
                            <Ionicons name="time-outline" size={16} /> 
                            <Text style={styles.infoTextSpacing}> {recipeDetails?.response.timing?.totalTime ? recipeDetails.response.timing.totalTime.replace(/minutes/i, 'Minutes') : "N/A"}</Text>
                        </Text>
                        <Text style={styles.infoText}>
                            <Ionicons name="list-outline" size={16} /> 
                            <Text style={styles.infoTextSpacing}> {recipeDetails?.response.ingredients.length || 0} Ingredients</Text>
                        </Text>
                    </View>
                    <View style={styles.difficultyRow}>
                        <Text style={styles.infoText}>
                            <Ionicons name="star-outline" size={16} /> 
                            <Text style={styles.infoTextSpacing}> Easy</Text>
                        </Text>
                    </View>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('ingredients')}>
                            <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>Ingredients</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('directions')}>
                            <Text style={[styles.tabText, activeTab === 'directions' && styles.activeTabText]}>Directions</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.scrollView}>
                        {activeTab === 'ingredients' ? (
                            <View style={styles.ingredientsContainer}>
                                {recipeDetails?.response.ingredients && recipeDetails.response.ingredients.length > 0 
                                    ? recipeDetails.response.ingredients.map((ingredient, index) => (
                                        <Text key={index} style={styles.modalText}>
                                            {`${ingredient.quantity} of ${ingredient.name}`}
                                        </Text>
                                    ))
                                    : <Text style={styles.modalText}>No ingredients found.</Text>}
                            </View>
                        ) : (
                            <View style={styles.directionsContainer}>
                                {recipeDetails?.response.steps && recipeDetails.response.steps.length > 0 ? (
                                    recipeDetails.response.steps.map((step, index) => (
                                        <Text key={index} style={styles.modalText}>
                                            {`${step.step}. ${step.description}`}
                                        </Text>
                                    ))
                                ) : (
                                    <Text style={styles.modalText}>No steps found.</Text>
                                )}
                            </View>
                        )}
                    </ScrollView>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setIsModalVisible(!isModalVisible)}
                    >
                        <Text style={[styles.textStyle, { color: "white" }]}>Close</Text>
                    </Pressable>
                </>
            )}
          </View>
        </View>
      </Modal>
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
      <Text style={styles.foodName}>{params.foodName}</Text>
      <Text style={styles.foodType}>{food?.food_type}</Text>
      
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
        <Text style={styles.unitsLabel}>How Many Servings?</Text>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionMark: {
    marginLeft: 'auto',
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    minWidth: '90%',
    minHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'left',
    paddingTop: 20,
  },
  modalTime: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    color: '#333',
    paddingHorizontal: 0,
  },
  buttonClose: {
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 20,
  },
  difficultyRow: {
    marginBottom: 10,
    paddingVertical: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#FF5733',
  },
  ingredientsContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
    // paddingLeft: 5,
    marginLeft: -10,
    alignItems: 'flex-start',
  },
  directionsContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  scrollView: {
    maxHeight: '60%',
  },
  infoTextSpacing: {
    marginLeft: 5,
    marginRight: 5,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: 100,
    height: 100,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default ServingFood;