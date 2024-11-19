import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'expo-router';
import useUser from './hooks/UserContext';
import { FontAwesome } from '@expo/vector-icons';
import useGlobalStyle from './hooks/GlobalStyleContext';
import * as Haptics from 'expo-haptics';

import AuthPost from '../Fetchers/Auth/AuthDelete';
import Post from '../Fetchers/NoAuth/Post';
import Put from '../Fetchers/NoAuth/Put';

const host = "http://10.0.0.242:3000"


// Sanitizer function for managing input
function Sanitizer(value: string, setFunc: Dispatch<SetStateAction<string>>, regex: any) {
  const sanitizedInput = value.replace(regex, '');
  console.log(sanitizedInput) // Removes unwanted characters
  setFunc(sanitizedInput);
}

export default function Index() {
  const router = useRouter();
  const globalStyle = useGlobalStyle();
  const { setUser } = useUser()

  // State management for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("")

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    console.log(email)
    console.log(password)

    Post(
      host + "/users/login",
      { email, password },
      (error) => { setError(error) },
      () => { router.replace('/(tabs)/Home'); },
      setUser
    )

  };

  const handleRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('./register');
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

        <TouchableOpacity>
          <Text style={[styles.forgotPassword, { fontFamily: globalStyle.fontStyle.textFont, fontSize: globalStyle.fontSize.xs }]}>Forgot Password?</Text>
        </TouchableOpacity>

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
});
