import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    // TODO: Implement API call to LLM here
    // For now, we'll simulate a delay
    setTimeout(() => {
      setResponse('This is a simulated response from the LLM.');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about your fitness journey..."
            value={userInput}
            onChangeText={setUserInput}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Ask AI</Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a4a4a" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}

        {response !== '' && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        )}

        <View style={styles.quickAccessContainer}>
          <Text style={styles.quickAccessTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {[
              { icon: 'calendar-outline', text: 'Training Plan' },
              { icon: 'trending-up-outline', text: 'Track Progress' },
              { icon: 'nutrition-outline', text: 'Nutrition Guide' },
              { icon: 'fitness-outline', text: 'Workout Library' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.quickAccessCard}>
                <Ionicons name={item.icon} size={24} color="#4a4a4a" />
                <Text style={styles.quickAccessCardText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  },
  inputContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#4a4a4a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4a4a4a',
  },
  responseContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    margin: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  responseText: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  quickAccessContainer: {
    padding: 20,
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#4a4a4a',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickAccessCardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#4a4a4a',
    textAlign: 'center',
  },
});

export default Home;