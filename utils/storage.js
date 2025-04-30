import { AsyncStorage } from 'react-native';

// Utility functions for working with AsyncStorage

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error('Error storing data:', e);
    return false;
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error retrieving data:', e);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing data:', e);
    return false;
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (e) {
    console.error('Error clearing data:', e);
    return false;
  }
};

export const mergeData = async (key, value) => {
  try {
    const existingData = await getData(key);
    if (!existingData) {
      return storeData(key, value);
    }
    
    const mergedData = Array.isArray(existingData) 
      ? [...existingData, ...value]
      : { ...existingData, ...value };
      
    return storeData(key, mergedData);
  } catch (e) {
    console.error('Error merging data:', e);
    return false;
  }
};
