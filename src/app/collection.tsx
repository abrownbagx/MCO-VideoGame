
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { deleteGame, Game, loadGames, toggleGame } from "../gameStore";

export default function CollectionScreen() {
  const [games, setGames] = useState<Game[]>([]);

  const loadCollection = async (): Promise<void> => {
    const loadedGames = await loadGames();
    setGames(loadedGames);
  };

  // Re-run loadCollection every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCollection();
    }, [])
  );

  const removeGame = async (id: string): Promise<void> => {
    await deleteGame(id);
    await loadCollection();
  };

  const completeGame = async (id: string): Promise<void> => {
    await toggleGame(id);
    await loadCollection();
  };

  const renderGame = ({ item }: { item: Game }) => {
    return (
      <View style={styles.gameCard}>
        <Text style={styles.gameTitle}>🎮 {item.title}</Text>

        <Text style={styles.gameInfo}>⭐ Rating: {item.rating}/5</Text>

        <Text style={styles.gameInfo}>
          📖 Story: {item.completed ? "Completed" : "Not Completed"}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => completeGame(item.id)}
          >
            <Text style={styles.buttonText}>
              {item.completed ? "Mark Unfinished" : "Complete"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeGame(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.app}>
      <View style={styles.container}>
        <Text style={styles.heading}>📚 My Collection</Text>

        {games.length === 0 ? (
          <Text style={styles.empty}>No games added yet.</Text>
        ) : (
          <FlatList
            data={games}
            keyExtractor={(item) => item.id}
            renderItem={renderGame}
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-game")}
        >
          <Text style={styles.buttonText}>+ Add Another Game</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.homeText}>← Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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
    marginBottom: 20,
  },
  gameCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gameInfo: {
    fontSize: 15,
    color: "#555",
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  homeButton: {
    padding: 15,
    alignItems: "center",
  },
  homeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  empty: {
    textAlign: "center",
    fontSize: 17,
    color: "#666",
    marginTop: 50,
    flex: 1,
  },
});