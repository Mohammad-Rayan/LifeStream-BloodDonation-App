import AsyncStorage from '@react-native-async-storage/async-storage';

export const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem('hasCompletedOnboarding');
    console.log('Onboarding status reset successfully');
  } catch (error) {
    console.log('Error resetting onboarding:', error);
  }
};

export const checkOnboardingStatus = async () => {
  try {
    const status = await AsyncStorage.getItem('hasCompletedOnboarding');
    return status === 'true';
  } catch (error) {
    console.log('Error checking onboarding status:', error);
    return false;
  }
};

export const completeOnboarding = async () => {
  try {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    console.log('Onboarding marked as completed');
  } catch (error) {
    console.log('Error completing onboarding:', error);
  }
};
