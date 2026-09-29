```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "videoGames";

export type Game = {
  id: string;
  title: string;
  rating: string;
  completed: boolean;
};

// Get all games
export async function getGames(): Promise<Game[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (data === null) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.log("Error loading games:", error);
    return [];
  }
}

// Load games
export async function loadGames(): Promise<Game[]> {
  return await getGames();
}

// Save games
export async function saveGames(
  games: Game[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(games)
    );
  } catch (error) {
    console.log("Error saving games:", error);
  }
}

// Add a new game
export async function addGame(
  title: string,
  rating: string
): Promise<Game> {
  const games = await getGames();

  const newGame: Game = {
    id: Date.now().toString(),
    title: title,
    rating: rating,
    completed: false,
  };

  games.push(newGame);

  await saveGames(games);

  return newGame;
}

// Delete a game
export async function deleteGame(
  id: string
): Promise<void> {
  const games = await getGames();

  const updatedGames = games.filter(
    (game) => game.id !== id
  );

  await saveGames(updatedGames);
}

// Complete / uncomplete a game
export async function toggleGame(
  id: string
): Promise<void> {
  const games = await getGames();

  const updatedGames = games.map((game) => {
    if (game.id === id) {
      return {
        ...game,
        completed: !game.completed,
      };
    }

    return game;
  });

  await saveGames(updatedGames);
}
```
