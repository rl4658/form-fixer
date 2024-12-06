import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Post from '../Fetchers/NoAuth/Post';
import { host } from './index';
import { useRouter } from 'expo-router';

const ForgetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter()

    const handleResetPassword = () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Both fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        Post(host + "/users/updatePassword",
            { password: newPassword },
            (error) => { Alert.alert(error) },
            () => { router.replace("/") }
        )

        // Proceed with password reset logic (e.g., API call)
        Alert.alert('Success', 'Password reset successfully!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <TextInput
                placeholder="Enter New Password"
                placeholderTextColor="gray"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
            />
            <TextInput
                placeholder="Confirm New Password"
                placeholderTextColor="gray"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
            />
            <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
                <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF0000',
        marginBottom: 30,
    },
    input: {
        width: '90%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#FFF',
        marginBottom: 20,
        fontSize: 16,
        color: '#FFF',
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#FF0000',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ForgetPassword;