import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorsByType: Record<string, string> = {
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

// Hàm chuyển hex sang rgba với độ trong suốt
const hexToRgba = (hex: string, alpha: number = 0.2) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemon();
  }, []);

  async function fetchPokemon() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default || details.sprites.other?.["official-artwork"].front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        })
      );

      setPokemons(detailedPokemons);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EE8130" />
        <Text style={styles.loadingText}>Đang tải Pokémon...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pokemons.map((pokemon) => {
        const primaryType = pokemon.types[0].type.name;
        const backgroundColor = hexToRgba(colorsByType[primaryType] || "#A8A77A", 0.3);
        const borderColor = colorsByType[primaryType] || "#A8A77A";

        return (
          <Link
            key={pokemon.name}
            href={{ pathname: "/details", params: { name: pokemon.name } }}
            style={[styles.card, { backgroundColor, borderColor }]}
          >
            <View style={styles.cardContent}>
              {/* Thông tin bên trái */}
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{capitalize(pokemon.name)}</Text>

                {/* Danh sách các type */}
                <View style={styles.typesContainer}>
                  {pokemon.types.map((t) => (
                    <View
                      key={t.type.name}
                      style={[
                        styles.typeBadge,
                        { backgroundColor: colorsByType[t.type.name] || "#777" },
                      ]}
                    >
                      <Text style={styles.typeText}>{capitalize(t.type.name)}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Ảnh Pokémon bên phải */}
              <View style={styles.imageContainer}>
                {pokemon.image ? (
                  <Image source={{ uri: pokemon.image }} style={styles.pokemonImage} />
                ) : (
                  <View style={[styles.pokemonImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>?</Text>
                  </View>
                )}
              </View>
            </View>
          </Link>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#666",
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6, // cho Android
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  imageContainer: {
    marginLeft: 16,
  },
  pokemonImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  placeholderImage: {
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 48,
    color: "#999",
    fontWeight: "bold",
  },
});