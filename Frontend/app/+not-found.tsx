import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import useUser from './hooks/UserContext';

export default function NotFound() {
    const router = useRouter();
    const { user } = useUser();
    const buttonText = user ? "Go to Home" : "Go to Login";

    const handleNavigation = () => {
        if (user) {
            // Navigate to /home if the user exists
            router.replace('/(tabs)/Home');
        } else {
            // Navigate to the root route (login page) if no user
            router.replace('/');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>404</Text>
            <Text style={styles.message}>Oops! The page you’re looking for doesn’t exist.</Text>
            <TouchableOpacity style={styles.button} onPress={handleNavigation}>
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a', // Black background
        padding: 20,
    },
    title: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#F50707', // Bright red for the title
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        color: '#ffffff', // White for the message text
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#F50707', // Bright red for the button
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        shadowColor: '#ffffff', // Subtle white shadow for emphasis
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: '#ffffff', // White text on the button
        fontSize: 16,
        fontWeight: 'bold',
    },
});