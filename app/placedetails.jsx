import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import * as turf from '@turf/turf'; // For geospatial calculations

const PlaceDetails = ({ route }) => {
    const { place } = route.params; // Retrieve data passed via route
    const [currentLocation, setCurrentLocation] = useState(null);

    // Geofence Polygon Coordinates (replace with actual coordinates)
    const geofencePolygon = turf.polygon([
        [
            [-122.0838, 37.422], // Point 1
            [-122.0838, 37.423], // Point 2
            [-122.082, 37.423], // Point 3
            [-122.082, 37.422], // Point 4
            [-122.0838, 37.422], // Closing the loop
        ],
    ]);

    // Monitor location
    useEffect(() => {
        const watchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const userLocation = turf.point([longitude, latitude]);

                setCurrentLocation({ latitude, longitude });

                // Check if the user is inside the geofence
                if (turf.booleanPointInPolygon(userLocation, geofencePolygon)) {
                    Alert.alert('Geofence Alert', 'You have entered the geofenced area!');
                }
            },
            (error) => {
                console.error(error);
            },
            { enableHighAccuracy: true, distanceFilter: 10 }
        );

        // Clean up watch on unmount
        return () => Geolocation.clearWatch(watchId);
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: place.image }} style={styles.image} />
            <Text style={styles.title}>{place.place}</Text>
            <Text style={styles.description}>{place.description}</Text>

            {currentLocation && (
                <View style={styles.locationContainer}>
                    <Text style={styles.locationText}>
                        Current Location: {currentLocation.latitude}, {currentLocation.longitude}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    locationContainer: {
        marginTop: 20,
    },
    locationText: {
        fontSize: 14,
        color: '#555',
    },
});

export default PlaceDetails;
