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
  Pressable,
  Alert,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function home() {
  const [getChatArray, SetChatArray] = useState([]);
  const [refreshing, setrefreshing] = useState(false);

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
    fetchData("no");
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const fetchData = async (text) => {
    // console.log("Reading")
    try {
      let userJson = await AsyncStorage.getItem("auth");
      let auth = JSON.parse(userJson);
      // console.log(text)
      let response = await fetch(
        process.env.EXPO_PUBLIC_API_URL + "/ChatterHub/LoadHomeData?id=" + auth.user.id + "&search=" + text
      );

      if (response.ok) {
        let json = await response.json();
        if (json.success) {
          let chatArray = json.jsonchatArray;
          // console.log(chatArray);
          SetChatArray(chatArray);
        }
      }
    } catch (error) {
      console.log(error);
      router.replace("/");
    }
  };

  const handleRefresh = () => {
    setrefreshing(true);
    fetchData("no");
    setrefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Message</Text>
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={(text) => {
            if (text.length == 0) {
              fetchData("no");
            } else {
              fetchData(text);
            }
          }}
        />
      </View>

      <FlatList
        data={getChatArray}
        renderItem={({ item }) => (
          // console.log(item)

          <Pressable
            style={styles.messageContainer}
            onPress={() => {
              router.push({
                pathname: "/chat",
                params: item,
              });
            }}
          >
            <View style={styles.avatar}>
              {item.user_image ? (
                <Image
                  source={process.env.EXPO_PUBLIC_API_URL+"/ChatterHub/AvatarImages/" + item.user_mobile + ".png"}
                  style={styles.avatar}
                />
              ) : (
                <Text style={styles.avatartext}>{item.avatar_letter}</Text>
              )}
            </View>

            <View style={styles.messageContent}>
              <Text style={styles.name}>{item.user_name}</Text>
              <Text style={styles.text} numberOfLines={1}>
                {item.message}
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{item.dateTime}</Text>
              {item.chat_status_id == 2 ? (
                <Ionicons name="ellipse-sharp" size={16} color="blue" />
              ) : null}
            </View>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messageList}
        estimatedItemSize={200}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => {
            // SetSearch("")
            // fetchData()
          }}
        >
          <Ionicons name="home" size={28} color="blue" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.replace("/profile");
          }}
        >
          <Ionicons name="person" size={28} color="gray" />
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
    fontFamily:"Roboto-Black",
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
});
