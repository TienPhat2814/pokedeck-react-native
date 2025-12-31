import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";


export default function Index() {
    const params = useLocalSearchParams();

    console.log(params.name);

    useEffect(() => {}, []);

    async function fetchPokemonByName() {
        // try {
            
        // } catch (error) {
            
        // }
    }

    return (
        <ScrollView
            contentContainerStyle={{
                gap: 16,
                padding: 16,
            }}
        >
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
