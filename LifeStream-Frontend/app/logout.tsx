import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';


const Logout = () => {
  const { user, refreshUser } = useUser();
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout? You will need to login again to access your account.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoggingOut(true);
              await AsyncStorage.multiRemove(['token']);
              await refreshUser();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="log-out" size={64} color="#e53e3e" />
          </View>

          {/* Title and Description */}
          <Text style={styles.title}>Logout</Text>
          <Text style={styles.description}>
            You are about to logout from your account. You will need to login again to access your profile and continue helping save lives.
          </Text>

          {/* User Info Card */}
          <View style={styles.userCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={32} color="#e53e3e" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{loading ? 'Loading...' : user.name}</Text>
              <Text style={styles.userEmail}>{loading ? '' : user.email}</Text>
              <Text style={styles.userType}>{loading ? '' : `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} • ${user.bloodGroup} Blood Type`}</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Impact</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="heart" size={20} color="#e53e3e" />
                <Text style={styles.statNumber}>{loading ? '-' : (user.donationHistory?.length || 0)}</Text>
                <Text style={styles.statLabel}>Lives Saved</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="water" size={20} color="#e53e3e" />
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Units Donated</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="document-text" size={20} color="#e53e3e" />
                <Text style={styles.statNumber}>{loading ? '-' : (user.requestHistory?.length || 0)}</Text>
                <Text style={styles.statLabel}>Requests Made</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loggingOut}
            >
              <Text style={styles.cancelButtonText}>Stay Logged In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.logoutButton, loggingOut && styles.disabledButton]}
              onPress={handleLogout}
              disabled={loggingOut}
            >
              <Ionicons
                name="log-out"
                size={20}
                color="#FFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.logoutButtonText}>
                {loggingOut ? 'Logging Out...' : 'Logout'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Note */}
          <View style={styles.footerNote}>
            <Ionicons name="information-circle" size={16} color="#666" />
            <Text style={styles.footerText}>
              Your data will be safely stored and available when you login again.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userType: {
    fontSize: 12,
    color: '#e53e3e',
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e53e3e',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 24,
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#e53e3e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
  },
});

export default Logout;
