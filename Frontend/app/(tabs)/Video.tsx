import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { TensorflowModel, useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    useSkiaFrameProcessor,
} from 'react-native-vision-camera';
import { PaintStyle, Skia } from '@shopify/react-native-skia';
import getBestFormat from '../formFilter';


function tensorToString(tensor: TensorflowModel['inputs'][number]): string {
    return `${tensor.dataType} [${tensor.shape}]`;
}

const VIEW_WIDTH = Dimensions.get('screen').width;
const LINE_WIDTH = 2;

function Video(): JSX.Element {
    const [minConfidence, setMinConfidence] = useState(0.25); // Minimum confidence threshold for upper body
    const [lowerBodyConfidenceThreshold, setLowerBodyConfidenceThreshold] = useState(0.35); // For lower body keypoints
    const [feedback, setFeedback] = useState(''); // Feedback for form (Correct/Incorrect)
    const [angle, setAngle] = useState<number | null>(null); // Calculated angle

    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const { resize } = useResizePlugin();

    const delegate = Platform.OS === 'ios' ? 'core-ml' : undefined;
    const plugin = useTensorflowModel(require('./poseModel.tflite'), delegate);

    const format = useMemo(
        () => (device != null ? getBestFormat(device, 720, 1000) : undefined),
        [device],
    );

    const inputTensor = plugin.model?.inputs[0];
    const inputWidth = inputTensor?.shape[1] ?? 0;
    const inputHeight = inputTensor?.shape[2] ?? 0;

    const paint = Skia.Paint();
    paint.setStyle(PaintStyle.Fill);
    paint.setStrokeWidth(LINE_WIDTH);
    paint.setColor(Skia.Color('white'));

    const lines = [
        // left shoulder -> elbow
        5, 7,
        // right shoulder -> elbow
        6, 8,
        // left elbow -> wrist
        7, 9,
        // right elbow -> wrist
        8, 10,
        // left hip -> knee
        11, 13,
        // right hip -> knee
        12, 14,
        // left knee -> ankle
        13, 15,
        // right knee -> ankle
        14, 16,

        // left hip -> right hip
        11, 12,
        // left shoulder -> right shoulder
        5, 6,
        // left shoulder -> left hip
        5, 11,
        // right shoulder -> right hip
        6, 12,
    ];

    const SCALE = (format?.videoWidth ?? VIEW_WIDTH) / VIEW_WIDTH;

    const frameProcessor = useSkiaFrameProcessor(
        (frame) => {
            'worklet';

            frame.render()

            if (plugin.model != null) {
                const smaller = resize(frame, {
                    scale: {
                        width: inputWidth,
                        height: inputHeight,
                    },
                    pixelFormat: 'rgb',
                    dataType: 'uint8',
                });
                const outputs = plugin.model.runSync([smaller]);

                const output = outputs[0];
                const frameWidth = frame.width;
                const frameHeight = frame.height;

                // Extract keypoints
                const x5 = Number(output[5 * 3 + 1]) * frameWidth;  // Left Shoulder (5)
                const y5 = Number(output[5 * 3]) * frameHeight;

                const x7 = Number(output[7 * 3 + 1]) * frameWidth;  // Left Elbow (7)
                const y7 = Number(output[7 * 3]) * frameHeight;

                const x9 = Number(output[9 * 3 + 1]) * frameWidth;  // Left Wrist (9)
                const y9 = Number(output[9 * 3]) * frameHeight;

                // Compute segment lengths
                const d57 = Math.sqrt((x7 - x5) ** 2 + (y7 - y5) ** 2); // Shoulder to Elbow
                const d79 = Math.sqrt((x9 - x7) ** 2 + (y9 - y7) ** 2); // Elbow to Wrist
                const d59 = Math.sqrt((x9 - x5) ** 2 + (y9 - y5) ** 2); // Shoulder to Wrist

                // Use the Law of Cosines to calculate the angle at the elbow (keypoint 7)
                const cosTheta = (d57 ** 2 + d79 ** 2 - d59 ** 2) / (2 * d57 * d79);
                const angleRadians = Math.acos(Math.max(-1, Math.min(1, cosTheta))); // Clamp to avoid NaN
                const angleDegrees = (angleRadians * 180) / Math.PI; // Convert to degrees

                console.log(`Left Elbow Angle: ${angleDegrees.toFixed(2)}°`);

                const minAngle = 30;
                const maxAngle = 180;

                for (let i = 5; i < output.length / 3; i++) {
                    const confidence = Number(output[i * 3 + 2]);
                    const threshold =
                        i >= 11 ? lowerBodyConfidenceThreshold : minConfidence;

                    if (confidence > threshold) {
                        const x = Number(output[i * 3 + 1]) * frameWidth;
                        const y = Number(output[i * 3]) * frameHeight;

                        frame.drawCircle(x, y, 2 * SCALE, paint);
                    }
                }

                for (let i = 0; i < lines.length; i += 2) {
                    const from = lines[i];
                    const to = lines[i + 1];

                    if (from <= 4 || to <= 4) continue;

                    const confidenceFrom = Number(output[from * 3 + 2]);
                    const confidenceTo = Number(output[to * 3 + 2]);

                    const threshold =
                        from >= 11 || to >= 11
                            ? lowerBodyConfidenceThreshold
                            : minConfidence;

                    if (confidenceFrom > threshold && confidenceTo > threshold) {
                        const x1 = Number(output[from * 3 + 1]) * frameWidth;
                        const y1 = Number(output[from * 3]) * frameHeight;
                        const x2 = Number(output[to * 3 + 1]) * frameWidth;
                        const y2 = Number(output[to * 3]) * frameHeight;

                        frame.drawLine(x1, y1, x2, y2, paint);
                    }
                }
            }
        },
        [plugin, paint, inputWidth, inputHeight, minConfidence, lowerBodyConfidenceThreshold],
    );

    // Update state periodically from refs
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (angleRef.current !== null) {
    //             setAngle(angleRef.current);
    //             setFeedback(feedbackRef.current);
    //         }
    //     }, 100);

    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        setFeedback('Correct Form'); // Hardcoded feedback
        setAngle(45); // Hardcoded angle
    }, []);

    // Permissions handling
    if (!hasPermission) return <PermissionsPage requestPermission={requestPermission} />;
    if (device == null) return <NoCameraDeviceError />;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                format={format}
            />
            <View style={styles.overlay}>
                {angle !== null && (
                    <Text style={styles.text}>
                        {feedback}: {Math.round(angle)}°
                    </Text>
                )}
            </View>

            {/* Instruction Overlay */}
            <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                    Keep your back straight and fully extend your arms!
                </Text>
            </View>
        </View>
    );
}

// Permissions page
type PermissionsPageProps = {
    requestPermission: () => void;
};
const PermissionsPage: React.FC<PermissionsPageProps> = ({ requestPermission }) => (
    <View style={styles.centeredContainer}>
        <Text style={styles.text}>
            Camera access is required to use this feature.
        </Text>
        <Text style={styles.text}>Please grant permission.</Text>
        <Text style={styles.link} onPress={requestPermission}>
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controls: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 10,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
    },
    link: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
    confidenceText: {
        color: 'Black',
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: 'Black',
        fontSize: 16,
    },
    instructions: {
        position: 'absolute',
        bottom: 100,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
    },
    instructionText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    overlay: {
        position: 'absolute',
        top: '10%', // Position the overlay near the top of the screen
        alignSelf: 'center', // Center it horizontally
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent black background
        padding: 10, // Add padding around the text
        borderRadius: 8, // Rounded corners for the overlay box
        zIndex: 10, // Ensure it stays above other components
    },
});

export default Video;