import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../utils/api';


const EditProfile = () => {
  const params = useLocalSearchParams();
  const { token } = useUser();
  
  const [id, setId] = useState(params._id ? params._id.toString() : "");
  const [name, setName] = useState(params.name ? params.name.toString() : "");
  const [email, setEmail] = useState(params.email ? params.email.toString() : "");
  const [password, setPassword] = useState(params.password ? params.password.toString() : "");
  const [role, setRole] = useState(params.role ? params.role.toString() : "donor");
  const [bloodGroup, setBloodGroup] = useState(params.bloodGroup ? params.bloodGroup.toString() : "");
  const [location, setLocation] = useState(params.location ? params.location.toString() : "");
  const [contact, setContact] = useState(params.contact ? params.contact.toString() : "");


  // Dummy data states (not sent to backend)
  const [dateOfBirth, setDateOfBirth] = useState('2000-01-15');
  const [weight, setWeight] = useState('70');

  // Date picker state for date of birth
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date: Date) => {
    setDateOfBirth(date.toISOString().split('T')[0]);
    hideDatePicker();
  };

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!params._id);

  React.useEffect(() => {
    if (params._id) {
      setInitialLoading(false);
    }
  }, [params._id]);


      const submitHandler = async () => {
        if (!name || !email || !role || !bloodGroup || !location || !contact) {
          Alert.alert('Validation Error', 'All required fields must be filled.');
          return;
        }

        try {
          setLoading(true);

          if (!token) {
            Alert.alert('Authentication Error', 'You must be logged in to edit your profile.');
            router.replace('/login');
            setLoading(false);
            return;
          }

          const updateData = {
            name,
            email,
            role,
            bloodGroup,
            location,
            contact
          };


          const response = await axios.put(`${API_BASE_URL}/api/users/update/${id}`,
            updateData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          Alert.alert('Success', 'Profile updated successfully!', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        } catch (error) {
          console.error('Update error:', error);
          Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      const handleCancel = () => {
        Alert.alert(
          'Discard Changes',
          'Are you sure you want to discard your changes?',
          [
            { text: 'Keep Editing', style: 'cancel' },
            { text: 'Discard', style: 'destructive', onPress: () => router.back() }
          ]
        );
      };

      return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={70}
        >
          {initialLoading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="person-circle" size={60} color="#e53e3e" />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <Ionicons name="person-circle" size={60} color="#e53e3e" />
                  <Text style={styles.headerTitle}>Edit Profile</Text>
                  <Text style={styles.headerSubtitle}>Update your information</Text>
                </View>
              </View>

              {/* Personal Information */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="person" size={20} color="#e53e3e" />
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Ionicons name="person-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
                    <Text style={styles.label}>Full Name</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Ionicons name="mail-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
                    <Text style={styles.label}>Email</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Ionicons name="call-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
                    <Text style={styles.label}>Contact Number</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={contact}
                    onChangeText={setContact}
                    keyboardType="phone-pad"
                    placeholder="Enter your contact number"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Ionicons name="people-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
                    <Text style={styles.label}>Role</Text>
                  </View>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={role}
                      onValueChange={setRole}
                      style={styles.picker}
                      dropdownIconColor="#e53e3e"
                      mode="dropdown"
                    >
                      <Picker.Item label="Blood Donor" value="donor" />
                      <Picker.Item label="Blood Recipient" value="recipient" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Ionicons name="lock-closed-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
                    <Text style={styles.label}>Password</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="Enter new password (leave blank to keep current)"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Ionicons name="calendar-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
                    <Text style={styles.label}>Date of Birth</Text>
                  </View>
                  <TouchableOpacity onPress={showDatePicker} style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}> 
                    <Text style={{ color: dateOfBirth ? '#000' : '#999', flex: 1 }}>
                      {dateOfBirth || 'Select date'}
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

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Ionicons name="location-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
                    <Text style={styles.label}>Location</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Enter your location"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* Medical Information */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="medical" size={20} color="#e53e3e" />
                  <Text style={styles.sectionTitle}>Medical Information</Text>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Ionicons name="water-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
                    <Text style={styles.label}>Blood Group</Text>
                  </View>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={bloodGroup}
                      onValueChange={setBloodGroup}
                      style={styles.picker}
                      dropdownIconColor="#e53e3e"
                      mode="dropdown"
                    >
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

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Ionicons name="fitness-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
                    <Text style={styles.label}>Weight (kg)</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="Enter your weight in kg"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, loading && styles.disabledButton]}
                  onPress={submitHandler}
                  disabled={loading}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                  <Text style={styles.saveButtonText}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomSpacer} />
            </ScrollView>
          )}
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
        paddingBottom: 20,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
      },
      loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
      },
      header: {
        backgroundColor: '#FFF',
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      headerContent: {
        alignItems: 'center',
      },
      headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 12,
      },
      headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
      },
      sectionCard: {
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
      sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
      },
      inputGroup: {
        marginBottom: 16,
      },
      labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingTop: 2,
      },
      labelIcon: {
        marginRight: 6,
      },
      label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
      },
      input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#FFF',
        color: '#2d3748',
      },
      textArea: {
        height: 80,
        textAlignVertical: 'top',
      },
      pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#FFF',
        paddingLeft: 16,
        overflow: 'hidden',
      },
      picker: {
        height: 50,
        color: '#2d3748',
      },
      actionContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        gap: 12,
      },
      cancelButton: {
        flex: 1,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
      },
      cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
      },
      saveButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e53e3e',
        paddingVertical: 16,
        borderRadius: 12,
      },
      disabledButton: {
        opacity: 0.6,
      },
      saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
      },
      bottomSpacer: {
        height: 20,
      },
    });

    export default EditProfile;
