import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { travelData } from './data/sampleData'; // Import your local travel data file

const WeatherPage = () => {
  const { placeId } = useLocalSearchParams(); // Retrieve the dynamic `placeId` parameter from the URL
  const [weatherData, setWeatherData] = useState(null); // State for weather data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error message

  // Find the place in travelData using the provided placeId
  const place = travelData
    .flatMap((category) => category.places)
    .find((item) => item.id === placeId);

  useEffect(() => {
    if (!place) {
      setError('Place not found.');
      setLoading(false);
      return;
    }

    const fetchWeatherData = async () => {
      try {
        const { latitude, longitude } = place.coordinates;
        const API_KEY = '12ba17997c75f69e3eccfa29e11eb56d'; // Replace with your weather API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch weather data.');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [place]);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.info}>Loading weather data...</Text>
      </View>
    );
  }

  // Show error message if an error occurs
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Display the weather data
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{place.name} Weather</Text>
      <Text style={styles.info}>Temperature: {weatherData.main.temp}°C</Text>
      <Text style={styles.info}>Humidity: {weatherData.main.humidity}%</Text>
      <Text style={styles.info}>
        Condition: {weatherData.weather[0].description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WeatherPage;
