import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Switch, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // For selecting images
import useGlobalStyle from '../hooks/GlobalStyleContext';
import { useRouter } from 'expo-router';
import useUser from '../hooks/UserContext';
import AuthPost from '../../Fetchers/Auth/AuthPost';
import { host } from '../index';

export default function Settings() {
    const globalStyle = useGlobalStyle();
    const router = useRouter();
    const { user, token, setToken, setUser } = useUser();

    const [dropdowns, setDropdowns] = useState({
        notification: false,
        privacy: false,
        about: false,
        terms: false,
    });

    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const [profileImage, setProfileImage] = useState(user?.profilePicture || null);

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>User not found. Please log in.</Text>
            </View>
        );
    }

    const toggleDropdown = (section: keyof typeof dropdowns) => {
        setDropdowns((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const toggleNotifications = () => {
        setIsNotificationsEnabled((prev) => !prev);
        Alert.alert('Notification Settings', isNotificationsEnabled ? 'Notifications Disabled' : 'Notifications Enabled');
    };

    const handleSignOut = () => {
        AuthPost(
            `${host}/users/signout`,
            {},
            (error) => Alert.alert(error),
            token
        );
        setUser(null);
        setToken('');
        router.replace('/');
    };

    const pickImage = async () => {
        // Request media library permissions
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'We need permission to access your gallery to update the profile picture.');
                return;
            }
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setProfileImage(result.uri); // Update local state to show the selected image
            uploadProfilePicture(result.uri); // Upload the selected image
        }
    };

    const uploadProfilePicture = async (imageUri: string) => {
        const formData = new FormData();
        const fileName = imageUri.split('/').pop() || 'profile_picture.jpg';

        formData.append('profilePicture', {
            uri: imageUri,
            name: fileName,
            type: 'image/jpeg',
        } as any);

        try {
            const response = await fetch(`${host}/users/update-profile-picture`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Profile picture updated successfully!');
                setUser({ ...user, profilePicture: data.imageUrl }); // Update user context
            } else {
                Alert.alert('Error', data.error || 'Failed to update profile picture.');
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: globalStyle.colors.bgColor }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={profileImage ? { uri: profileImage } : require('../../assets/images/profile.png')}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <Text style={[styles.userName, { fontFamily: globalStyle.fontStyle.textFont }]}>
                    {user?.fname} {user?.lname}
                </Text>
                <TouchableOpacity style={styles.editIcon} onPress={() => pickImage()}>
                    <FontAwesome name="edit" size={18} color={globalStyle.colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/AccountSettingPage')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>Account</Text>
                    <FontAwesome name="chevron-right" size={18} color={globalStyle.colors.secondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => toggleDropdown('notification')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>Notification</Text>
                    <FontAwesome
                        name={dropdowns.notification ? 'chevron-down' : 'chevron-right'}
                        size={18}
                        color={globalStyle.colors.secondary}
                    />
                </TouchableOpacity>
                {dropdowns.notification && (
                    <View style={styles.dropdownContainer}>
                        <Text style={[styles.dropdownText, { fontFamily: globalStyle.fontStyle.textFont }]}>
                            Allow Notifications
                        </Text>
                        <Switch
                            value={isNotificationsEnabled}
                            onValueChange={toggleNotifications}
                            trackColor={{ false: '#767577', true: globalStyle.colors.primary }}
                            thumbColor={isNotificationsEnabled ? globalStyle.colors.secondary : '#f4f3f4'}
                        />
                    </View>
                )}

                {/* Additional sections like Privacy, About, Terms & Conditions */}

                <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
                    <Text
                        style={[
                            styles.menuText,
                            { fontFamily: globalStyle.fontStyle.textFont, color: globalStyle.colors.primary },
                        ]}
                    >
                        Sign out
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 120,
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    userName: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    editIcon: {
        position: 'absolute',
        top: 70,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 5,
    },
    menu: {
        marginTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    menuText: {
        fontSize: 18,
        color: '#fff',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    dropdownText: {
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
        marginLeft: 15,
        marginBottom: 15,
    },
});
