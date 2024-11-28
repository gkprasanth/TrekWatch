import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';

const Landing = () => {
    const router = useRouter();

    const handleStart = () => {
        router.push('/login'); // Navigate to the Home page
    };

    return (
        <ImageBackground
            source={{
                uri: 'https://s3-alpha-sig.figma.com/img/0f73/0d19/659bb8747b48cc972d6bd9f1054652b7?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Vn6QqKg9M7tzXOYcb6k3g1h28~2hCYsKNFUwRwhfWegNtNms2CTEfF2T~gHcUEL8dsrsAfcyq6gEix52PU~lM95QB4vsnksujzA42ayQKObuJCYJ0IYNKsZny4p0W--gm69nyn9fVfy7U1i5RtNYZRAoxMrcYX~xJE~dCIpvk~STgjyaeRidlhR4pzAHJBISIYAwRt3tigaTXUsyNngAWT5gmG1Myarz-uE8~T7x~eWbFPukBUcDhOzx3neiXNYIuho84fsJCP1DM9ggUDJt~FByGOdg0HNnpSl37E-b-zS~HsCJ~rA8AGq9qZrcdv81sGLLcSqA8bOEB2MxWvQUeA__',
            }}
            style={styles.background}
        >
            <View style={styles.container}>
                {/* Logo and Tagline */}
                <View style={styles.header}>
                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                    <Text style={styles.appName}>TREKWATCH</Text>
                    <Text style={styles.tagline}>Explore || Protect || Rescue</Text>
                </View>

                {/* Let's Start Button */}
                <TouchableOpacity style={styles.button} onPress={handleStart}>
                    <Text style={styles.buttonText}>Let's Start</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    background: {
        flex: 1,
        resizeMode: 'cover', // Ensures the background image covers the screen
    },
    header: {
        alignItems: 'center',
        marginTop: 60, // Positions the logo and text at the top
    },
    logo: {
        width: 300, // Increased logo size
        height: 150, // Increased logo size
        
    },
    appName: {
        fontSize: 32, // Large and bold for better visibility
        fontWeight: 'bold',
        color: '#000', // Black text
        textAlign: 'center',
        marginBottom: 5,
    },
    tagline: {
        fontSize: 18, // Smaller tagline
        color: '#000', // Black text
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#00CEC9', // Green button
        borderRadius: 25, // Rounded button
        paddingVertical: 15,
        paddingHorizontal: 70, // Wide button
        elevation: 5, // Add shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        position: 'absolute',
        bottom: 60, // Button stays closer to the bottom
    },
    buttonText: {
        fontSize: 20, // Larger button text
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Landing;
