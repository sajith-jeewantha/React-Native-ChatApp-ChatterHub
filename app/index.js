import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import * as Notifications from "expo-notifications";
import { URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const logimage = require("../assets/images/Clogo.gif");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [loaded, error] = useFonts({
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
    "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  async function checkuser() {
    try {
      let userJosn = await AsyncStorage.getItem("auth");
      if (userJosn != null) {
        router.replace("/home");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      checkuser();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.view1}>
      <KeyboardAvoidingView
        // style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={60}
      >
        <Image style={styles.image} source={logimage} contentFit="contain" />

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={(text) => {
            setMobile(text);
          }}
          inputMode="tel"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            let data = {
              mobile: mobile,
              password: password,
            };

            const response = await fetch(URL + "/SignIn", {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const json = await response.json();
              if (json.status) {
                // Alert.alert("Message", json.message);
                try {
                  // console.log(json);
                  await AsyncStorage.setItem("auth", JSON.stringify(json));
                } catch (error) {
                  Alert.alert("Message", "AsyncStorage Error");
                }
                router.replace("/home");
              } else {
                Alert.alert("Message", json.message);
              }
            }
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              router.replace("/signup");
            }}
          >
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  icon: {
    alignSelf: "center",
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  link: {
    color: "#007bff",
  },
});
