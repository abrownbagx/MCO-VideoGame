import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Explore</Text>

      <Text style={styles.subtitle}>
        Discover and manage your favorite video games.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎮 GameTrack</Text>
        <Text style={styles.cardText}>
          Keep track of your games, ratings, and completion progress.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/')}
      >
        <Text style={styles.buttonText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 18,
    color: '#555',
    lineHeight: 26,
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginBottom: 30,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  cardText: {
    fontSize: 17,
    color: '#555',
    lineHeight: 25,
  },

  button: {
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});