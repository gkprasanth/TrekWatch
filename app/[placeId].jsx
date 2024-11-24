import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
  Vibration,
} from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { travelData } from './data/sampleData';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as turf from '@turf/turf';

const PlaceDetails = () => {
  const { placeId } = useLocalSearchParams();
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insideGeofence, setInsideGeofence] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  const place = travelData
    .flatMap((category) => category.places)
    .find((item) => item.id === placeId);

  const geofenceCoordinates = [
    { latitude: place.coordinates.latitude + 0.001, longitude: place.coordinates.longitude - 0.001 },
    { latitude: place.coordinates.latitude + 0.001, longitude: place.coordinates.longitude + 0.001 },
    { latitude: place.coordinates.latitude - 0.001, longitude: place.coordinates.longitude + 0.001 },
    { latitude: place.coordinates.latitude - 0.001, longitude: place.coordinates.longitude - 0.001 },
    { latitude: place.coordinates.latitude + 0.001, longitude: place.coordinates.longitude - 0.001 },
  ];

  const isInsidePolygon = (point, polygon) => {
    const turfPoint = turf.point([point.longitude, point.latitude]);
    const turfPolygon = turf.polygon([polygon.map(({ latitude, longitude }) => [longitude, latitude])]);
    return turf.booleanPointInPolygon(turfPoint, turfPolygon);
  };

  useEffect(() => {
    (async () => {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();

      if (locationStatus !== 'granted') {
        Alert.alert('Permission required', 'Location access is needed for geofencing.');
        return;
      }
      if (notificationStatus !== 'granted') {
        Alert.alert('Permission required', 'Notification access is needed for geofencing.');
        return;
      }

      const checkLocation = async () => {
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });

        if (isInsidePolygon({ latitude, longitude }, geofenceCoordinates)) {
          if (!insideGeofence) {
            setInsideGeofence(true);
            setShowEmergencyAlert(true);
            Vibration.vibrate([0, 500, 200, 500]);
          }
        } else {
          setInsideGeofence(false);
        }
      };

      const intervalId = setInterval(checkLocation, 2000);

      return () => clearInterval(intervalId);
    })();
  }, [insideGeofence]);

  useEffect(() => {
    if (!place) return;

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

  const handleCallSOS = () => {
    const phoneNumber = 'tel:100';
    Linking.openURL(phoneNumber).catch(() => {
      Alert.alert('Error', 'Unable to make a call. Please try again.');
    });
  };

  if (!place) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Place not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: place.coordinates.latitude,
          longitude: place.coordinates.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker
          coordinate={{
            latitude: place.coordinates.latitude,
            longitude: place.coordinates.longitude,
          }}
          title={place.place}
        />
        <Polygon
          coordinates={geofenceCoordinates}
          fillColor="rgba(255, 0, 0, 0.3)"
          strokeColor="red"
        />
      </MapView>

      <View style={styles.card}>
        <Image source={{ uri: place.image }} style={styles.image} />
        <Text style={styles.title}>{place.place}</Text>
        <Text style={styles.description}>{place.description}</Text>

        {loading ? (
          <Text style={styles.info}>Loading weather data...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <View>
            <Text style={styles.info}>Temperature: {weatherData.main.temp}°C</Text>
            <Text style={styles.info}>Humidity: {weatherData.main.humidity}%</Text>
            <Text style={styles.info}>
              Condition: {weatherData.weather[0].description}
            </Text>
          </View>
        )}
      </View>

      {/* Emergency Alert Modal */}
      <Modal visible={showEmergencyAlert} transparent animationType="slide">
        <View style={styles.emergencyModal}>
          <Text style={styles.emergencyText}>EMERGENCY ALERT</Text>
          <Text style={styles.warningText}>
            You have entered a danger zone. Please return to safety.
          </Text>
          <TouchableOpacity style={styles.sosButton} onPress={handleCallSOS}>
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.returnToSafetyButton}  >
            <Text style={styles.returnToSafetyText}>Return to Safety</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  weatherButton: {
    marginTop: 16,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  weatherText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    padding: 20,
  },
  emergencyText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  warningText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  sosButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sosText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff0000',
    width:100,
    textAlign: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },

  emergencyText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
 
  returnToSafetyButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop:20
  },
  returnToSafetyText: {
    color: 'white',
    fontSize: 18,
  },
});

export default PlaceDetails;