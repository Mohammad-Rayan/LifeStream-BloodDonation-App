import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const About = () => {
  const appVersion = '1.0.0';
  const buildNumber = '001';

  const statisticsData = [
    { label: 'Lives Saved', value: '10,000+', icon: 'heart' as keyof typeof Ionicons.glyphMap },
    { label: 'Active Donors', value: '5,000+', icon: 'people' as keyof typeof Ionicons.glyphMap },
    { label: 'Hospitals Connected', value: '50+', icon: 'medical' as keyof typeof Ionicons.glyphMap },
    { label: 'Blood Units Donated', value: '25,000+', icon: 'water' as keyof typeof Ionicons.glyphMap }
  ];

  const teamMembers = [
    { name: 'Mohammad Rayan', role: 'Lead Developer', icon: 'person' as keyof typeof Ionicons.glyphMap },
    { name: 'Abdul Wahab', role: 'UX Designer', icon: 'person' as keyof typeof Ionicons.glyphMap }
  ];

  const technologies = [
    { name: 'React Native', description: 'Cross-platform mobile development', icon: 'logo-react' as keyof typeof Ionicons.glyphMap, color: '#61DAFB' },
    { name: 'Node.js', description: 'Backend server runtime', icon: 'logo-nodejs' as keyof typeof Ionicons.glyphMap, color: '#339933' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.logoContainer}>
          <Ionicons name="heart" size={48} color="#e53e3e" />
        </View>
          <Text style={styles.appName}>LifeStream</Text>
        <Text style={styles.appTagline}>Connecting donors, saving lives</Text>
        <Text style={styles.versionText}>Version {appVersion} (Build {buildNumber})</Text>
      </View>

      {/* Mission Statement */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="flag" size={20} color="#e53e3e" />
          <Text style={styles.sectionTitle}>Our Mission</Text>
        </View>
        <Text style={styles.missionText}>
          Our mission is to bridge the gap between blood donors and those in need, making it easier than ever to save lives through voluntary blood donation. We believe that every donation matters and every life is precious.
        </Text>
      </View>

      {/* Key Features */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="star" size={20} color="#e53e3e" />
          <Text style={styles.sectionTitle}>Key Features</Text>
        </View>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="search" size={16} color="#e53e3e" />
            <Text style={styles.featureText}>Find blood requests in your area</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="add-circle" size={16} color="#e53e3e" />
            <Text style={styles.featureText}>Create emergency blood requests</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="people" size={16} color="#e53e3e" />
            <Text style={styles.featureText}>Connect with verified donors</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="notifications" size={16} color="#e53e3e" />
            <Text style={styles.featureText}>Real-time emergency notifications</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={16} color="#e53e3e" />
            <Text style={styles.featureText}>Secure and privacy-focused</Text>
          </View>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bar-chart" size={20} color="#e53e3e" />
          <Text style={styles.sectionTitle}>Impact Statistics</Text>
        </View>
        <View style={styles.statisticsGrid}>
          {statisticsData.map((stat, index) => (
            <View key={index} style={styles.statisticItem}>
              <Ionicons name={stat.icon} size={24} color="#e53e3e" />
              <Text style={styles.statisticValue}>{stat.value}</Text>
              <Text style={styles.statisticLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Team */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="people" size={20} color="#e53e3e" />
          <Text style={styles.sectionTitle}>Our Team</Text>
        </View>
        <View style={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamMember}>
              <View style={styles.memberIconContainer}>
                <Ionicons name={member.icon} size={20} color="#e53e3e" />
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Built With Technologies */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="code-slash" size={20} color="#e53e3e" />
          <Text style={styles.sectionTitle}>Built With</Text>
        </View>
        <View style={styles.technologiesGrid}>
          {technologies.map((tech, index) => (
            <View key={index} style={styles.technologyItem}>
              <View style={[styles.technologyIconContainer, { backgroundColor: `${tech.color}15` }]}>
                <Ionicons name={tech.icon} size={32} color={tech.color} />
              </View>
              <Text style={styles.technologyName}>{tech.name}</Text>
              <Text style={styles.technologyDescription}>{tech.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="settings" size={20} color="#e53e3e" />
          <Text style={styles.sectionTitle}>Support & Feedback</Text>
        </View>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert(
          'Contact Support',
          'Choose how you would like to contact us:',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Email', onPress: () => Linking.openURL('mailto:support@blooddonationapp.com') },
            { text: 'Phone', onPress: () => Linking.openURL('tel:+1-800-BLOOD-1') }
          ]
        )}>
          <Ionicons name="headset" size={20} color="#e53e3e" />
          <Text style={styles.actionButtonText}>Contact Support</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Rate App', 'Thank you for using our app! This would open the app store for rating.')}>
          <Ionicons name="star" size={20} color="#e53e3e" />
          <Text style={styles.actionButtonText}>Rate This App</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Share App', 'Share this life-saving app with your friends and family!')}>
          <Ionicons name="share" size={20} color="#e53e3e" />
          <Text style={styles.actionButtonText}>Share App</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert(
          'Blood Donation Guidelines',
          'ELIGIBILITY CRITERIA:\n\n' +
          '✓ Age: 18-65 years old\n' +
          '✓ Weight: Minimum 50 kg (110 lbs)\n' +
          '✓ Good general health\n' +
          '✓ No recent illness or fever\n\n' +
          'BEFORE DONATION:\n\n' +
          '• Get adequate sleep (6-8 hours)\n' +
          '• Eat a healthy meal 3 hours before\n' +
          '• Drink plenty of water\n' +
          '• Avoid alcohol 24 hours prior\n' +
          '• Bring valid ID\n\n' +
          'AFTER DONATION:\n\n' +
          '• Rest for 10-15 minutes\n' +
          '• Drink fluids and eat snacks\n' +
          '• Avoid heavy lifting for 24 hours\n' +
          '• Keep bandage on for 4-6 hours\n\n' +
          'DONATION FREQUENCY:\n\n' +
          '• Whole blood: Every 8 weeks\n' +
          '• Platelets: Every 2 weeks\n' +
          '• Plasma: Every 4 weeks\n\n' +
          'Consult with medical staff for specific questions.',
          [{ text: 'Got it!', style: 'default' }]
        )}>
          <Ionicons name="document-text" size={20} color="#e53e3e" />
          <Text style={styles.actionButtonText}>Donation Guidelines</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Legal */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document" size={20} color="#e53e3e" />
          <Text style={styles.sectionTitle}>Legal</Text>
        </View>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL('https://blooddonationapp.com/privacy')}>
          <Ionicons name="shield-checkmark" size={20} color="#e53e3e" />
          <Text style={styles.actionButtonText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL('https://blooddonationapp.com/terms')}>
          <Ionicons name="document-text" size={20} color="#e53e3e" />
          <Text style={styles.actionButtonText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footerCard}>
        <Text style={styles.footerText}>
          Made with ❤️ for the global community
        </Text>
        <Text style={styles.copyrightText}>
          © 2025 LifeStream. All rights reserved.
        </Text>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  sectionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  missionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  statisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statisticItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  statisticValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e53e3e',
    marginTop: 8,
  },
  statisticLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamMember: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  memberIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  technologiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  technologyItem: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  technologyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  technologyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  technologyDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  footerCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 14,
    color: '#999',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default About;