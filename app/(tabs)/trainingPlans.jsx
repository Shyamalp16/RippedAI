import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const TrainingPlans = () => {
  const weeklyPlan = [
    { day: 'Monday', focus: 'Chest', exercises: 5, image: 'https://example.com/chest-workout.jpg' },
    { day: 'Tuesday', focus: 'Legs', exercises: 6, image: 'https://example.com/leg-day.jpg' },
    { day: 'Wednesday', focus: 'Back', exercises: 5, image: 'https://example.com/back-exercises.jpg' },
    { day: 'Thursday', focus: 'Shoulders', exercises: 4, image: 'https://example.com/shoulder-press.jpg' },
    { day: 'Friday', focus: 'Arms', exercises: 5, image: 'https://example.com/bicep-curls.jpg' },
    { day: 'Saturday', focus: 'Core', exercises: 4, image: 'https://example.com/ab-workout.jpg' },
    { day: 'Sunday', focus: 'Rest', exercises: 0, image: 'https://example.com/rest-day.jpg' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Weekly Training Plan</Text>
        {weeklyPlan.map((day, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <ImageBackground 
              source={{ uri: day.image }} 
              style={styles.cardBackground}
              imageStyle={{ opacity: 0.2 }}
            >
              <View style={styles.cardContent}>
                <Text style={styles.dayText}>{day.day}</Text>
                <Text style={styles.focusText}>{day.focus}</Text>
                <Text style={styles.exercisesText}>
                  {day.exercises} {day.exercises === 1 ? 'exercise' : 'exercises'}
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={24} color="#4a4a4a" />
            </ImageBackground>
          </TouchableOpacity>
        ))}
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
  card: {
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardBackground: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  cardContent: {
    flex: 1,
  },
  dayText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 5,
  },
  focusText: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 5,
  },
  exercisesText: {
    fontSize: 14,
    color: '#888',
  },
});

export default TrainingPlans;