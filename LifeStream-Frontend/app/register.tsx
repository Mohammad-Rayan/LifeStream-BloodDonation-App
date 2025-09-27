import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from '../utils/api';


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async () => {
    if (!name || !email || !password || !role || !bloodGroup || !location || !contact) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const userData = {
        name,
        email,
        password,
        role,
        bloodGroup,
        location,
        contact
      };
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, userData);
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setLoading(false);
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => { router.replace('/login'); } }
      ]);
    } catch (err: any) {
      setLoading(false);
      console.error('Register error:', err?.response?.data || err);
      Alert.alert('Registration failed', err?.response?.data?.message || 'An error occurred');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={70}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/icon.png')}
              style={{ width: 120, height: 120, resizeMode: 'cover', borderRadius: 60 }}
            />
          </View>
          <Text style={styles.title}>LifeStream</Text>
          <Text style={styles.subtitle}>Connecting Donors, Saving Lives</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formContainer}>
          <View style={styles.welcomeContainer}>
            <Ionicons name="person-add" size={24} color="#e53e3e" style={styles.welcomeIcon} />
            <Text style={styles.welcomeText}>Create Account</Text>
          </View>

          {/* Name */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Ionicons name="person-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Full Name</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Ionicons name="mail-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Ionicons name="lock-closed-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Password</Text>
            </View>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={showPassword ? "#e53e3e" : "#666"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Role */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Ionicons name="people-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Role</Text>
            </View>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={role}
                onValueChange={setRole}
                style={[styles.picker, { color: role ? '#2d3748' : '#999' }]}
                dropdownIconColor={role ? "#e53e3e" : "#666"}
                mode="dropdown"
              >
                <Picker.Item label="Select your role" value="" enabled={false} />
                <Picker.Item label="Blood Donor" value="donor" />
                <Picker.Item label="Blood Recipient" value="recipient" />
              </Picker>
            </View>
          </View>

          {/* Blood Group */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Ionicons name="water-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Blood Group</Text>
            </View>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={bloodGroup}
                onValueChange={setBloodGroup}
                style={[styles.picker, { color: bloodGroup ? '#2d3748' : '#999' }]}
                dropdownIconColor={bloodGroup ? "#e53e3e" : "#666"}
                mode="dropdown"
              >
                <Picker.Item label="Select blood group" value="" enabled={false} />
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

          {/* Location */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Ionicons name="location-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Location</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your location"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#999"
            />
          </View>

          {/* Contact */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Ionicons name="call-outline" size={18} color="#e53e3e" style={styles.labelIcon} />
              <Text style={styles.label}>Contact Number</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your contact number"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={submitHandler}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.registerButtonText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>By creating an account, you agree to our Terms of Service and Privacy Policy</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e53e3e',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  welcomeIcon: {
    marginRight: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  inputContainer: {
    marginBottom: 20,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
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
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -14 }],
    padding: 4,
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingLeft: 16,
    overflow: 'hidden',
  },
  pickerIcon: {
    marginRight: 12,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#2d3748',
  },
  registerButton: {
    backgroundColor: '#e53e3e',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#e53e3e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonDisabled: {
    backgroundColor: '#cbd5e0',
    shadowOpacity: 0,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#e53e3e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default Register;