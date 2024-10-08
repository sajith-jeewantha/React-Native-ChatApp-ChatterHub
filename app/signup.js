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
import { router } from "expo-router";
import { Image } from "expo-image";
import { URL } from "../config";

export default function signup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const logimage = require("../assets/images/Clogo.gif");

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
        placeholder="First Name"
        value={firstname}
        onChangeText={(text) => {
          setFirstname(text);
        }}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastname}
        onChangeText={(text) => {
          setLastname(text);
        }}
        autoCapitalize="none"
      />

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
            firstname: firstname,
            lastname: lastname,
            password: password,
          };

          const response = await fetch(URL + "/SignUp", {
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
              router.replace("/");
            } else {
              Alert.alert("Message", json.message);
            }
          }
        }}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => {
            router.replace("/");
          }}
        >
          <Text style={styles.link}>Log In</Text>
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
