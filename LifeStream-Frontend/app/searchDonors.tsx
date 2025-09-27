import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SearchDonors = () => {

  const mockDonors = [
    {
      id: '1',
      name: 'Sarah Johnson',
      bloodType: 'O+',
      location: 'Downtown',
      distance: 2.5,
      availability: 'Available',
      lastDonation: '2023-11-15',
      totalDonations: 8,
      rating: 4.9,
      phone: '+1-555-0111'
    },
    {
      id: '2',
      name: 'Michael Chen',
      bloodType: 'A+',
      location: 'Uptown',
      distance: 4.2,
      availability: 'Available',
      lastDonation: '2023-12-20',
      totalDonations: 12,
      rating: 4.8,
      phone: '+1-555-0222'
    },
    {
      id: '3',
      name: 'Emily Davis',
      bloodType: 'B+',
      location: 'Eastside',
      distance: 6.1,
      availability: 'Busy',
      lastDonation: '2024-01-05',
      totalDonations: 5,
      rating: 4.7,
      phone: '+1-555-0333'
    },
    {
      id: '4',
      name: 'Robert Wilson',
      bloodType: 'O-',
      location: 'Suburbs',
      distance: 8.3,
      availability: 'Available',
      lastDonation: '2023-10-28',
      totalDonations: 15,
      rating: 5.0,
      phone: '+1-555-0444'
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [donors, setDonors] = useState(mockDonors);
  const [loading, setLoading] = useState(false);

  const bloodTypes = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const locations = ['All', 'Downtown', 'Uptown', 'Eastside', 'Suburbs', 'Westside'];

  const searchDonors = async () => {
    try {
      setLoading(true); 
      await new Promise(resolve => setTimeout(resolve, 1000));
      let filteredDonors = mockDonors;
      
      if (selectedBloodType !== 'All') {
        filteredDonors = filteredDonors.filter(donor => donor.bloodType === selectedBloodType);
      }
      
      if (selectedLocation !== 'All') {
        filteredDonors = filteredDonors.filter(donor => donor.location === selectedLocation);
      }
      
      if (searchQuery) {
        filteredDonors = filteredDonors.filter(donor =>
          donor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setDonors(filteredDonors);
    } catch (error) {
      console.error('Failed to search donors');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    searchDonors();
  }, [selectedBloodType, selectedLocation]);

  // @ts-ignore
  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available': return '#4CAF50';
      case 'Busy': return '#FF9800';
      case 'Offline': return '#f44336';
      default: return '#666';
    }
  };

  // @ts-ignore
  const getAvailabilityIcon = (availability) => {
    switch (availability) {
      case 'Available': return 'checkmark-circle';
      case 'Busy': return 'time';
      case 'Offline': return 'close-circle';
      default: return 'help-circle';
    }
  };

  // @ts-ignore
  const handleContactDonor = (donor) => {
    router.push({
      pathname: '/profile',
      params: { donorId: donor.id }
    });
  };

  // @ts-ignore
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  // @ts-ignore
  const renderFilterButton = (items, selectedItem, onSelect) => (
    <View style={styles.filterContainer}>
      {/* @ts-ignore */}
      {items.map(item => (
        <TouchableOpacity
          key={item}
          style={[
            styles.filterButton,
            selectedItem === item && styles.selectedFilterButton
          ]}
          onPress={() => onSelect(item)}
        >
          <Text style={[
            styles.filterButtonText,
            selectedItem === item && styles.selectedFilterButtonText
          ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search donors by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchDonors}
        />
        <TouchableOpacity onPress={searchDonors} style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#e53e3e" />
        </TouchableOpacity>
      </View>

      {/* Blood Type Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Blood Type</Text>
        <View style={styles.filterScrollContainer}>
          {renderFilterButton(bloodTypes, selectedBloodType, setSelectedBloodType)}
        </View>
      </View>

      {/* Location Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Location</Text>
        <View style={styles.filterScrollContainer}>
          {renderFilterButton(locations, selectedLocation, setSelectedLocation)}
        </View>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e53e3e" />
          <Text style={styles.loadingText}>Searching donors...</Text>
        </View>
      ) : (
        <FlatList
          data={donors}
          renderItem={({ item }) => (
            <View style={styles.donorCard}>
              <View style={styles.cardHeader}>
                <View style={styles.donorInfo}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={24} color="#e53e3e" />
                  </View>
                  <View style={styles.donorDetails}>
                    <Text style={styles.donorName}>{item.name}</Text>
                    <View style={styles.ratingContainer}>
                      {renderStars(item.rating)}
                      <Text style={styles.ratingText}>({item.rating})</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bloodTypeContainer}>
                  <Text style={styles.bloodType}>{item.bloodType}</Text>
                </View>
              </View>

              <View style={styles.statusContainer}>
                <View style={[styles.availabilityBadge, { backgroundColor: getAvailabilityColor(item.availability) }]}>
                  <Ionicons name={getAvailabilityIcon(item.availability)} size={12} color="#FFF" />
                  <Text style={styles.availabilityText}>{item.availability}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <Ionicons name="location" size={16} color="#e53e3e" />
                  <Text style={styles.infoText}>{item.location} • {item.distance} km away</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="heart" size={16} color="#e53e3e" />
                  <Text style={styles.infoText}>{item.totalDonations} total donations</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar" size={16} color="#e53e3e" />
                  <Text style={styles.infoText}>Last donation: {item.lastDonation}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={[
                  styles.contactButton,
                  item.availability === 'Offline' && styles.disabledButton
                ]}
                onPress={() => handleContactDonor(item)}
                disabled={item.availability === 'Offline'}
              >
                <Ionicons name="chatbubble" size={16} color="#FFF" />
                <Text style={styles.contactButtonText}>Contact Donor</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#CCC" />
              <Text style={styles.emptyText}>No donors found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
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
  searchButton: {
    padding: 4,
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
  filterScrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e53e3e',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilterButton: {
    backgroundColor: '#e53e3e',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#e53e3e',
  },
  selectedFilterButtonText: {
    color: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  donorCard: {
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
  donorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  donorDetails: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
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
  statusContainer: {
    marginBottom: 12,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardContent: {
    marginBottom: 16,
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
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e53e3e',
    paddingVertical: 12,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  contactButtonText: {
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

export default SearchDonors;
