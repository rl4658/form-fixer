import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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
        // Reset user and token on logout
        setUser(null);
        setToken('');
        router.replace('/');
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: globalStyle.colors.bgColor }]}>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/profile.png')} // Replace with actual profile image
                    style={styles.profileImage}
                />
                <Text style={[styles.userName, { fontFamily: globalStyle.fontStyle.textFont }]}>
                    {user?.fname} {user?.lname}
                </Text>
                <TouchableOpacity style={styles.editIcon} onPress={() => router.push('/AccountSettingPage')}>
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

                {/* Notification Section */}
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

                {/* Privacy Section */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => toggleDropdown('privacy')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>Privacy & Security</Text>
                    <FontAwesome
                        name={dropdowns.privacy ? 'chevron-down' : 'chevron-right'}
                        size={18}
                        color={globalStyle.colors.secondary}
                    />
                </TouchableOpacity>
                {dropdowns.privacy && (
                    <Text style={styles.dropdownText}>
                        At FormFixer.AI, we prioritize your privacy and the security of your personal information. Our fitness app collects only the data necessary to deliver personalized recommendations and improve your experience. This includes information you provide, such as your name, email, and fitness activity, as well as optional data like your exercise preferences or health statistics.

                        All data is stored securely using industry-standard encryption protocols to prevent unauthorized access. We never share your information with third parties without your explicit consent, except as required by law or to provide core app functionalities.

                        Your account is protected by secure authentication measures, and we recommend using a strong password to enhance security. If you suspect unauthorized access to your account, contact us immediately.

                        Our app may use anonymized data for insights and improvements, ensuring it cannot be linked back to individual users. You can access, update, or delete your information at any time through the app's settings.

                        We are committed to maintaining transparency about how we use your data. If we make significant changes to our privacy policy, you will be notified promptly.

                        For more details, please review our complete Privacy Policy within the app or contact our support team with any questions. Your trust is important to us, and we are dedicated to keeping your information safe.
                    </Text>
                )}

                {/* About Section */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => toggleDropdown('about')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>About</Text>
                    <FontAwesome
                        name={dropdowns.about ? 'chevron-down' : 'chevron-right'}
                        size={18}
                        color={globalStyle.colors.secondary}
                    />
                </TouchableOpacity>
                {dropdowns.about && (
                    <Text style={styles.dropdownText}>
                        FormFixer.AI is an innovative fitness app designed to empower beginners by ensuring proper exercise form through real-time video analysis. Whether you’re performing squats, bench presses, deadlifts, or bicep curls, our app uses cutting-edge computer vision and artificial intelligence to detect movement patterns and provide instant corrective feedback.

                        Our mission is to make fitness safer and more accessible by bridging the gap between expensive personal training and static online tutorials. Leveraging advanced technologies like OpenPose for joint tracking and deep learning models such as ResNet-101 or Vision Transformers, FormFixer.AI delivers precise posture analysis tailored to individual users.

                        FormFixer.AI is designed with simplicity and privacy in mind. Its user-friendly interface guides beginners step-by-step, building confidence and improving technique without the need for costly in-person coaching. All video data is processed securely, ensuring compliance with privacy regulations like GDPR.

                        Ideal for anyone starting their fitness journey, FormFixer.AI focuses on foundational exercises prone to form-related errors, helping users avoid injuries and maximize workout results. Available as a web or Android app, it adapts to various device capabilities while maintaining high accuracy.

                        At FormFixer.AI, we believe everyone deserves access to safe, effective fitness tools. By combining real-time feedback with accessible technology, we’re transforming the way people approach exercise, making proper form achievable for all.
                    </Text>
                )}

                {/* Terms & Conditions Section */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => toggleDropdown('terms')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>Terms & Conditions</Text>
                    <FontAwesome
                        name={dropdowns.terms ? 'chevron-down' : 'chevron-right'}
                        size={18}
                        color={globalStyle.colors.secondary}
                    />
                </TouchableOpacity>
                {dropdowns.terms && (
                    <Text style={styles.dropdownText}>
                        Welcome to FormFixer.AI. By using our app, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before accessing or using our services.

                        1. Acceptance of Terms
                        By downloading, accessing, or using FormFixer.AI, you acknowledge that you have read, understood, and agree to these Terms and Conditions. If you do not agree, you must not use the app.

                        2. Use of the App
                        FormFixer.AI provides real-time feedback on exercise form based on video input. The app is intended for informational purposes only and is not a substitute for professional medical or fitness advice. Use the app at your own risk.

                        3. User Obligations
                        You must be at least 10 years old or have parental/guardian consent to use the app.
                        You agree to provide accurate information and refrain from using the app for any unlawful activities.You are responsible for ensuring a safe exercise environment while using the app.

                        4. Privacy and Data Protection
                        FormFixer.AI respects your privacy. Video data is processed in real-time and not stored unless explicitly required for troubleshooting. Refer to our Privacy Policy for detailed information on data handling and compliance with regulations like GDPR.

                        5. Limitations of Liability
                        FormFixer.AI is provided "as-is" without any warranties, expressed or implied. We do not guarantee the accuracy or completeness of feedback provided by the app. We are not liable for injuries, damages, or losses resulting from the use of the app.

                        6. Intellectual Property
                        All content, trademarks, and intellectual property in FormFixer.AI are owned by the app developers. Unauthorized reproduction, distribution, or modification is prohibited.

                        7. Modifications to Terms
                        We reserve the right to update these Terms and Conditions at any time. Continued use of the app after changes indicates acceptance of the revised terms.

                        8. Governing Law
                        These Terms and Conditions are governed by and construed in accordance with the laws of Canada.

                        9. Contact Us
                        For questions or concerns about these Terms and Conditions, contact us at FormFixer@gmail.com. By using FormFixer.AI, you agree to these terms. If you do not comply with these conditions, we reserve the right to restrict or terminate your access to the app.
                    </Text>
                )}

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