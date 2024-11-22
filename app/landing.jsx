import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import BgSvg from '@/assets/images/bg.svg'; // Import the SVG component

const Landing = () => {
    const router = useRouter();

    const handleStart = () => {
        router.push('/home'); // Navigate to the Home page
    };

    return (
        <ImageBackground
            source={{ uri: 'https://static.vecteezy.com/system/resources/previews/030/318/046/non_2x/natures-marvel-active-tourist-on-rocks-admiring-lush-mountains-epitomizes-trekking-adventure-vertical-mobile-wallpaper-ai-generated-free-photo.jpg' }}
            style={styles.background}
        >
            <View style={styles.container}>
 
                <View style={styles.overlay}>
                    <Text style={styles.title}>Welcome to TrekWatch</Text>
                    <Text style={styles.subtitle}>
                        Explore breathtaking destinations and unforgettable experiences.
                    </Text>

                    {/* Let's Start Button */}
                    <TouchableOpacity style={styles.button} onPress={handleStart}>
                        <Text style={styles.buttonText}>Let's Start</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a dark overlay to the background image
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: '#ddd',
        textAlign: 'center',
        marginBottom: 50,
    },
    button: {
        backgroundColor: 'green',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 32,
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Landing;
