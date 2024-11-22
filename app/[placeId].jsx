import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Vibration, // Import Vibration
} from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { travelData } from './data/sampleData';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as turf from '@turf/turf';

const PlaceDetails = () => {
  const { placeId } = useLocalSearchParams();
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [insideGeofence, setInsideGeofence] = useState(false); // Track if inside geofence

  // Find the place details based on placeId
  const place = travelData
    .flatMap((category) => category.places)
    .find((item) => item.id === placeId);

  // Define polygon coordinates for the geofence
  const geofenceCoordinates = [
    { latitude: place.coordinates.latitude + 0.001, longitude: place.coordinates.longitude - 0.001 },
    { latitude: place.coordinates.latitude + 0.001, longitude: place.coordinates.longitude + 0.001 },
    { latitude: place.coordinates.latitude - 0.001, longitude: place.coordinates.longitude + 0.001 },
    { latitude: place.coordinates.latitude - 0.001, longitude: place.coordinates.longitude - 0.001 },
    { latitude: place.coordinates.latitude + 0.001, longitude: place.coordinates.longitude - 0.001 }, // Closing the polygon
  ];

  // Check if user is inside the polygon
  const isInsidePolygon = (point, polygon) => {
    const turfPoint = turf.point([point.longitude, point.latitude]);
    const turfPolygon = turf.polygon([polygon.map(({ latitude, longitude }) => [longitude, latitude])]);
    return turf.booleanPointInPolygon(turfPoint, turfPolygon);
  };

  // Request permissions for location and notifications
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

      // Function to check user location
      const checkLocation = async () => {
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });

        // Check if the user is inside the geofence
        if (isInsidePolygon({ latitude, longitude }, geofenceCoordinates)) {
          if (!insideGeofence) {
            setInsideGeofence(true); // Mark as inside geofence

            // Show the alert
            Alert.alert(
              'Geofence Alert!',
              `You entered the geofence around ${place.place}. Welcome!`,
              [{ text: 'OK' }]
            );

            // Schedule a notification
            Notifications.scheduleNotificationAsync({
              content: {
                title: 'You entered the geofence!',
                body: `Welcome to ${place.place}!`,
              },
              trigger: null,
            });

            // Trigger vibration
            Vibration.vibrate([0, 500, 200, 500]); // Vibration pattern: [pause, vibrate, pause, vibrate]
          }
        } else {
          setInsideGeofence(false); // Mark as outside geofence
        }
      };

      // Start checking the location every 2 seconds
      const intervalId = setInterval(checkLocation, 2000);

      return () => clearInterval(intervalId); // Cleanup on unmount
    })();
  }, [insideGeofence]); // Depend on insideGeofence to prevent repeated alerts

  if (!place) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Place not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map as background */}
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
          fillColor="rgba(0, 150, 0, 0.3)"
          strokeColor="green"
        />
      </MapView>

      <View style={styles.card}>
        <Image source={{ uri: place.image }} style={styles.image} />
        <Text style={styles.title}>{place.place}</Text>
        <Text style={styles.description}>{place.description}</Text>

        {/* Weather redirection */}
        <TouchableOpacity
          style={styles.weatherButton}
          onPress={() => router.push(`/weather/${placeId}`)}
        >
          <Text style={styles.weatherText}>Check Weather Conditions</Text>
        </TouchableOpacity>
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default PlaceDetails;
