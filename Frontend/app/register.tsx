import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Keyboard,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Register: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const router = useRouter();

    const handleRegister = (): void => {
        // Array of fields with their corresponding error messages
        const fields = [
            { value: firstName, message: "Please enter your first name." },
            { value: lastName, message: "Please enter your last name." },
            { value: email, message: "Please enter your email address." },
            { value: email, message: "Please enter your password." },
            { value: age, message: "Please enter your age." },
        ];

        // Check for empty fields dynamically
        for (const field of fields) {
            if (!field.value) {
                Alert.alert('Error', field.message);
                return;
            }
        }

        // validate the length of passwords
        if (password.length < 6 || password.length > 16) {
            Alert.alert('Error', 'Password must be between 6 and 16 characters.');
            return;
        }

        // validate that passwords match
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        // register success/not success
        console.log('Registering user...', { firstName, lastName, email, age });
        Alert.alert('Success', 'Registration complete!');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground
                source={require('../assets/images/signupbg.png')}
                style={styles.background}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Create <Text style={styles.highlight}>Account</Text>
                    </Text>

                    <View style={styles.inputContainer}>
                        <FontAwesome name="user" size={20} color="#fff" style={styles.icon} />
                        <TextInput
                            placeholder="First Name"
                            placeholderTextColor="#bbb"
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesome name="user" size={20} color="#fff" style={styles.icon} />
                        <TextInput
                            placeholder="Last Name"
                            placeholderTextColor="#bbb"
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesome name="envelope" size={20} color="#fff" style={styles.icon} />
                        <TextInput
                            placeholder="Email Address"
                            placeholderTextColor="#bbb"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesome name="lock" size={20} color="#fff" style={styles.icon} />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#bbb"
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesome name="lock" size={20} color="#fff" style={styles.icon} />
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor="#bbb"
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesome name="birthday-cake" size={20} color="#fff" style={styles.icon} />
                        <TextInput
                            placeholder="Age"
                            placeholderTextColor="#bbb"
                            style={styles.input}
                            value={age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                        />
                    </View>

                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>

                    <Text style={styles.footerText}>
                        Already a member?{' '}
                        <Text
                            style={styles.loginLink}
                            onPress={() => router.back()}
                        >
                            Login
                        </Text>
                    </Text>
                </View>
            </ImageBackground>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    highlight: {
        color: '#FF0000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        width: '100%',
        maxWidth: 400,
        height: 50,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: '#FF0000',
        paddingVertical: 15,
        width: '100%',
        maxWidth: 400,
        borderRadius: 8,
        marginTop: 160,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        color: '#fff',
        marginTop: 20,
        fontSize: 14,
    },
    loginLink: {
        color: '#FF0000',
        fontWeight: 'bold',
    },
});

export default Register;