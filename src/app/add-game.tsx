
import { router } from "expo-router";
import React from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { addGame } from "../gameStore";

type AddGameState = {
  title: string;
  rating: string;
};

export default class AddGameScreen extends React.Component<
  {},
  AddGameState
> {
  state: AddGameState = {
    title: "",
    rating: "",
  };

  saveGame = async (): Promise<void> => {
    const { title, rating } = this.state;

    if (title.trim() === "") {
      Alert.alert(
        "Missing Game",
        "Please enter a game title."
      );
      return;
    }

    if (rating.trim() === "") {
      Alert.alert(
        "Missing Rating",
        "Please enter a rating."
      );
      return;
    }

    const ratingNumber = Number(rating);

    if (ratingNumber < 1 || ratingNumber > 5) {
      Alert.alert(
        "Invalid Rating",
        "Rating must be between 1 and 5."
      );
      return;
    }

    await addGame(title.trim(), rating);

    this.setState({
      title: "",
      rating: "",
    });

    router.replace("/collection");
  };

  render() {
    return (
      <SafeAreaView style={styles.app}>
        <View style={styles.container}>
          <Text style={styles.heading}>
            🎮 Add New Game
          </Text>

          <Text style={styles.label}>
            Game Title
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter game title"
            value={this.state.title}
            onChangeText={(text) =>
              this.setState({ title: text })
            }
          />

          <Text style={styles.label}>
            Rating
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Rating (1-5)"
            keyboardType="numeric"
            value={this.state.rating}
            onChangeText={(text) =>
              this.setState({ rating: text })
            }
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={this.saveGame}
          >
            <Text style={styles.saveButtonText}>
              Save Game
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>
              ← Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  container: {
    flex: 1,
    padding: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },

  saveButton: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  saveButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  backButton: {
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },

  backText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

