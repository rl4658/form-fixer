import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
} from 'react-native';
import useGlobalStyle from '../hooks/GlobalStyleContext';
import useUser from '../hooks/UserContext';
import AuthPut from '../../Fetchers/Auth/AuthPut';
import Post from '../../Fetchers/NoAuth/Post';
import { host } from '../index';

const AccountSettingPage = () => {
    const globalStyle = useGlobalStyle();
    const { user, setUser, token } = useUser();

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Unable to load user data.</Text>
            </View>
        );
    }

    const [editing, setEditing] = useState(false);
    const [firstName, setFirstName] = useState(user.fname);
    const [lastName, setLastName] = useState(user.lname);
    const [age, setAge] = useState(user.age.toString());

    // Forgot password modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalEmail, setModalEmail] = useState(user.email); // Prefill with user's email

    const handleSave = () => {
        if (!firstName || !lastName || !age) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        AuthPut(
            `${host}/users/update`,
            { fname: firstName, lname: lastName, age: parseInt(age) },
            () => Alert.alert('Error', 'Failed to update profile. Please try again.'),
            token,
            () => {
                Alert.alert('Success', 'Profile updated successfully.');
                setUser((prevUser) => {
                    if (!prevUser) return null;
                    return {
                        ...prevUser,
                        fname: firstName,
                        lname: lastName,
                        age: parseInt(age),
                    };
                });
                setEditing(false);
            }
        );
    };

    const handleForgotPassword = () => {
        const trimmedEmail = modalEmail.trim();

        // Basic validation
        if (!trimmedEmail) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        Post(
            `${host}/users/forgot-password`,
            { email: trimmedEmail },
            (error) => Alert.alert('Error', error || 'An unexpected error occurred.'),
            () => {
                Alert.alert(
                    'Success',
                    'A password reset link has been sent to your email address.'
                );
                setIsModalVisible(false); // Close the modal on success
            }
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: globalStyle.colors.bgColor }]}>
            <Text style={[styles.title, { fontFamily: globalStyle.fontStyle.titleFont }]}>
                Account Settings
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    value={firstName}
                    editable={editing}
                    onChangeText={setFirstName}
                    style={[styles.input, editing ? styles.editable : styles.readOnly]}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    value={lastName}
                    editable={editing}
                    onChangeText={setLastName}
                    style={[styles.input, editing ? styles.editable : styles.readOnly]}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                    value={age}
                    editable={editing}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    style={[styles.input, editing ? styles.editable : styles.readOnly]}
                />
            </View>

            <View style={styles.buttonContainer}>
                {editing ? (
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Forgot Password Button */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: globalStyle.colors.secondary }]}
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.buttonText}>Forgot Password</Text>
            </TouchableOpacity>

            {/* Forgot Password Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Forgot Password</Text>
                        <TextInput
                            placeholder="Enter your email"
                            placeholderTextColor="gray"
                            value={modalEmail}
                            onChangeText={setModalEmail}
                            style={styles.modalInput}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: globalStyle.colors.primary }]}
                                onPress={handleForgotPassword}
                            >
                                <Text style={styles.modalButtonText}>Send Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, color: '#fff', marginTop: 80, marginBottom: 20, textAlign: 'center' },
    inputContainer: { marginBottom: 15 },
    label: { fontSize: 16, color: '#fff', marginBottom: 5 },
    input: { padding: 10, borderRadius: 5, backgroundColor: '#333', color: '#fff' },
    readOnly: { backgroundColor: '#444' },
    editable: { backgroundColor: '#555' },
    buttonContainer: { marginTop: 20 },
    button: { backgroundColor: '#FF0000', padding: 15, borderRadius: 5, marginBottom: 10 },
    buttonText: { color: '#000', fontSize: 16, textAlign: 'center' },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    modalInput: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'gray',
        padding: 8,
        marginBottom: 20,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
    },
    modalButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});

export default AccountSettingPage;