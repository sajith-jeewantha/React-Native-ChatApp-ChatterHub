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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function details() {
  const addimage = require("../assets/images/image1.png");
  const [getImage, setImage] = useState(addimage);
  const [id, setId] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  useEffect(() => {
    
    async function checkuser() {
      try {
        let authJson = await AsyncStorage.getItem("auth");
        let auth = JSON.parse(authJson);
        if (authJson != null) {
          setId(auth.user.id);
          setFirstname(auth.user.first_name);
          setLastname(auth.user.last_name);
          if (auth.user_image) {
            setImage(process.env.EXPO_PUBLIC_API_URL+"/ChatterHub/AvatarImages/"+ auth.user.mobile + ".png");
          }

        }
      } catch (error) {
        console.log(error);
        router.replace("/");
      }
    }
    checkuser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color="black"
          onPress={() => {
            router.back();
          }}
        />
        <Text style={styles.title}>Change Details</Text>
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </View>

      <View style={styles.inputContainer}>
        <Pressable
          style={styles.avatar1}
          onPress={async () => {
            let result = await ImagePicker.launchImageLibraryAsync({});
            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          }}
        >
          <Image
            style={styles.addimage}
            source={getImage}
            contentFit="contain"
          />
        </Pressable>
        <Text style={styles.textPicture}>Profile Picture</Text>
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

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            let formdata = new FormData();
            formdata.append("id", id);
            formdata.append("firstname", firstname);
            formdata.append("lastname", lastname);
            if (getImage != 27) {
              formdata.append("image", {
                name: "avatar.png",
                type: "image/png",
                uri: getImage,
              });
            }
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/ChatterHub/UpdateProfile", {
              method: "POST",
              body: formdata,
            });

            if (response.ok) {
              const json = await response.json();
              if (json.status) {
                try {
                  await AsyncStorage.setItem("auth", JSON.stringify(json));
                } catch (error) {
                  Alert.alert("Message", "AsyncStorage Error");
                }
                router.replace("/profile");
              } else {
                Alert.alert("Message", json.message);
              }
            }
          }}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => {
            router.replace("/");
          }}
        >
          <Ionicons name="home" size={28} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.replace("/profile");
          }}
        >
          <Ionicons name="person" size={28} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eaeaea",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  messageList: {
    paddingHorizontal: 20,
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCDCDC",
  },
  avatartext: {
    fontSize: 20,
    fontFamily: "Roboto-Black",
    alignSelf: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  messageContent: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: "gray",
  },
  timeContainer: {
    // marginTop:20,
    alignItems: "flex-end",
  },
  time: {
    fontSize: 12,
    color: "gray",
    marginBottom: 5,
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
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 15,
  },
  inputContainer: {
    flex: 1,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: "white",
    paddingHorizontal: 20,
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
  avatar1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
  },
  addimage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth:1,

  },
  textPicture: {
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 10,
  },
});
