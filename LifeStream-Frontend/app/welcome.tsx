import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  background: string;
}

const onboardingData: OnboardingData[] = [
  {
    id: 1,
    title: '🩸 Save Lives',
    subtitle: 'Be a Hero Today',
    description: 'Every drop counts! Your blood donation can save up to 3 lives. Join thousands of heroes making a difference in your community every single day.',
    icon: 'heart',
    color: '#FF4757',
    background: '#FFE8EA'
  },
  {
    id: 2,
    title: '🔍 Find Donors',
    subtitle: 'Instant Connections',
    description: 'Need blood urgently? Our smart matching system connects you with verified donors nearby in seconds. Available 24/7 for emergencies.',
    icon: 'people',
    color: '#3742FA',
    background: '#E8EAFF'
  },
  {
    id: 3,
    title: '🏆 Track Impact',
    subtitle: 'Your Legacy Lives',
    description: 'See your donation history, lives saved, and earn badges. Be part of a community that celebrates every life-saving contribution.',
    icon: 'trophy',
    color: '#2ED573',
    background: '#E8FFE8'
  }
];

const Welcome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Animate content when slide changes
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true
      });
    } else {
      await handleGetStarted();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true
      });
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      router.replace('/auth');
    } catch (error) {
      console.log('Error saving onboarding status:', error);
      router.replace('/auth');
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      router.replace('/auth');
    } catch (error) {
      console.log('Error saving onboarding status:', error);
      router.replace('/auth');
    }
  };

  const renderOnboardingScreen = (item: OnboardingData, index: number) => (
    <View key={item.id} style={[styles.onboardingScreen, { backgroundColor: item.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={item.background} />
      
      {/* Decorative circles */}
      <View style={[styles.circle1, { backgroundColor: item.color, opacity: 0.1 }]} />
      <View style={[styles.circle2, { backgroundColor: item.color, opacity: 0.05 }]} />
      
      <Animated.View style={[
        styles.screenContent,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })
          }]
        }
      ]}>
        {/* Large Emoji/Icon Section */}
        <View style={styles.heroSection}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon} size={60} color="#fff" />
          </View>
          
          {/* Floating hearts animation for first screen */}
          {index === 0 && (
            <>
              <View style={[styles.floatingHeart, styles.heart1]}>
                <Ionicons name="heart" size={16} color={item.color} />
              </View>
              <View style={[styles.floatingHeart, styles.heart2]}>
                <Ionicons name="heart" size={12} color={item.color} />
              </View>
              <View style={[styles.floatingHeart, styles.heart3]}>
                <Ionicons name="heart" size={14} color={item.color} />
              </View>
            </>
          )}
          
          {/* Search dots for second screen */}
          {index === 1 && (
            <>
              <View style={[styles.searchDot, styles.dot1, { backgroundColor: item.color }]} />
              <View style={[styles.searchDot, styles.dot2, { backgroundColor: item.color }]} />
              <View style={[styles.searchDot, styles.dot3, { backgroundColor: item.color }]} />
            </>
          )}
          
          {/* Trophy sparkles for third screen */}
          {index === 2 && (
            <>
              <View style={[styles.sparkle, styles.sparkle1]}>
                <Ionicons name="star" size={16} color="#FFD700" />
              </View>
              <View style={[styles.sparkle, styles.sparkle2]}>
                <Ionicons name="star" size={12} color="#FFD700" />
              </View>
              <View style={[styles.sparkle, styles.sparkle3]}>
                <Ionicons name="star" size={14} color="#FFD700" />
              </View>
            </>
          )}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        {/* Feature highlights */}
        <View style={styles.highlightSection}>
          {index === 0 && (
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: item.color }]}>3+</Text>
                <Text style={styles.statLabel}>Lives Saved</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: item.color }]}>24/7</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: item.color }]}>10K+</Text>
                <Text style={styles.statLabel}>Heroes</Text>
              </View>
            </View>
          )}
          
          {index === 1 && (
            <View style={styles.featuresList}>
              <View style={[styles.featureItem, { borderColor: item.color }]}>
                <Ionicons name="flash" size={20} color={item.color} />
                <Text style={styles.featureText}>Instant Matching</Text>
              </View>
              <View style={[styles.featureItem, { borderColor: item.color }]}>
                <Ionicons name="shield-checkmark" size={20} color={item.color} />
                <Text style={styles.featureText}>Verified Donors</Text>
              </View>
            </View>
          )}
          
          {index === 2 && (
            <View style={styles.achievementGrid}>
              <View style={styles.achievementItem}>
                <Ionicons name="ribbon" size={24} color="#FFD700" />
                <Text style={styles.achievementText}>Badges</Text>
              </View>
              <View style={styles.achievementItem}>
                <Ionicons name="trending-up" size={24} color={item.color} />
                <Text style={styles.achievementText}>Progress</Text>
              </View>
              <View style={styles.achievementItem}>
                <Ionicons name="people" size={24} color="#FF6B6B" />
                <Text style={styles.achievementText}>Community</Text>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>LifeStream</Text>
        </View>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => renderOnboardingScreen(item, index))}
      </ScrollView>

      {/* Modern Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${((currentIndex + 1) / onboardingData.length) * 100}%`,
                  backgroundColor: onboardingData[currentIndex].color
                }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} of {onboardingData.length}
          </Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          {currentIndex > 0 && (
            <TouchableOpacity onPress={handlePrev} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#666" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            onPress={handleNext} 
            style={[styles.nextButton, { backgroundColor: onboardingData[currentIndex].color }]}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
            <Ionicons 
              name={currentIndex === onboardingData.length - 1 ? 'rocket' : 'chevron-forward'} 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    minHeight: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4757',
    marginLeft: 8,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
    alignSelf: 'center',
  },
  skipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  onboardingScreen: {
    width,
    flex: 1,
    position: 'relative',
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -50,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: -30,
    left: -30,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingHeart: {
    position: 'absolute',
  },
  heart1: {
    top: 20,
    right: 40,
  },
  heart2: {
    bottom: 30,
    left: 50,
  },
  heart3: {
    top: 60,
    left: 20,
  },
  searchDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dot1: {
    top: 30,
    right: 30,
  },
  dot2: {
    bottom: 40,
    left: 40,
  },
  dot3: {
    top: 70,
    left: 30,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: 10,
    right: 50,
  },
  sparkle2: {
    bottom: 20,
    left: 60,
  },
  sparkle3: {
    top: 50,
    left: 10,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  highlightSection: {
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresList: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 8,
    marginVertical: 4,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  achievementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  achievementItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    color: '#333',
    textAlign: 'center',
  },
  bottomNav: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    width: 120,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    marginRight: 8,
  },
});

export default Welcome;
