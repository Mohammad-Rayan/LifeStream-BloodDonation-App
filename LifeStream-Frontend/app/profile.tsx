import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from '../context/UserContext';

const Profile = () => {
    const { user, token, loading, refreshUser, setUser } = useUser();
    const [roleToggleLoading, setRoleToggleLoading] = useState(false);

    const getUserProfile = async () => {
        try {
            if (!token) {
                Alert.alert('Authentication Error', 'You must be logged in to view your profile.');
                router.replace('/login');
                return;
            }
            const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (err) {
            setUser(null);
            Alert.alert('Error', 'Failed to load profile data');
        }
    }

    const handleRoleToggle = async (newRole: 'donor' | 'recipient') => {
        if (user?.role === newRole) return;
        try {
            setRoleToggleLoading(true);
            if (!token) throw new Error('No token');
            const response = await axios.patch(`${API_BASE_URL}/api/users/toggle-role`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.role) {
                setUser((prevUser: any) => ({ ...prevUser, role: response.data.role }));
                Alert.alert(
                    'Success',
                    `Your role has been updated to ${response.data.role}`
                );
            }
        } catch (error) {
            console.error('Error toggling role:', error);
            Alert.alert(
                'Error',
                'Failed to update your role. Please try again.'
            );
        } finally {
            setRoleToggleLoading(false);
        }
    }

    useEffect(() => {
        getUserProfile();
    }, [token])

    useFocusEffect(
        React.useCallback(() => {
            getUserProfile();
        }, [token])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e53e3e" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (roleToggleLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e53e3e" />
                <Text style={styles.loadingText}>Switching role...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={60} color="#e53e3e" />
                </View>
                <Text style={styles.title}>Profile</Text>
                <Text style={styles.subtitle}>Manage your account</Text>
            </View>

            {user ? (
                <View style={styles.content}>
                    {/* Personal Information Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="person-outline" size={24} color="#e53e3e" />
                            <Text style={styles.cardTitle}>Personal Information</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Full Name</Text>
                                <Text style={styles.infoValue}>{user.name}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Contact Number</Text>
                                <Text style={styles.infoValue}>{user.contact}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Email Address</Text>
                                <Text style={styles.infoValue}>{user.email}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={[styles.infoItem, styles.halfWidth]}>
                                <Text style={styles.infoLabel}>Role</Text>
                                <View style={styles.roleTag}>
                                    <Text style={styles.roleText}>{user.role}</Text>
                                </View>
                            </View>

                            <View style={[styles.infoItem, styles.halfWidth]}>
                                <Text style={styles.infoLabel}>Blood Group</Text>
                                <View style={styles.bloodGroupTag}>
                                    <Ionicons name="water" size={16} color="#e53e3e" />
                                    <Text style={styles.bloodGroupText}>{user.bloodGroup}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Location</Text>
                                <Text style={styles.infoValue}>{user.location}</Text>
                            </View>
                        </View>

                    </View>

                    {/* Role Toggle Section */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="swap-horizontal-outline" size={24} color="#e53e3e" />
                            <Text style={styles.cardTitle}>Switch Role</Text>
                        </View>

                        <Text style={styles.roleToggleDescription}>
                            Toggle between donating blood and receiving blood based on your current needs.
                        </Text>

                        <View style={styles.roleToggleContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.roleToggleButton,
                                    user.role === 'donor' && styles.activeRoleButton
                                ]}
                                onPress={() => handleRoleToggle('donor')}
                                disabled={user.role === 'donor'}
                            >
                                <Ionicons
                                    name="heart"
                                    size={24}
                                    color={user.role === 'donor' ? '#fff' : '#e53e3e'}
                                />
                                <Text style={[
                                    styles.roleToggleButtonText,
                                    user.role === 'donor' && styles.activeRoleButtonText
                                ]}>
                                    Donate Blood
                                </Text>
                                <Text style={[
                                    styles.roleToggleButtonSubtext,
                                    user.role === 'donor' && styles.activeRoleButtonSubtext
                                ]}>
                                    Help others in need
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.roleToggleButton,
                                    user.role === 'recipient' && styles.activeRoleButton
                                ]}
                                onPress={() => handleRoleToggle('recipient')}
                                disabled={user.role === 'recipient'}
                            >
                                <Ionicons
                                    name="medical"
                                    size={24}
                                    color={user.role === 'recipient' ? '#fff' : '#e53e3e'}
                                />
                                <Text style={[
                                    styles.roleToggleButtonText,
                                    user.role === 'recipient' && styles.activeRoleButtonText
                                ]}>
                                    Receive Blood
                                </Text>
                                <Text style={[
                                    styles.roleToggleButtonSubtext,
                                    user.role === 'recipient' && styles.activeRoleButtonSubtext
                                ]}>
                                    Find compatible donors
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActionsContainer}>
                        <TouchableOpacity
                            style={styles.editProfileButton}
                            onPress={() => router.push({ pathname: '/editProfile', params: user })}
                        >
                            <Ionicons name="create-outline" size={20} color="#e53e3e" />
                            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={() => router.push('/notifications')}
                        >
                            <Ionicons name="notifications-outline" size={20} color="#666" />
                            <Text style={styles.settingsButtonText}>Notifications</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Navigation Grid */}
                    <View style={styles.navigationGrid}>
                        <TouchableOpacity
                            style={styles.navCard}
                            onPress={() => router.push({ pathname: '/requestHistory', params: user })}
                        >
                            <Ionicons name="document-text" size={24} color="#e53e3e" />
                            <Text style={styles.navCardTitle}>Request History</Text>
                            <Text style={styles.navCardSubtitle}>View past requests</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.navCard}
                            onPress={() => router.push({ pathname: '/donationHistory', params: user })}
                        >
                            <Ionicons name="heart" size={24} color="#e53e3e" />
                            <Text style={styles.navCardTitle}>Donation History</Text>
                            <Text style={styles.navCardSubtitle}>Track your impact</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.navCard}
                            onPress={() => router.push('/searchDonors')}
                        >
                            <Ionicons name="search" size={24} color="#e53e3e" />
                            <Text style={styles.navCardTitle}>Search Donors</Text>
                            <Text style={styles.navCardSubtitle}>Find compatible donors</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.navCard}
                            onPress={() => router.push('/about')}
                        >
                            <Ionicons name="information-circle" size={24} color="#e53e3e" />
                            <Text style={styles.navCardTitle}>About</Text>
                            <Text style={styles.navCardSubtitle}>App information</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.logoutButton} onPress={() => {
                            router.push('/logout');
                        }}>
                            <Ionicons name="log-out-outline" size={20} color="#fff" />
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                    <Text style={styles.errorText}>Failed to load profile</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={getUserProfile}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

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
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 24,
    },
    avatarContainer: {
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
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d3748',
        marginLeft: 12,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    infoItem: {
        flex: 1,
    },
    halfWidth: {
        flex: 0.48,
        marginRight: 8,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#2d3748',
        fontWeight: '500',
    },
    roleTag: {
        backgroundColor: '#e7f3ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    roleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1976d2',
        textTransform: 'capitalize',
    },
    bloodGroupTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fee2e2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    bloodGroupText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#e53e3e',
        marginLeft: 4,
    },
    actionButtons: {
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: '#ef4444',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    errorText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ef4444',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#e53e3e',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    quickActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e53e3e',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        flex: 1,
        marginRight: 8,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    editProfileButtonText: {
        color: '#e53e3e',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        flex: 1,
        marginLeft: 8,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    settingsButtonText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    navigationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    navCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        width: '48%',
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 3,
        borderLeftColor: '#e53e3e',
    },
    navCardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 8,
        marginBottom: 4,
        textAlign: 'center',
    },
    navCardSubtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    roleToggleDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        lineHeight: 20,
        textAlign: 'center',
    },
    roleToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    roleToggleButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e53e3e',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    activeRoleButton: {
        backgroundColor: '#e53e3e',
        borderColor: '#e53e3e',
        shadowColor: '#e53e3e',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    roleToggleButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e53e3e',
        marginTop: 8,
        textAlign: 'center',
    },
    activeRoleButtonText: {
        color: '#fff',
    },
    roleToggleButtonSubtext: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
    activeRoleButtonSubtext: {
        color: '#fff',
        opacity: 0.9,
    },
});

export default Profile;