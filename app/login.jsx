import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Dummy user data (email and password)
    const dummyUser = {
        email: 'user@example.com',
        password: 'password123',
    };

    // Navigation hook
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }

        // Check if entered credentials match the dummy user data
        if (email === dummyUser.email && password === dummyUser.password) {
            Alert.alert('Success', 'You are logged in!');
            // Navigate to Home screen after successful login
            navigation.navigate('Home'); // Replace 'Home' with the actual screen name
        } else {
            Alert.alert('Login Failed', 'Invalid email or password.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAF6F6', // Background color
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333', // Darker text color
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
        color: '#333', // Input text color
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#00CEC9', // Button background color
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    loginButtonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default Login;
