import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from '../context/UserContext';


const FulfillRequest = () => {
  const { requestId } = useLocalSearchParams();
  const { token } = useUser();

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getRequest = async () => {
    if (!token) {
      Alert.alert('Authentication Error', 'You must be logged in to view this request.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setRequest(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const handleCallHospital = () => {
    if (request?.contactNumber) {
      Alert.alert(
        'Call Contact',
        `Call ${request.contactNumber}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => Linking.openURL(`tel:${request.contactNumber}`) }
        ]
      );
    }
  };

  const handleOpenLocation = () => {
    if (request?.location) {
      const encodedLocation = encodeURIComponent(request.location);
      const mapsUrl = `https://maps.google.com/?q=${encodedLocation}`;
      Linking.openURL(mapsUrl);
    }
  };

  const handleFulfillRequest = async () => {
    if (!token) {
      Alert.alert('Authentication Error', 'You must be logged in to fulfill a request.');
      return;
    }
    try {
      Alert.alert(
        'Confirm Fulfillment',
        'Are you sure you want to fulfill this blood donation request?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: async () => {
              try {
                setLoading(true);
                const response = await axios.patch(`${API_BASE_URL}/api/requests/${requestId}/fulfill`, {},
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                setRequest(response.data);
                setLoading(false);
                Alert.alert(
                  'Request Fulfilled!',
                  `Thank you for your generous donation! Your contribution will help save a life. The contact person will reach out to you shortly with further details.`,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        router.back();
                      }
                    }
                  ]
                );
              } catch (error) {
                setLoading(false);
                Alert.alert('Error', 'Failed to fulfill request. Please try again.');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to fulfill request');
    }
  };

  useEffect(() => {
    getRequest();
  }, [requestId]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return '#FF0000';
      case 'High': return '#FF6B35';
      case 'Medium': return '#FFA500';
      case 'Low': return '#4CAF50';
      default: return '#666';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'alert-circle';
      case 'High': return 'warning';
      case 'Medium': return 'information-circle';
      case 'Low': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e53e3e" />
        <Text style={styles.loadingText}>Loading request details...</Text>
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Request not found</Text>
        <Text style={styles.emptySubtext}>The requested blood donation could not be found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.requestCard}>
        <View style={styles.cardHeader}>
          <View style={styles.bloodTypeContainer}>
            <Text style={styles.bloodType}>{request.bloodGroup}</Text>
          </View>
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(request.urgency) }]}>
            <Ionicons name={getUrgencyIcon(request.urgency)} size={12} color="#FFF" />
            <Text style={styles.urgencyText}>{request.urgency}</Text>
          </View>
        </View>

        <Text style={styles.hospitalName}>{request.location}</Text>
        <Text style={styles.patientInfo}>Contact: {request.contactNumber}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="water" size={16} color="#e53e3e" />
          <Text style={styles.infoText}>{request.units} units needed</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={16} color="#e53e3e" />
          <Text style={styles.infoText}>Needed by: {request.dateNeeded}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description:</Text>
          <Text style={styles.descriptionText}>{request.description}</Text>
        </View>

        {/* Location Section */}
        <View style={styles.locationSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#e53e3e" />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <Text style={styles.locationText}>{request.location}</Text>

          {/* Map Placeholder */}
          <TouchableOpacity style={styles.mapContainer} onPress={handleOpenLocation}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={40} color="#e53e3e" />
              <Text style={styles.mapText}>Tap to open in Maps</Text>
              <Text style={styles.mapSubtext}>Get directions to {request.location}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.callButton} onPress={handleCallHospital}>
            <Ionicons name="call" size={20} color="#FFF" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.fulfillButton} onPress={handleFulfillRequest}>
            <Ionicons name="heart" size={20} color="#FFF" />
            <Text style={styles.fulfillButtonText}>Fulfill Request</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  bloodTypeContainer: {
    backgroundColor: '#e53e3e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bloodType: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  patientInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  descriptionContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  locationSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e53e3e',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  mapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53e3e',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  fulfillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e53e3e',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
  },
  fulfillButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  },
});

export default FulfillRequest;