import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, ScrollView } from 'react-native';

export default function Home() {
    return (
        <ImageBackground
            source={require('../../assets/images/homebg.png')}
            style={styles.background}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.topSection}>
                    <Text style={styles.title}><Text style={{ color: '#8F0404' }}>AI</Text> <Text style={{ color: '#FFFFFF' }}>Fitness Trainer</Text></Text>
                    <View style={styles.formMasteryContainer}>
                        <View style={styles.leftFormCard}>
                            <View style={styles.iconAndNumberContainer}>
                                <Image
                                    source={require('../../assets/images/graph.png')}
                                    style={styles.icon}
                                />
                                <Text style={[styles.formNumber, styles.leftFormText]}>5</Text>
                            </View>
                            <Text style={[styles.formLabel, styles.leftFormText]}>Forms Mastered</Text>
                        </View>
                        <View style={styles.formCard}>
                            <View style={styles.iconAndNumberContainer}>
                                <Image
                                    source={require('../../assets/images/check.png')}
                                    style={styles.icon}
                                />
                                <Text style={styles.formNumber}>7</Text>
                            </View>
                            <Text style={styles.formLabel}>Forms Left</Text>
                        </View>
                    </View>
                    <Text style={styles.chooseFormTitle}>Choose a Form to Master</Text>
                    <View style={styles.exerciseImagesContainer}>
                        <View style={styles.exerciseCard}>
                            <View style={styles.imageOverlay}>
                                <Image
                                    source={require('../../assets/images/benchpress.jpg')}
                                    style={styles.exerciseImage}
                                />
                                <View style={styles.textOverlay}>
                                    <Text style={styles.exerciseLabel}>Barbell Bench</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.exerciseCard}>
                            <View style={styles.imageOverlay}>
                                <Image
                                    source={require('../../assets/images/barbellsquat.jpeg')}
                                    style={styles.exerciseImage}
                                />
                                <View style={styles.textOverlay}>
                                    <Text style={styles.exerciseLabel}>Barbell Squat</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.exerciseImagesContainer, { marginTop: 10 }]}>
                        <View style={styles.exerciseCard}>
                            <View style={styles.imageOverlay}>
                                <Image
                                    source={require('../../assets/images/deadlift.jpg')}
                                    style={styles.exerciseImage}
                                />
                                <View style={styles.textOverlay}>
                                    <Text style={styles.exerciseLabel}>Conventional Deadlift</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.exerciseCard}>
                            <View style={styles.imageOverlay}>
                                <Image
                                    source={require('../../assets/images/shoulderpress.jpg')}
                                    style={styles.exerciseImage}
                                />
                                <View style={styles.textOverlay}>
                                    <Text style={styles.exerciseLabel}>Barbell Shoulder Press</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.exerciseImagesContainer, { marginTop: 10 }]}>
                        <View style={styles.exerciseCard}>
                            <View style={styles.imageOverlay}>
                                <Image
                                    source={require('../../assets/images/inclinedumbbellpress.jpeg')}
                                    style={styles.exerciseImage}
                                />
                                <View style={styles.textOverlay}>
                                    <Text style={styles.exerciseLabel}>Incline Dumbbell Press</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.exerciseCard}>
                            <View style={styles.imageOverlay}>
                                <Image
                                    source={require('../../assets/images/lateralraise.jpeg')}
                                    style={styles.exerciseImage}
                                />
                                <View style={styles.textOverlay}>
                                    <Text style={styles.exerciseLabel}>Shoulder Lateral Raise</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    leftFormCard: {
        backgroundColor: 'white',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        width: '45%',
    },
    leftFormText: {
        color: '#990000',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
    },
    topSection: {
        alignItems: 'center',
        marginTop: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formMasteryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        padding: 10,
    },
    formCard: {
        backgroundColor: '#990000',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        width: '45%',
    },
    iconAndNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    formNumber: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    formLabel: {
        fontSize: 16,
        color: 'white',
    },
    chooseFormTitle: {
        fontSize: 24,
        color: '#FFFFFF',
        marginTop: 30,
        fontWeight: 'bold',
    },
    exerciseImagesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 20,
    },
    exerciseCard: {
        alignItems: 'center',
        width: '45%',
    },
    imageOverlay: {
        position: 'relative',
        width: '100%',
        height: 150,
    },
    exerciseImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        opacity: 0.9,
    },
    textOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    exerciseLabel: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});