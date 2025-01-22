import React, { useEffect, useMemo, useState } from 'react';
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
        5, 7, 6, 8, 7, 9, 8, 10, 11, 13, 12, 14, 13, 15, 14, 16, 11, 12, 5, 6, 5, 11, 6, 12,
    ];

    const SCALE = (format?.videoWidth ?? VIEW_WIDTH) / VIEW_WIDTH;

    const frameProcessor = useSkiaFrameProcessor(
        (frame) => {
            'worklet';

            frame.render();

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
        [plugin, paint, minConfidence, lowerBodyConfidenceThreshold],
    );

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
            <View style={styles.controls}>
                {/* Upper Body Confidence Controls */}
                <Text style={styles.confidenceText}>Min Confidence: {minConfidence.toFixed(2)}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setMinConfidence((prev) => Math.min(prev + 0.01, 1))}
                    >
                        <Text style={styles.buttonText}>Increase</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setMinConfidence((prev) => Math.max(prev - 0.01, 0))}
                    >
                        <Text style={styles.buttonText}>Decrease</Text>
                    </TouchableOpacity>
                </View>

                {/* Lower Body Confidence Controls */}
                <Text style={styles.confidenceText}>
                    Lower Body Confidence: {lowerBodyConfidenceThreshold.toFixed(2)}
                </Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                            setLowerBodyConfidenceThreshold((prev) => Math.min(prev + 0.01, 1))
                        }
                    >
                        <Text style={styles.buttonText}>Increase</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                            setLowerBodyConfidenceThreshold((prev) => Math.max(prev - 0.01, 0))
                        }
                    >
                        <Text style={styles.buttonText}>Decrease</Text>
                    </TouchableOpacity>
                </View>
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
        color: 'white',
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
        color: 'white',
        fontSize: 16,
    },
});

export default Video;
