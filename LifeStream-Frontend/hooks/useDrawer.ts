import { useDrawer } from '../context/DrawerContext';

// Re-export the useDrawer hook for easy access
export { useDrawer } from '../context/DrawerContext';

// Additional utility functions for drawer management
export const useDrawerActions = () => {
  const { openDrawer, closeDrawer, toggleDrawer } = useDrawer();
  
  return {
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
};
