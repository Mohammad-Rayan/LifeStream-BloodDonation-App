import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';

// @ts-ignore
const CustomDrawer = ({ isVisible, onClose }) => {
  const { user, loading } = useUser();
  if (!isVisible) return null;

  const drawerItems = [
    { title: 'Home', icon: 'home', route: '/', description: 'Dashboard and overview' },
    { title: 'Create Request', icon: 'add-circle', route: '/createRequest', description: 'Submit new request' },
    { title: 'View Requests', icon: 'list', route: '/viewRequests', description: 'Browse blood requests' },
    { title: 'Profile', icon: 'person', route: '/profile', description: 'Manage your account' },
  ];

  const moreItems = [
    { title: 'Edit Profile', icon: 'create', route: '/editProfile', description: 'Update personal info' },
    { title: 'Request History', icon: 'document-text', route: '/requestHistory', description: 'Your past requests' },
    { title: 'Donation History', icon: 'heart-outline', route: '/donationHistory', description: 'Track your donations' },
    { title: 'Search Donors', icon: 'search', route: '/searchDonors', description: 'Find compatible donors' },
    { title: 'Notifications', icon: 'notifications', route: '/notifications', description: 'View alerts & updates' },
    { title: 'About', icon: 'information-circle', route: '/about', description: 'App information' },
  ];

  // @ts-ignore
  const handleNavigation = (route) => {
    onClose();
    router.push(route);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.drawer}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="medical" size={32} color="#e53e3e" />
  <Text style={styles.headerTitle}>LifeStream</Text>
  <Text style={styles.headerSubtitle}>Connecting Donors, Saving Lives</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Navigation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Main Navigation</Text>
            {drawerItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.drawerItem}
                onPress={() => handleNavigation(item.route)}
              >
                <View style={styles.itemIconContainer}>
                  {/* @ts-ignore */}
                  <Ionicons name={item.icon} size={20} color="#e53e3e" />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>

          {/* More Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More Options</Text>
            {moreItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.drawerItem}
                onPress={() => handleNavigation(item.route)}
              >
                <View style={styles.itemIconContainer}>
                  {/* @ts-ignore */}
                  <Ionicons name={item.icon} size={20} color="#666" />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Emergency Section */}
          <View style={styles.emergencySection}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.emergencyTitle}>Emergency</Text>
            </View>
            <Text style={styles.emergencyText}>
              In case of medical emergency, contact your local emergency services immediately.
            </Text>
            <TouchableOpacity style={styles.emergencyButton}>
              <Ionicons name="call" size={16} color="#fff" />
              <Text style={styles.emergencyButtonText}>Emergency: 911</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 LifeStream</Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </ScrollView>
        {/* Login/Logout Button at the bottom */}
        <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}>
          <TouchableOpacity
            style={[styles.drawerItem, { borderBottomWidth: 0 }]}
            onPress={() => handleNavigation(user ? '/logout' : '/login')}
          >
            <View style={styles.itemIconContainer}>
              <Ionicons name={user ? 'log-out' : 'log-in'} size={20} color="#e53e3e" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{user ? 'Logout' : 'Login'}</Text>
              <Text style={styles.itemDescription}>{user ? 'Sign out of account' : 'Sign in to your account'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: 320,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e53e3e',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#f8f9fa',
    marginTop: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 15,
    padding: 5,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginHorizontal: 20,
    letterSpacing: 0.5,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
  },
  emergencySection: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    marginLeft: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    color: '#ccc',
  },
});

export default CustomDrawer;
