import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
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
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs, router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { IMAGE_URL, URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

SplashScreen.preventAutoHideAsync();

export default function home() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sound, setSound] = useState();

  const chat_user = useLocalSearchParams();

  //   const flatListRef = useRef();
  //   flatListRef?.current?.scrollToEnd();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sound/pop-alert.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  const fetchChatArray = async () => {
    let userJson = await AsyncStorage.getItem("auth");
    let auth = JSON.parse(userJson);
    let response = await fetch(
      URL +
        "/LoadChat?user_id=" +
        auth.user.id +
        "&other_user_id=" +
        chat_user.user_id
    );
    if (response.ok) {
      let chatArray = await response.json();
      setMessages(chatArray);
      console.log(chatArray);
    }
  };

  async function deleteMessage(id) {
    await fetch(URL + "/DeleteChat?id=" + id);
  }

  useEffect(() => {
    chatRefresh = setInterval(() => {
      fetchChatArray();
      //   console.log("Runing")
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={40}
      >
        <View style={styles.topBar}>
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color="black"
            onPress={() => {
              clearInterval(chatRefresh);
              router.back();
            }}
          />
          <View style={styles.namebar}>
            <View style={styles.avatar}>
              {chat_user.user_image == "true" ? (
                <Image
                  source={IMAGE_URL + chat_user.user_mobile + ".png"}
                  style={styles.avatar}
                />
              ) : (
                <Text style={styles.avatartext}>{chat_user.avatar_letter}</Text>
              )}
            </View>

            <View>
              <Text style={styles.title}>{chat_user.user_name}</Text>
              <Text style={styles.status}>
                {chat_user.user_status == 1 ? "Online" : "Offline"}
              </Text>
            </View>
          </View>

          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </View>

        <FlatList
          data={messages}
          // ref={flatListRef}
          renderItem={({ item }) => (
            // console.log(item.id)
            <TouchableOpacity
              onLongPress={() => {
                Alert.alert("Message", "Delete Message", [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: () => deleteMessage(item.id),
                    style: "default",
                  },
                ]);
              }}
              style={
                item.side == "right"
                  ? styles.sentMessage
                  : styles.receivedMessage
              }
            >
              <Text style={styles.messageText}>{item.message}</Text>
              <Text style={styles.messageTime}>{item.datetime}</Text>
              {item.side == "right" ? (
                <Ionicons
                  style={styles.checkmark}
                  name="checkmark-done-outline"
                  size={24}
                  color={item.status == 1 ? "green" : "gray"}
                />
              ) : null}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.messagesContainer}
          estimatedItemSize={200}
          flashScrollIndicators={true}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.plusButton}>
            <Text style={styles.plusIcon}>
              <Ionicons name="add-outline" size={30} color="black" />
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Message..."
            value={newMessage}
            onChangeText={(text) => {
              setNewMessage(text);
            }}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={async () => {
              if (!newMessage.length == 0) {
                let authJson = await AsyncStorage.getItem("auth");
                let auth = JSON.parse(authJson);
                let response = await fetch(
                  URL +
                    "/SendChat?user_id=" +
                    auth.user.id +
                    "&other_user_id=" +
                    chat_user.user_id +
                    "&message=" +
                    newMessage
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    // console.log("Message Sent");
                    playSound();
                    setNewMessage("");
                  }
                }
              }
            }}
          >
            <Text style={styles.smileyIcon} keyExtractor={true}>
              <Ionicons
                name="arrow-up-circle-outline"
                size={30}
                color="green"
              />
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
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
  status: {
    fontSize: 10,
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
    fontSize: 24,
    fontFamily: "Roboto-Black",
    alignSelf: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  messagesContainer: {
    padding: 20,
    paddingBottom: 80,
  },

  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#DCDCDC",
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    maxWidth: "75%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCDCDC",
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    maxWidth: "75%",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  checkmark: {
    alignSelf: "flex-end",
  },
  audioMessage: {
    flexDirection: "row",
    alignItems: "center",
  },
  audioIcon: {
    fontSize: 30,
    marginRight: 10,
  },
  audioText: {
    fontSize: 16,
  },
  inputContainer: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    bottom: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    // left: 20,
    // right: 20,
    // backgroundColor: "red",
    // position: "absolute",
  },
  plusButton: {
    marginRight: 10,
  },
  plusIcon: {
    fontSize: 24,
    color: "#888",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
  },
  sendButton: {
    marginLeft: 10,
  },
  smileyIcon: {
    fontSize: 24,
    color: "#888",
  },
});
