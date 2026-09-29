import AsyncStorage from "@react-native-async-storage/async-storage";

export type Game = {
  id: string;
  title: string;
  rating: string;
  completed: boolean;
};

const STORAGE_KEY = "games";

let games: Game[] = [];

export const getGames = (): Game[] => {
  return games;
};

export const loadGames = async (): Promise<Game[]> => {
  try {
    const savedGames = await AsyncStorage.getItem(STORAGE_KEY);

    if (savedGames !== null) {
      games = JSON.parse(savedGames) as Game[];
    } else {
      games = [];
    }
  } catch (error) {
    console.log("Error loading games:", error);
    games = [];
  }

  return games;
};

export const addGame = async (
  title: string,
  rating: string
): Promise<void> => {
  const newGame: Game = {
    id: Date.now().toString(),
    title: title.trim(),
    rating: rating.trim() || "Not Rated",
    completed: false,
  };

  games = [...games, newGame];

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(games)
  );
};

export const deleteGame = async (
  id: string
): Promise<void> => {
  games = games.filter((game) => game.id !== id);

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(games)
  );
};

export const toggleGame = async (
  id: string
): Promise<void> => {
  games = games.map((game) =>
    game.id === id
      ? {
          ...game,
          completed: !game.completed,
        }
      : game
  );

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(games)
  );
};