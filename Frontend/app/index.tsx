import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'expo-router';
import useUser from './hooks/UserContext';
import { FontAwesome } from '@expo/vector-icons';
import useGlobalStyle from './hooks/GlobalStyleContext';
import * as Haptics from 'expo-haptics';

import AuthPost from '../Fetchers/Auth/AuthDelete';
import Post from '../Fetchers/NoAuth/Post';
import Put from '../Fetchers/NoAuth/Put';

export let host = "http://10.0.0.242:3000"


// Sanitizer function for managing input
export function Sanitizer(value: string, setFunc: Dispatch<SetStateAction<string>>, regex: any) {
  const sanitizedInput = value.replace(regex, '');
  // Removes unwanted characters
  setFunc(sanitizedInput);
}

export default function Index() {
  const router = useRouter();
  const globalStyle = useGlobalStyle();
  const { setUser, setToken } = useUser()

  // State management for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("")
  const [modalEmail, setModalEmail] = useState(''); // for popup window for email entering
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [forgotPassCode, setCode] = useState({ code: '', message: '' });

  // code entering after user gets code from email for password reset
  const [isCodeModalVisible, setIsCodeModalVisible] = useState(false);
  const [resetCode, setResetCode] = useState("");

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Post(
      host + "/users/login",
      { email, password },
      (error) => { setError(error) },
      () => { router.replace('/(tabs)/Home'); },
      (data) => {
        setUser(data[0])
        setToken(data[1])
      }
    )

  };

  // route to fetch and handle register functionality
  const handleRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('./register');
  };

  // route to fetch and handle forgot password functionality
  const handleForgotPwrd = () => {
    const trimmedEmail = modalEmail.trim();

    console.log("****************" + trimmedEmail) // PROXY
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Error", "Please enter a valid email address in the format: example@gmail.com");
      return;
    }

    console.log("Sending forgot password request for email:", trimmedEmail);

    // Sending email request to backend
    Post(
      host + "/users/forgot-password",
      { email: trimmedEmail },
      (error) => {
        console.error("Error response from server:", error);
        const errorMessage = typeof error === "string" ? error : "An unexpected error occurred.";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      },
      () => {
        console.log("Server responded");
        Alert.alert("Success", "Password reset email has been sent successfully.");
        setIsModalVisible(false);
        setIsCodeModalVisible(true); // OPENS the code modal after user gets code from email
      },
      setCode
    );

  };

  // handling verification code
  const handleVerifyCode = () => {
    if (!resetCode) {
      Alert.alert("Error", "Please enter the reset code.");
      return;
    }
    if (resetCode !== forgotPassCode.code) {
      Alert.alert("Wrong password reset code, please try again");
      return
    }
    router.replace("/forgetPassword")
    Alert.alert("Success", "Code verified! Proceed to reset your password.");
    setIsCodeModalVisible(false);
  };

  return (
    <ImageBackground
      source={require('../assets/images/loginbg.jpg')}
      style={[styles.background, { backgroundColor: globalStyle.colors.bgColor }]}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={[styles.title, { fontFamily: globalStyle.fontStyle.titleFont, fontSize: globalStyle.fontSize.xl }]}>
          <Text style={[styles.highlight, { color: globalStyle.colors.primary }]}>AI </Text>
          Fitness Trainer
        </Text>

        <View style={[styles.inputContainer, { backgroundColor: 'transparent' }]}>
          <FontAwesome name="envelope" size={20} color="white" style={styles.icon} />
          <TextInput
            textContentType="emailAddress"
            placeholder="Email Address"
            placeholderTextColor="white"
            value={email} // Bind to state
            onChangeText={(text) => Sanitizer(text, setEmail, /[^a-zA-Z0-9@.]/g)} // Allow only letters, numbers, @, and .
            style={[styles.input, { fontFamily: globalStyle.fontStyle.textFont, fontSize: globalStyle.fontSize.s }]}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: 'transparent' }]}>
          <FontAwesome name="lock" size={20} color="white" style={styles.icon} />
          <TextInput
            textContentType="password"
            placeholder="Password"
            placeholderTextColor="white"
            value={password} // Bind to state
            onChangeText={(text) => Sanitizer(text, setPassword, /[<>()]/g)} // Exclude < and >
            secureTextEntry
            style={[styles.input, { fontFamily: globalStyle.fontStyle.textFont, fontSize: globalStyle.fontSize.s }]}
          />
        </View>

        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={[styles.forgotPassword, { fontFamily: globalStyle.fontStyle.textFont, fontSize: globalStyle.fontSize.xs }]}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* <View style={styles.container}>
          <Text style={styles.title}>Reset Password</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput
            placeholder="Enter new password"
            placeholderTextColor="gray"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm new password"
            placeholderTextColor="gray"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </View> */}

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="gray"
                value={modalEmail}
                onChangeText={(text) => setModalEmail(text)}
                style={styles.modalInput}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: globalStyle.colors.primary }]}
                  onPress={handleForgotPwrd}
                >
                  <Text
                    style={styles.modalButtonText}>Send Email</Text>
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

        <Modal
          visible={isCodeModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsCodeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Enter Reset Code</Text>
              <TextInput
                placeholder="Enter the code from your email"
                placeholderTextColor="gray"
                value={resetCode}
                onChangeText={setResetCode}
                style={styles.modalInput}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: globalStyle.colors.primary }]}
                  onPress={handleVerifyCode}
                >
                  <Text style={styles.modalButtonText}>Verify Code</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: 'gray' }]}
                  onPress={() => setIsCodeModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Text style={{ fontSize: globalStyle.fontSize.s, color: globalStyle.colors.primary }}>{error}</Text>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: globalStyle.colors.primary }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleLogin();
          }}
        >
          <Text style={[styles.loginButtonText, { fontFamily: globalStyle.fontStyle.textFont, fontSize: globalStyle.fontSize.m }]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

          }}
        >
          <Text style={[styles.googleButtonText, { fontFamily: globalStyle.fontStyle.textFont, fontSize: globalStyle.fontSize.m }]}>Google Login</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.registerSection}>
        <Text style={[styles.registerText, { fontFamily: globalStyle.fontStyle.textFont }]}>
          New User?{' '}
          <Text
            style={[styles.registerLink, { color: globalStyle.colors.primary }]}
            onPress={handleRegister}
          >
            Register Now
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  // button: {
  //   backgroundColor: '#007BFF',
  //   padding: 15,
  //   borderRadius: 5,
  //   width: '100%',
  //   alignItems: 'center',
  // },
  // buttonText: {
  //   color: '#fff',
  //   fontWeight: 'bold',
  //   fontSize: 16,
  // },
  // error: {
  //   color: 'red',
  //   marginBottom: 10,
  // },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white', // Bottom border only for underline effect
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
  },
  forgotPassword: {
    color: 'white',
    marginVertical: 15,
    marginRight: 140,
    width: 200,
    alignSelf: 'flex-start',
  },
  highlight: {
    fontWeight: 'bold',
  },
  loginButton: {
    borderRadius: 15,
    paddingVertical: 15,
    width: '75%',
    alignItems: 'center',
    marginTop: 12
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  googleButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 15,
    width: '75%',
    marginTop: 20,
    alignItems: 'center',

  },
  googleButtonText: {
    color: 'black',
    fontWeight: '700',
  },
  registerSection: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  registerText: {
    color: 'white',
    fontSize: 14,
  },
  registerLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
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
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});