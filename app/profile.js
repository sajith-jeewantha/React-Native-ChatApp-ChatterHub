import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Platform,
  FlatList,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { IMAGE_URL, URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import details from "./details";
import { OptionItem } from "../components/OptionItem";

SplashScreen.preventAutoHideAsync();

export default function prifile() {
  const [getAuth, setAuth] = useState({});
  const [getName, setName] = useState("");
  const [getMobile, setMobile] = useState("");

  const [loaded, error] = useFonts({
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
    "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
    async function checkuser() {
      try {
        let userJson = await AsyncStorage.getItem("auth");
        let auth = JSON.parse(userJson);
        if (userJson != null) {
          setAuth(auth);
          setName(auth.user.first_name + " " + auth.user.last_name);
          setMobile(auth.user.mobile);
        }
      } catch (error) {
        console.log(error);
        router.replace("/");
      }
    }
    checkuser();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Profile</Text>
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </View>

      <View style={styles.header}>
        <View style={getAuth.user_image ? null : styles.avatar}>
          {getAuth.user_image ? (
            <Image source={IMAGE_URL + getMobile + ".png"} style={styles.avatar} />
          ) : (
            <Text style={styles.avatartext}>{getAuth.avatar_letter}</Text>
          )}
        </View>

        <Text style={styles.profileName}>{getName}</Text>
        <Text style={styles.profileLocation}>
          <Ionicons name="call" size={12} color="gray" /> {getMobile}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <Pressable
          style={styles.stat}
          onPress={() => {
            try {
              AsyncStorage.removeItem("auth");
              router.replace("/");
            } catch (error) {
              console.log(error);
              router.replace("/");
            }
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text style={styles.statLabel}>Log out</Text>
        </Pressable>
      </View>

      <View style={styles.optionsContainer}>
        <OptionItem
          icon="envelope"
          title="Chats"
          description="Check your chat history"
          route={false}
        />
        <OptionItem
          icon="heart"
          title="Archived"
          description="Find your archived chats"
          route={false}
        />
        <OptionItem
          icon="user"
          title="My Profile Details"
          description="Change your profile details"
          route={true}
          name={"details"}
        />
        <OptionItem
          icon="cog"
          title="Settings"
          description="Password and Security"
          route={false}
        />
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => {
            router.replace("/home");
          }}
        >
          <Ionicons name="home" size={28} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="person" size={28} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileLocation: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  namebar: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "gray",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCDCDC",
    marginBottom: 10,
    borderWidth: 1,
  },
  avatartext: {
    fontSize: 50,
    fontFamily: "Roboto-Black",
    alignSelf: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  optionsContainer: {
    flex: 1,
    marginTop: 20,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
});
