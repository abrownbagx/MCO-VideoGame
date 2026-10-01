import React from "react";

import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  addGame,
  deleteGame,
  getGames,
} from "../gameStore";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: "Home",

      games: [],

      title: "",
      rating: "",
      completion: "",

      cart: [],
    };
  }

  componentDidMount() {
    this.loadGames();
  }

  async loadGames() {
    const games = await getGames();

    this.setState({
      games: games,
    });
  }

  goToScreen = (screen) => {
    this.setState({
      screen: screen,
    });
  };

  handleAddGame = async () => {
    const { title, rating, completion } = this.state;

    if (!title || !rating || !completion) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    const newGame = await addGame({
      title: title,
      rating: rating,
      completion: completion,
    });

    this.setState({
      games: [...this.state.games, newGame],

      title: "",
      rating: "",
      completion: "",

      screen: "Collection",
    });
  };

  handleDeleteGame = async (id) => {
    const updatedGames = await deleteGame(id);

    this.setState({
      games: updatedGames,
    });
  };

  addToCart = (game) => {
    const alreadyInCart = this.state.cart.some(
      (item) => item.id === game.id
    );

    if (alreadyInCart) {
      Alert.alert("Already Added", "This game is already in your cart.");
      return;
    }

    this.setState({
      cart: [...this.state.cart, game],
    });

    Alert.alert("Added", `${game.title} added to cart.`);
  };

  renderHome() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          🎮 GameVault
        </Text>

        <Text style={styles.subtitle}>
          Manage your game collection and backlog
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.goToScreen("AddGame")}
        >
          <Text style={styles.buttonText}>
            ➕ Add Game
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.goToScreen("Collection")}
        >
          <Text style={styles.buttonText}>
            🎮 My Collection
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.goToScreen("Cart")}
        >
          <Text style={styles.buttonText}>
            🛒 Cart ({this.state.cart.length})
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderAddGame() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          ➕ Add Game
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Game title"
          value={this.state.title}
          onChangeText={(text) =>
            this.setState({ title: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Rating (1-5)"
          keyboardType="numeric"
          value={this.state.rating}
          onChangeText={(text) =>
            this.setState({ rating: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Story Completion (%)"
          keyboardType="numeric"
          value={this.state.completion}
          onChangeText={(text) =>
            this.setState({ completion: text })
          }
        />

        <TouchableOpacity
          style={styles.button}
          onPress={this.handleAddGame}
        >
          <Text style={styles.buttonText}>
            Save Game
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => this.goToScreen("Home")}
        >
          <Text style={styles.backText}>
            ← Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderGame = ({ item }) => {
    return (
      <View style={styles.gameCard}>
        <Text style={styles.gameTitle}>
          🎮 {item.title}
        </Text>

        <Text style={styles.gameInfo}>
          ⭐ Rating: {item.rating}/5
        </Text>

        <Text style={styles.gameInfo}>
          📖 Completion: {item.completion}%
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => this.addToCart(item)}
          >
            <Text style={styles.smallButtonText}>
              🛒 Cart
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => this.handleDeleteGame(item.id)}
          >
            <Text style={styles.smallButtonText}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderCollection() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          🎮 My Collection
        </Text>

        <FlatList
          data={this.state.games}
          keyExtractor={(item) => item.id}
          renderItem={this.renderGame}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No games added yet.
            </Text>
          }
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.goToScreen("AddGame")}
        >
          <Text style={styles.buttonText}>
            ➕ Add Another Game
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => this.goToScreen("Home")}
        >
          <Text style={styles.backText}>
            ← Home
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderCart() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          🛒 Cart
        </Text>

        <FlatList
          data={this.state.cart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.gameCard}>
              <Text style={styles.gameTitle}>
                🎮 {item.title}
              </Text>

              <Text style={styles.gameInfo}>
                ⭐ Rating: {item.rating}/5
              </Text>

              <Text style={styles.gameInfo}>
                📖 {item.completion}% Complete
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Your cart is empty.
            </Text>
          }
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => this.goToScreen("Home")}
        >
          <Text style={styles.backText}>
            ← Home
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let content;

    if (this.state.screen === "Home") {
      content = this.renderHome();
    }

    if (this.state.screen === "AddGame") {
      content = this.renderAddGame();
    }

    if (this.state.screen === "Collection") {
      content = this.renderCollection();
    }

    if (this.state.screen === "Cart") {
      content = this.renderCart();
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        {content}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },

  button: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    marginVertical: 8,
    fontSize: 16,
  },

  gameCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  gameTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  gameInfo: {
    fontSize: 16,
    marginVertical: 3,
  },

  row: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },

  smallButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 7,
    flex: 1,
  },

  deleteButton: {
    backgroundColor: "#b00020",
    padding: 10,
    borderRadius: 7,
    flex: 1,
  },

  smallButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  backButton: {
    padding: 15,
    marginTop: 10,
  },

  backText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },

  empty: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#777",
  },
});
