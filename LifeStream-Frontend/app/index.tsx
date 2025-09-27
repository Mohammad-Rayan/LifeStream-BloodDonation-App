import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from '../context/UserContext';

const Home = () => {
  const [greetings, setGreetings] = useState("")
  const [stats, setStats] = useState({
    totalDonations: 0,
    pendingRequests: 0,
    successfulMatches: 0
  })
  const { user, loading, refreshUser } = useUser();

  const checkOnboardingStatus = async () => {
    try {
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      if (!hasCompletedOnboarding) {
        // Redirect to welcome screen if onboarding not completed
        router.replace('/welcome');
        return false;
      }
      return true;
    } catch (error) {
      console.log('Error checking onboarding status:', error);
      return true; // Default to true if error occurs
    }
  };

  const getGreetings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}`);
      setGreetings(response.data);
    } catch (error) {
      console.log('Error fetching greetings:', error);
    }
  }

  const getStats = async () => {
    // Mock stats - replace with actual API calls
    setStats({
      totalDonations: 156,
      pendingRequests: 12,
      successfulMatches: 89
    });
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create':
        router.push('/createRequest');
        break;
      case 'view':
        router.push('/viewRequests');
        break;
      case 'fulfill':
        router.push('/fulfillRequest');
        break;
      case 'profile':
        router.push('/profile');
        break;
      default:
        break;
    }
  }

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const quickActions = [
    { title: 'Create Request', icon: 'add-circle' as keyof typeof Ionicons.glyphMap, route: '/createRequest', color: '#e53e3e' },
    { title: 'View Requests', icon: 'list' as keyof typeof Ionicons.glyphMap, route: '/viewRequests', color: '#2196F3' },
    { title: 'Fulfill Request', icon: 'heart' as keyof typeof Ionicons.glyphMap, route: '/fulfillRequest', color: '#4CAF50' },
    { title: 'Search Donors', icon: 'search' as keyof typeof Ionicons.glyphMap, route: '/searchDonors', color: '#FF9800' },
  ];

  const moreActions = [
    { title: 'Request History', icon: 'document-text' as keyof typeof Ionicons.glyphMap, route: '/requestHistory' },
    { title: 'Donation History', icon: 'heart-outline' as keyof typeof Ionicons.glyphMap, route: '/donationHistory' },
    { title: 'Notifications', icon: 'notifications' as keyof typeof Ionicons.glyphMap, route: '/notifications' },
    { title: 'About', icon: 'information-circle' as keyof typeof Ionicons.glyphMap, route: '/about' },
  ];

  useEffect(() => {
    const initializeApp = async () => {
      const shouldProceed = await checkOnboardingStatus();
      if (shouldProceed) {
        getGreetings();
        refreshUser();
        getStats();
      }
    };

    initializeApp();
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e53e3e" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
          </Text>
          <Text style={styles.subtitleText}>
            Ready to save lives today?
          </Text>
        </View>
        <View style={styles.profilePicture}>
          <Ionicons name="person" size={32} color="#e53e3e" />
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={24} color="#e53e3e" />
            <Text style={styles.statNumber}>{stats.totalDonations}</Text>
            <Text style={styles.statLabel}>Total Donations</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{stats.pendingRequests}</Text>
            <Text style={styles.statLabel}>Pending Requests</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <Text style={styles.statNumber}>{stats.successfulMatches}</Text>
            <Text style={styles.statLabel}>Lives Saved</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => handleNavigation(action.route)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={32} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>Request blood donation</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Emergency Section */}
      <View style={styles.section}>
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="alert-circle" size={24} color="#ef4444" />
            <Text style={styles.emergencyTitle}>Emergency Alert</Text>
          </View>
          <Text style={styles.emergencyText}>
            Urgent need for O- blood type in your area. Your donation could save a life right now!
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>Respond Now</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Server Status */}
      {greetings && (
        <View style={styles.section}>
          <View style={styles.statusCard}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.statusText}>Server Status: {greetings}</Text>
          </View>
        </View>
      )}

      {/* Blood Type Compatibility Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blood Type Compatibility</Text>
        <View style={styles.compatibilityCard}>
          <Text style={styles.compatibilityText}>
            💡 Did you know? Type O- donors are universal donors and can help anyone in need!
          </Text>
        </View>
      </View>

      {/* More Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More Actions</Text>
        <View style={styles.actionsGrid}>
          {moreActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => handleNavigation(action.route)}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon} size={32} color="#e53e3e" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>View your details</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  emergencyCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
    marginLeft: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  emergencyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  statusText: {
    marginLeft: 8,
    color: '#065f46',
    fontWeight: '500',
  },
  compatibilityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  compatibilityText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
});