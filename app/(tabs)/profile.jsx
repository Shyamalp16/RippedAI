import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db, firebase_auth } from '../../lib/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from "firebase/firestore";

const userRef = collection(db, "users");

const Profile = () => {
  const [userId, setUserID] = useState(null);
  const [userName, setUserName] = useState("");
  const [userStats, setUserStats] = useState({
    challenges: 0,
    workouts: 0,
    streak: 0,
  });

  useEffect(() => {
    onAuthStateChanged(firebase_auth, (user) => {
      if (user) {
        setUserID(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const q = query(userRef, where("uID", "==", userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUserName(doc.data().Name);
          setUserStats({
            challenges: doc.data().challenges || 0,
            workouts: doc.data().workouts || 0,
            streak: doc.data().streak || 0,
          });
        });
      }
    };
    fetchUserData();
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#4a4a4a" />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <View style={styles.statsContainer}>
          {[
            { icon: 'trophy-outline', label: 'Challenges', value: userStats.challenges },
            { icon: 'fitness-outline', label: 'Workouts', value: userStats.workouts },
            { icon: 'flame-outline', label: 'Day Streak', value: userStats.streak },
          ].map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Ionicons name={stat.icon} size={24} color="#4a4a4a" />
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {/* Add your recent activity components here */}
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>No recent activity</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {/* Add your achievements components here */}
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>No achievements yet</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
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
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#4a4a4a',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a4a4a',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a4a4a',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#4a4a4a',
    marginTop: 5,
  },
  section: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 10,
  },
  placeholderContent: {
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4a4a4a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;