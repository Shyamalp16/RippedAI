import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const Diet = () => {
  const navigation = useNavigation();
  const [macros, setMacros] = useState({
    calories: { current: 1200, target: 2000 },
    protein: { current: 60, target: 150 },
    carbs: { current: 120, target: 250 },
    fat: { current: 40, target: 65 },
    iron: { current: 8, target: 18 },
  });

  const renderMacroBar = (macro, value) => (
    <View style={styles.macroBar} key={macro}>
      <Text style={styles.macroText}>{macro}</Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(value.current / value.target) * 100}%` }]} />
      </View>
      <Text style={styles.macroText}>{`${value.current}/${value.target}`}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Daily Nutrition Tracker</Text>
        
        <View style={styles.calorieCircle}>
          <AnimatedCircularProgress
            size={160}
            width={20}
            fill={(macros.calories.current / macros.calories.target) * 100}
            tintColor="#4a4a4a"
            backgroundColor="#e0e0e0"
          >
            {
              (fill) => (
                <View>
                  <Text style={styles.calorieText}>Calories</Text>
                  <Text style={styles.calorieValue}>{`${macros.calories.current}/${macros.calories.target}`}</Text>
                </View>
              )
            }
          </AnimatedCircularProgress>
        </View>

        <View style={styles.macrosContainer}>
          {Object.entries(macros).slice(1).map(([macro, value]) => renderMacroBar(macro, value))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddFood', { setMacros })}
        >
          <Text style={styles.buttonText}>Add Food</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 20,
  },
  calorieCircle: {
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a4a4a',
    textAlign: 'center',
  },
  calorieValue: {
    fontSize: 16,
    color: '#4a4a4a',
    textAlign: 'center',
  },
  macrosContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  macroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  macroText: {
    flex: 1,
    fontSize: 16,
    color: '#4a4a4a',
  },
  progressContainer: {
    flex: 2,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4a4a4a',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4a4a4a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Diet;