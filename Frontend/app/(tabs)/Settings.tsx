import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useGlobalStyle from '../hooks/GlobalStyleContext';
import { useRouter } from 'expo-router';
import useUser from '../hooks/UserContext';
import AuthPost from '../../Fetchers/Auth/AuthDelete';
export default function Settings() {
    const globalStyle = useGlobalStyle();
    const router = useRouter();
    const { user, setUser } = useUser()

    if (user && Array.isArray(user)) {
        const [userInfo, token] = user;
    }


    const handleNavigation = (route: string) => {
        router.push(route); // Navigate to specific routes when implemented
    };

    function handleSignOut() {

    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: globalStyle.colors.bgColor }]}>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/profile.png')} // Replace with a profile placeholder or dynamic image
                    style={styles.profileImage}
                />
                <Text style={[styles.userName, { fontFamily: globalStyle.fontStyle.textFont }]}>Jane Kolinz</Text>
                <TouchableOpacity style={styles.editIcon}>
                    <FontAwesome name="edit" size={18} color={globalStyle.colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigation('/accounte')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>Account</Text>
                    <FontAwesome name="chevron-right" size={18} color={globalStyle.colors.secondary} />
                </TouchableOpacity>

                {/* <TouchableOpacity
                onPress={() => navigation.navigate('AccountSettingsPage')}
                >
                <Text style={styles.menuText}>Account</Text>
                </TouchableOpacity>
                */}


                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigation('/notifications')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>Notification</Text>
                    <FontAwesome name="chevron-right" size={18} color={globalStyle.colors.secondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigation('/privacy')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>Privacy & Security</Text>
                    <FontAwesome name="chevron-right" size={18} color={globalStyle.colors.secondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigation('/about')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>About</Text>
                    <FontAwesome name="chevron-right" size={18} color={globalStyle.colors.secondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigation('/terms')}
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont }]}>Terms & Conditions</Text>
                    <FontAwesome name="chevron-right" size={18} color={globalStyle.colors.secondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleSignOut()} // Navigate to logout or clear session
                >
                    <Text style={[styles.menuText, { fontFamily: globalStyle.fontStyle.textFont, color: globalStyle.colors.primary }]}>
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
    spacing: {
        height: 50
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
});