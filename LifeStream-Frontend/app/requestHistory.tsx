import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';


const RequestHistory = () => {
  const { token } = useUser();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequestHistory = async () => {
    try {
      setLoading(true);
      if (!token) {
        Alert.alert('Authentication Error', 'You must be logged in to view your request history.');
        router.replace('/login');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/requests/my-requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(response.data);
    } 
    catch (error) {
      Alert.alert('Error', 'Failed to load request history. Please try again.');
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequestHistory();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return 'time';
      case 'Fulfilled': return 'checkmark-circle';
      case 'Expired': return 'alert-circle';
      case 'Cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return '#FF0000';
      case 'High': return '#FF6B35';
      case 'Medium': return '#FFA500';
      case 'Low': return '#4CAF50';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e53e3e" />
        <Text style={styles.loadingText}>Loading request history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary Header */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{requests.length}</Text>
          <Text style={styles.summaryLabel}>Total Requests</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {requests.filter(r => r.status === 'fulfilled').length}
          </Text>
          <Text style={styles.summaryLabel}>Fulfilled</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {requests.filter(r => r.status === 'pending').length}
          </Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      {/* Requests List */}
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No requests found</Text>
            <Text style={styles.emptySubtext}>Your submitted requests will appear here</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/createRequest')}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.createButtonText}>Create Request</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <View style={styles.cardHeader}>
              <View style={styles.leftHeader}>
                <View style={styles.bloodTypeContainer}>
                  <Text style={styles.bloodType}>{item.bloodGroup}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Ionicons name={getStatusIcon(item.status)} size={12} color="#FFF" />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <View style={[styles.urgencyIndicator, { backgroundColor: getUrgencyColor(item.urgency) }]} />
            </View>

            <Text style={styles.patientName}>{item.location}</Text>
            <Text style={styles.hospital}>{item.description}</Text>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Ionicons name="water" size={16} color="#e53e3e" />
                <Text style={styles.infoText}>{item.units} units</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={16} color="#e53e3e" />
                <Text style={styles.infoText}>Needed: {item.dateNeeded}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call" size={16} color="#e53e3e" />
                <Text style={styles.infoText}>Contact: {item.contactNumber}</Text>
              </View>
            </View>
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
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
  requestCard: {
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
  urgencyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#999',
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
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53e3e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default RequestHistory;
