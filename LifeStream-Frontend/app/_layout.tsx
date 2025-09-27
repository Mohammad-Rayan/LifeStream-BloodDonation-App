import { Ionicons } from '@expo/vector-icons';
import { Tabs, usePathname } from 'expo-router';
import React from 'react';
import { Linking, TouchableOpacity } from 'react-native';
import CustomDrawer from '../components/CustomDrawer';
import { DrawerProvider, useDrawer } from '../context/DrawerContext';
import { RequireAuth, UserProvider } from '../context/UserContext';

const DrawerToggleButton = () => {
  const { toggleDrawer } = useDrawer();
  return (
    <TouchableOpacity onPress={toggleDrawer} style={{ marginLeft: 15 }}>
      <Ionicons name="menu" size={24} color="#FFF" />
    </TouchableOpacity>
  );
};

const EmergencyButton = () => {
  const handleEmergencyCall = () => {
    Linking.openURL('tel:1122');
  };

  return (
    <TouchableOpacity
      onPress={handleEmergencyCall}
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        marginLeft: -30,
        width: 60,
        height: 60,
        backgroundColor: '#dc2626',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 3,
        borderColor: '#FFF',
      }}
    >
      <Ionicons name="call-outline" size={28} color="#FFF" />
    </TouchableOpacity>
  );
};

const LayoutContent = () => {
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const pathname = usePathname();
  const hideEmergencyButton = pathname === '/welcome' || pathname === '/auth';

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;
            if (route.name === 'index') iconName = 'home';
            else if (route.name === 'profile') iconName = 'person';
            else if (route.name === 'createRequest') iconName = 'add-circle';
            else if (route.name === 'viewRequests') iconName = 'list';
            else iconName = 'help-circle';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#e53e3e',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#FFF',
            borderTopWidth: 1,
            borderTopColor: '#eee',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
            justifyContent: 'space-around',
          },
          tabBarItemStyle: {
            marginHorizontal: 8
          },
          headerStyle: {
            backgroundColor: '#e53e3e',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerLeft: () => <DrawerToggleButton />,
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerTitle: 'LifeStream'
          }}
        />
        <Tabs.Screen
          name="createRequest"
          options={{
            title: 'Create',
            headerTitle: 'Create Request',
            tabBarItemStyle: {
              marginRight: 22
            }
          }}
        />
        <Tabs.Screen
          name="viewRequests"
          options={{
            title: 'Requests',
            headerTitle: 'View Requests',
            tabBarItemStyle: {
              marginLeft: 22,
            }
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerTitle: 'My Profile'
          }}
        />
        
        <Tabs.Screen name="auth" options={{
          href: null,
          title: 'Authentication',
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }} />
        <Tabs.Screen name="welcome" options={{
          href: null,
          title: 'Welcome',
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }} />
        <Tabs.Screen name="login" options={{ href: null, title: 'Login', headerLeft: () => <DrawerToggleButton /> }} />
        <Tabs.Screen name="register" options={{ href: null, title: 'Register', headerLeft: () => <DrawerToggleButton /> }} />
        <Tabs.Screen name="editProfile" options={{ href: null, title: 'Edit Profile', headerLeft: () => <DrawerToggleButton /> }} />
        <Tabs.Screen name="fulfillRequest" options={{ href: null, title: 'Fulfill Request', headerLeft: () => <DrawerToggleButton /> }} />
        <Tabs.Screen name="requestHistory" options={{ href: null, title: 'Request History', headerLeft: () => <DrawerToggleButton /> }} />
        <Tabs.Screen name="donationHistory" options={{ href: null, title: 'Donation History', headerLeft: () => <DrawerToggleButton /> }} />
        <Tabs.Screen name="searchDonors" options={{ href: null, title: 'Search Donors', headerLeft: () => <DrawerToggleButton /> }} />
        <Tabs.Screen name="notifications" options={{ href: null, title: 'Notifications', headerLeft: () => <DrawerToggleButton /> }} />
        <Tabs.Screen name="about" options={{ href: null, title: 'About', headerLeft: () => <DrawerToggleButton /> }} />
        <Tabs.Screen name="logout" options={{ href: null, title: 'Logout', headerLeft: () => <DrawerToggleButton /> }} />
      </Tabs>
      {!hideEmergencyButton && <EmergencyButton />}
      <CustomDrawer isVisible={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
};

const Layout = () => {
  const pathname = usePathname();
  const publicRoutes = ['/', '/login', '/register', '/welcome', '/auth', '/about', '/searchDonors', '/notifications'];
  const isPublic = publicRoutes.includes(pathname);
  return (
    <UserProvider>
      <DrawerProvider>
        {isPublic ? (
          <LayoutContent />
        ) : (
          <RequireAuth>
            <LayoutContent />
          </RequireAuth>
        )}
      </DrawerProvider>
    </UserProvider>
  );
}

export default Layout;