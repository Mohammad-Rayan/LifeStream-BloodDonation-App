import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useUser } from '../context/UserContext';

const ViewRequest = () => {
  const { token } = useUser();
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'pending' | 'fulfilled' | 'cancelled'>('All');

  const bloodTypes = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const urgencyLevels = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const statusLevels = ['All', 'pending', 'fulfilled', 'cancelled'];

  const getRequests = async () => {
    try {
      setLoading(true);
      if (!token) {
        Alert.alert('Authentication Error', 'You must be logged in to view requests.');
        router.replace('/login');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/requests/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setRequests(response.data);
      setFilteredRequests(response.data);
    } catch (error) {
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };


  const filterRequests = () => {
    let filtered = requests;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(request =>
        request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by blood group
    if (selectedBloodType !== 'All') {
      filtered = filtered.filter(request => request.bloodGroup === selectedBloodType);
    }

    // Filter by urgency
    if (selectedUrgency !== 'All') {
      filtered = filtered.filter(request => request.urgency === selectedUrgency);
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }

    setFilteredRequests(filtered);
  };

  useEffect(() => {
    getRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, selectedBloodType, selectedUrgency, selectedStatus, requests]);

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

  const handleContactDonor = (request: any) => {
    Alert.alert(
      'Contact Hospital',
      `Call at ${request.contactNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling...') }
      ]
    );
  };

  const renderFilterButton = (items: string[], selectedItem: string, onSelect: (item: string) => void, iconName: keyof typeof Ionicons.glyphMap) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
      {items.map(item => (
        <TouchableOpacity
          key={item}
          style={[
            styles.filterButton,
            selectedItem === item && styles.selectedFilterButton
          ]}
          onPress={() => onSelect(item)}
        >
          <Ionicons
            name={iconName}
            size={14}
            color={selectedItem === item ? '#FFF' : '#e53e3e'}
          />
          <Text style={[
            styles.filterButtonText,
            selectedItem === item && styles.selectedFilterButtonText
          ]}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e53e3e" />
        <Text style={styles.loadingText}>Loading requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by blood group, location, or description..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {/* Blood Group Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Blood Group</Text>
        {renderFilterButton(bloodTypes, selectedBloodType, setSelectedBloodType, 'water')}
      </View>
      {/* Urgency Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Urgency</Text>
        {renderFilterButton(urgencyLevels, selectedUrgency, setSelectedUrgency, 'alert-circle')}
      </View>
      {/* Status Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Status</Text>
        {renderFilterButton(statusLevels, selectedStatus, (item) => setSelectedStatus(item as 'All' | 'pending' | 'fulfilled' | 'cancelled'), 'checkmark-circle')}
      </View>
      {/* Requests List */}
      <FlatList
        data={filteredRequests}
        renderItem={({ item }) => (
          <View style={styles.requestCard} key={item.id}>
            <View style={styles.cardHeader}>
              <View style={styles.bloodTypeContainer}>
                <Text style={styles.bloodType}>{item.bloodGroup}</Text>
              </View>
              <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(item.urgency) }]}>
                <Ionicons name={getUrgencyIcon(item.urgency)} size={12} color="#FFF" />
                <Text style={styles.urgencyText}>{item.urgency}</Text>
              </View>
            </View>
            <Text style={styles.patientName}>Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color="#e53e3e" />
                <Text style={styles.infoText}>{item.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="water" size={16} color="#e53e3e" />
                <Text style={styles.infoText}>{item.units} units needed</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={16} color="#e53e3e" />
                <Text style={styles.infoText}>Needed by: {item.dateNeeded}</Text>
              </View>
              {item.description && (
                <View style={styles.infoRow}>
                  <Ionicons name="document-text" size={16} color="#e53e3e" />
                  <Text style={styles.infoText}>{item.description}</Text>
                </View>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => Alert.alert('Contact', `Call ${item.hospital} at ${item.contactNumber}`)}
              >
                <Ionicons name="call" size={16} color="#e53e3e" />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fulfillButton}
                onPress={() => router.push({
                  pathname: '/fulfillRequest',
                  params: { requestId: item._id }
                })}
              >
                <Ionicons name="heart" size={16} color="#FFF" />
                <Text style={styles.fulfillButtonText}>Fulfill Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
        }
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          < View style={styles.emptyContainer} >
            <Ionicons name="search" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No requests found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
          </View >
        }
      />
    </View >
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterSection: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e53e3e',
  },
  selectedFilterButton: {
    backgroundColor: '#e53e3e',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#e53e3e',
    marginLeft: 4,
  },
  selectedFilterButtonText: {
    color: '#FFF',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
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
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cardContent: {
    marginBottom: 16,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#e53e3e',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
  },
  contactButtonText: {
    color: '#e53e3e',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  fulfillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e53e3e',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
  },
  fulfillButtonText: {
    color: '#FFF',
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
  },
});

export default ViewRequest;