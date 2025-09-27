import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useUser } from '../context/UserContext';


const CreateRequest = () => {

  const [bloodGroup, setBloodGroup] = useState('');
  const [units, setUnits] = useState(0);
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('');
  const [dateNeeded, setDateNeeded] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date: Date) => {
    setDateNeeded(date.toISOString().split('T')[0]);
    hideDatePicker();
  };

  const [loading, setLoading] = useState(false);
  const { token } = useUser();

  const submitHandler = async () => {
    if (!bloodGroup || !units || !location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      if (!token) {
        Alert.alert('Authentication Error', 'You must be logged in to create a request.');
        router.replace('/login');
        setLoading(false);
        return;
      }

      const requestData = {
        bloodGroup,
        units,
        location,
        dateNeeded,
        urgency,
        description,
        contactNumber
      };

      const response = await axios.post(`${API_BASE_URL}/api/requests/`, requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', 'Blood request created successfully!', [
        {
          text: 'OK'
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={70}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="add-circle-outline" size={24} color="#e53e3e" />
            <Text style={styles.cardTitle}>Create Blood Request</Text>
          </View>

          {/* Blood Type */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="water-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Blood Type</Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={bloodGroup}
                onValueChange={setBloodGroup}
                style={styles.picker}
                dropdownIconColor="#e53e3e"
                mode="dropdown"
              >
                <Picker.Item label="Select Blood Type" value="" enabled={false} color="#999" />
                <Picker.Item label="A+ (A Positive)" value="A+" />
                <Picker.Item label="A- (A Negative)" value="A-" />
                <Picker.Item label="B+ (B Positive)" value="B+" />
                <Picker.Item label="B- (B Negative)" value="B-" />
                <Picker.Item label="O+ (O Positive)" value="O+" />
                <Picker.Item label="O- (O Negative)" value="O-" />
                <Picker.Item label="AB+ (AB Positive)" value="AB+" />
                <Picker.Item label="AB- (AB Negative)" value="AB-" />
              </Picker>
            </View>
          </View>

          {/* Urgency */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="alert-circle-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Urgency Level</Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={urgency}
                onValueChange={setUrgency}
                style={styles.picker}
                dropdownIconColor="#e53e3e"
                mode="dropdown"
              >
                <Picker.Item label="Select Urgency Level" value="" enabled={false} color="#999" />
                <Picker.Item label="Critical" value="Critical" />
                <Picker.Item label="High" value="High" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="Low" value="Low" />
              </Picker>
            </View>
          </View>


          {/* Location */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="location-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Location</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter location/address"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#999"
            />
          </View>


          {/* Units Needed */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="fitness-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Units Needed</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Number of units"
              value={units === 0 ? '' : units.toString()}
              onChangeText={(value) => setUnits(Number(value))}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          {/* Date Needed */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="calendar-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Date Needed</Text>
            </View>
            <TouchableOpacity onPress={showDatePicker} style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}> 
              <Text style={{ color: dateNeeded ? '#000' : '#999', flex: 1 }}>
                {dateNeeded || 'Select date'}
              </Text>
              <Ionicons name="calendar" size={20} color="#999" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>


          {/* Contact Phone */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="call-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Contact Phone</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter contact phone number"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>


          {/* Description */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="document-text-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Description</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional details about the request..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={submitHandler}
            disabled={loading}
          >
            <Ionicons name="add-circle" size={20} color="#FFF" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating Request...' : 'Create Request'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelIcon: {
    marginRight: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#2d3748',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e53e3e',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default CreateRequest;