import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const colorsByType: { [key: string]: string } = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string;
    other: {
      "official-artwork": { front_default: string };
    };
  };
  flavorText?: string;
}

export default function Details() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) {
      fetchPokemonDetails(name);
    }
  }, [name]);

  async function fetchPokemonDetails(pokemonName: string) {
    try {
      // Fetch chi tiết pokemon chính
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      const data = await res.json();

      // Fetch flavor text từ species (tiếng Anh mới nhất)
      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();
      const englishFlavor = speciesData.flavor_text_entries
        .reverse()
        .find((entry: any) => entry.language.name === "en");
      const flavorText = englishFlavor
        ? englishFlavor.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ")
        : "No description available.";

      setPokemon({
        ...data,
        flavorText,
      });
    } catch (error) {
      console.error("Error fetching pokemon details:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không tìm thấy Pokémon!</Text>
      </View>
    );
  }

  const mainType = pokemon.types[0].type.name;
  const backgroundColor = colorsByType[mainType] + "80"; // +80 để trong suốt

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Ảnh lớn */}
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />

        {/* Thông tin cơ bản */}
        <Text style={styles.name}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>
        <Text style={styles.id}>#{String(pokemon.id).padStart(3, "0")}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
          </View>
        </View>

        {/* Types */}
        <Text style={styles.sectionTitle}>Types</Text>
        <View style={styles.typesContainer}>
          {pokemon.types.map((t) => (
            <View
              key={t.type.name}
              style={[
                styles.typeBadge,
                { backgroundColor: colorsByType[t.type.name] },
              ]}
            >
              <Text style={styles.typeText}>
                {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Base Stats</Text>
        {pokemon.stats.map((stat) => (
          <View key={stat.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>
              {stat.stat.name.replace("-", " ").toUpperCase()}
            </Text>
            <View style={styles.statBarBackground}>
              <View
                style={[
                  styles.statBar,
                  {
                    width: `${(stat.base_stat / 255) * 100}%`,
                    backgroundColor: colorsByType[mainType],
                  },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{stat.base_stat}</Text>
          </View>
        ))}

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{pokemon.flavorText}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  id: {
    fontSize: 20,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  infoItem: {
    alignItems: "center",
  },
  infoLabel: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 16,
  },
  infoValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 10,
  },
  typesContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 6,
  },
  statName: {
    width: 100,
    color: "#fff",
    fontSize: 16,
  },
  statBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#ffffff40",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  statBar: {
    height: "100%",
    borderRadius: 5,
  },
  statValue: {
    width: 40,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "right",
  },
  description: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 24,
    textAlign: "center",
    marginTop: 10,
  },
});