import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';

const DonationHistory = () => {
  const { token } = useUser();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDonationHistory = async () => {
      try {
        setLoading(true);
        if (!token) {
          Alert.alert('Authentication Error', 'You must be logged in to view your donation history.');
          router.replace('/login');
          setLoading(false);
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/requests/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setDonations(response.data);
      } catch (error) {
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadDonationHistory();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#4CAF50';
      case 'Fulfilled': return '#2196F3';
      case 'Expired': return '#FF9800';
      case 'Cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const totalUnits = donations.reduce((sum, d) => sum + (d.units || 0), 0);
  const completedDonations = donations.length;
  const lastDonation = donations.length > 0 ? donations[0].fulfilledAt : 'Never';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e53e3e" />
        <Text style={styles.loadingText}>Loading donation history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{totalUnits}</Text>
          <Text style={styles.summaryLabel}>Units Donated</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{completedDonations}</Text>
          <Text style={styles.summaryLabel}>Lives Saved</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumberSmall}>{lastDonation}</Text>
          <Text style={styles.summaryLabel}>Last Donation</Text>
        </View>
      </View>
      <FlatList
        data={donations}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No donations yet</Text>
            <Text style={styles.emptySubtext}>Start saving lives by fulfilling blood requests</Text>
            <TouchableOpacity 
              style={styles.donateButton}
              onPress={() => router.push('/viewRequests')}
            >
              <Ionicons name="heart" size={20} color="#FFF" />
              <Text style={styles.donateButtonText}>Find Requests</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.donationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.leftHeader}>
                <View style={styles.bloodTypeContainer}>
                  <Text style={styles.bloodType}>{item.bloodGroup}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>  
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.unitsContainer}>
                <Text style={styles.unitsText}>{item.units}</Text>
                <Text style={styles.unitsLabel}>units</Text>
              </View>
            </View>
            <Text style={styles.patientName}>{item.recipientId?.name || 'Anonymous Patient'}</Text>
            <Text style={styles.hospital}>{item.description}</Text>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color="#e53e3e" />
                <Text style={styles.infoText}>{item.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={16} color="#e53e3e" />
                <Text style={styles.infoText}>Donated: {item.fulfilledAt}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call" size={16} color="#e53e3e" />
                <Text style={styles.infoText}>Contact: {item.contactNumber}</Text>
              </View>
            </View>
            {item.status === 'fulfilled' && (
              <TouchableOpacity style={styles.certificateButton}>
                <Ionicons name="document-text" size={16} color="#e53e3e" />
                <Text style={styles.certificateButtonText}>View Certificate</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

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
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e53e3e',
  },
  summaryNumberSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e53e3e',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  donationCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bloodTypeContainer: {
    backgroundColor: '#e53e3e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  bloodType: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  unitsContainer: {
    alignItems: 'center',
  },
  unitsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e53e3e',
  },
  unitsLabel: {
    fontSize: 12,
    color: '#666',
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  hospital: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  certificateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#e53e3e',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  certificateButtonText: {
    color: '#e53e3e',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    marginBottom: 24,
    textAlign: 'center',
  },
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53e3e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  donateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DonationHistory;
