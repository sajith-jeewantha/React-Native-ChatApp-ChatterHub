import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function OptionItem(props) {
  return (
    <TouchableOpacity
      style={styles.option}
      onPress={() => {
        props.route == true ? router.push("/" + props.name) : null;
      }}
    >
      <View style={styles.optionLeft}>
        <FontAwesome name={props.icon} size={20} color="gray" />
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{props.title}</Text>
          <Text style={styles.optionDescription}>{props.description}</Text>
        </View>
      </View>
      <FontAwesome name="chevron-right" size={18} color="gray" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    marginLeft: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionDescription: {
    fontSize: 12,
    color: "gray",
  },
});
