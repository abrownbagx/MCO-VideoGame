import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

type Game = {
  id: string;
  title: string;
  rating: string;
  completed: boolean;
};

export default function HomeScreen() {
  // =========================
  // STATES
  // =========================

  const [screen, setScreen] = useState("Home");

  const [games, setGames] = useState<Game[]>([]);

  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");

  // =========================
  // LOAD SAVED GAMES
  // =========================

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const savedGames = await AsyncStorage.getItem("games");

      if (savedGames) {
        setGames(JSON.parse(savedGames));
      }
    } catch (error) {
      console.log("Error loading games:", error);
    }
  };

  // =========================
  // SAVE GAMES
  // =========================

  const saveGames = async (updatedGames: Game[]) => {
    try {
      await AsyncStorage.setItem(
        "games",
        JSON.stringify(updatedGames)
      );
    } catch (error) {
      console.log("Error saving games:", error);
    }
  };

  // =========================
  // ADD GAME
  // =========================

  const addGame = () => {
    if (title.trim() === "") {
      Alert.alert("Missing Game", "Please enter a game title.");
      return;
    }

    const newGame: Game = {
      id: Date.now().toString(),
      title: title,
      rating: rating || "Not Rated",
      completed: false,
    };

    const updatedGames = [...games, newGame];

    setGames(updatedGames);
    saveGames(updatedGames);

    setTitle("");
    setRating("");

    setScreen("Collection");
  };

  // =========================
  // DELETE GAME
  // =========================

  const deleteGame = (id: string) => {
    const updatedGames = games.filter(
      (game) => game.id !== id
    );

    setGames(updatedGames);
    saveGames(updatedGames);
  };

  // =========================
  // COMPLETE GAME
  // =========================

  const toggleCompleted = (id: string) => {
    const updatedGames = games.map((game) =>
      game.id === id
        ? {
            ...game,
            completed: !game.completed,
          }
        : game
    );

    setGames(updatedGames);
    saveGames(updatedGames);
  };

  // =========================
  // GAME CARD
  // =========================

  const renderGame = ({ item }: { item: Game }) => (
    <View style={styles.gameCard}>
      <Text style={styles.gameTitle}>
        🎮 {item.title}
      </Text>

      <Text style={styles.gameInfo}>
        ⭐ Rating: {item.rating}
      </Text>

      <Text style={styles.gameInfo}>
        📖 Story:{" "}
        {item.completed
          ? "Completed"
          : "Not Completed"}
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => toggleCompleted(item.id)}
        >
          <Text style={styles.buttonText}>
            {item.completed
              ? "Uncomplete"
              : "Complete"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteGame(item.id)}
        >
          <Text style={styles.buttonText}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // =========================
  // HOME SCREEN
  // =========================

  const Home = () => (
    <View style={styles.center}>
      <Text style={styles.logo}>🎮 GameTrack</Text>

      <Text style={styles.subtitle}>
        Video Game Collection
        {"\n"}
        & Backlog Tracker
      </Text>

      <Text style={styles.stats}>
        {games.length} Games in Collection
      </Text>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => setScreen("Add")}
      >
        <Text style={styles.mainButtonText}>
          + Add Game
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setScreen("Collection")}
      >
        <Text style={styles.secondaryButtonText}>
          📚 My Collection
        </Text>
      </TouchableOpacity>
    </View>
  );

  // =========================
  // ADD GAME SCREEN
  // =========================

  const AddGame = () => (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Add New Game
      </Text>

      <Text style={styles.label}>
        Game Title
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Minecraft"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>
        Rating
      </Text>

      <TextInput
        style={styles.input}
        placeholder="1 - 5"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />

      <TouchableOpacity
        style={styles.mainButton}
        onPress={addGame}
      >
        <Text style={styles.mainButtonText}>
          Save Game
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setScreen("Home")}
      >
        <Text style={styles.backText}>
          ← Back
        </Text>
      </TouchableOpacity>
    </View>
  );

  // =========================
  // COLLECTION SCREEN
  // =========================

  const Collection = () => (
    <View style={styles.container}>
      <Text style={styles.heading}>
        My Collection
      </Text>

      {games.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>
            🎮 No games yet
          </Text>

          <Text style={styles.emptySubtext}>
            Add your first game to your collection.
          </Text>
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={renderGame}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => setScreen("Add")}
      >
        <Text style={styles.mainButtonText}>
          + Add Another Game
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setScreen("Home")}
      >
        <Text style={styles.backText}>
          ← Home
        </Text>
      </TouchableOpacity>
    </View>
  );

  // =========================
  // NAVIGATION
  // =========================

  return (
    <SafeAreaView style={styles.app}>
      {screen === "Home" && <Home />}

      {screen === "Add" && <AddGame />}

      {screen === "Collection" && <Collection />}
    </SafeAreaView>
  );
}

// =========================
// STYLES
// =========================

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  logo: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 15,
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 20,
  },

  stats: {
    fontSize: 15,
    marginBottom: 25,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },

  mainButton: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  mainButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  secondaryButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  gameCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },

  gameTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  gameInfo: {
    fontSize: 15,
    marginBottom: 6,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  completeButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 7,
    flex: 1,
    alignItems: "center",
  },

  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 7,
    flex: 1,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  backButton: {
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },

  backText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },

  empty: {
    fontSize: 20,
    fontWeight: "bold",
  },

  emptySubtext: {
    marginTop: 8,
    color: "#666",
  },
});