import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Notifications = () => {
  // Mock data for demonstration
  const mockNotifications = [
    {
      id: '1',
      type: 'emergency',
      title: 'Emergency Blood Request',
      message: 'Critical O+ blood needed at City General Hospital. Patient in emergency surgery.',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      actionUrl: '/viewRequests'
    },
    {
      id: '2',
      type: 'donation',
      title: 'Donation Confirmed',
      message: 'Your blood donation to John Smith has been confirmed. Thank you for saving a life!',
      timestamp: '2024-01-14T15:45:00Z',
      read: false
    },
    {
      id: '3',
      type: 'request',
      title: 'Request Update',
      message: 'Your blood request has been viewed by 5 potential donors.',
      timestamp: '2024-01-14T09:20:00Z',
      read: true
    },
    {
      id: '4',
      type: 'system',
      title: 'Profile Reminder',
      message: 'Please update your last donation date in your profile for better matching.',
      timestamp: '2024-01-13T14:15:00Z',
      read: true
    },
    {
      id: '5',
      type: 'donation',
      title: 'Eligible to Donate',
      message: 'You are now eligible to donate blood again. Help save lives today!',
      timestamp: '2024-01-12T08:00:00Z',
      read: true
    }
  ];

  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        // const response = await axios.get('http://localhost:3000/api/notifications');
        // setNotifications(response.data);
        
        // Using mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // @ts-ignore
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'emergency': return 'alert-circle';
      case 'donation': return 'heart';
      case 'request': return 'document-text';
      case 'system': return 'settings';
      default: return 'notifications';
    }
  };

  // @ts-ignore
  const getNotificationColor = (type) => {
    switch (type) {
      case 'emergency': return '#FF0000';
      case 'donation': return '#4CAF50';
      case 'request': return '#2196F3';
      case 'system': return '#FF9800';
      default: return '#666';
    }
  };

  // @ts-ignore
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  // @ts-ignore
  const handleNotificationPress = async (notification) => {
    if (!notification.read) {
      // Mark as read
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
      
      // Update on server
      // await axios.patch(`http://localhost:3000/api/notifications/${notification.id}/read`);
    }

    if (notification.actionUrl) {
      // Navigate to relevant screen
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // await axios.patch('http://localhost:3000/api/notifications/mark-all-read');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    // await axios.delete('http://localhost:3000/api/notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // @ts-ignore
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.unreadCard
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={24}
            color={getNotificationColor(item.type)}
          />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.titleRow}>
            <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
              {item.title}
            </Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{formatTimestamp(item.timestamp)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e53e3e" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      {notifications.length > 0 && (
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </Text>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                <Text style={styles.markAllText}>Mark all as read</Text>
              </TouchableOpacity>
            )}
          </View>
          {notifications.length > 0 && (
            <TouchableOpacity onPress={clearAllNotifications} style={styles.clearButton}>
              <Ionicons name="trash" size={16} color="#666" />
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up! New notifications will appear here.</Text>
          </View>
        }
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
  headerCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  markAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 14,
    color: '#e53e3e',
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  clearText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  notificationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#e53e3e',
    backgroundColor: '#fafafa',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e53e3e',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
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
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default Notifications;
