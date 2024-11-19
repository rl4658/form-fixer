
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export default function App() {
    const device = useCameraDevice('back'); // Get the back camera
    const { hasPermission, requestPermission } = useCameraPermission(); // Check camera permission state

    // Show permission request screen if permission is not granted
    if (!hasPermission) return <PermissionsPage requestPermission={requestPermission} />;

    // Handle no camera device error
    if (device == null) return <NoCameraDeviceError />;

    // Render the camera if permissions are granted and device is ready
    return (
        <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
        />
    );
}

// Define Props Type for PermissionsPage
type PermissionsPageProps = {
    requestPermission: () => void;
};

// Component to request permissions
const PermissionsPage: React.FC<PermissionsPageProps> = ({ requestPermission }) => (
    <View style={styles.centeredContainer}>
        <Text style={styles.text}>
            Camera access is required to use this feature.
        </Text>
        <Text style={styles.text}>
            Please grant permission.
        </Text>
        <Text
            style={styles.link}
            onPress={requestPermission}
        >
            Grant Permission
        </Text>
    </View>
);

// Component for handling missing camera device
const NoCameraDeviceError = () => (
    <View style={styles.centeredContainer}>
        <Text style={styles.text}>No camera device found!</Text>
        <Text style={styles.text}>
            Please ensure your device has a working camera.
        </Text>
    </View>
);

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    link: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
});
