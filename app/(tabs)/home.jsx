import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import { travelData } from '@/app/data/sampleData';
import TravelCard from '@/components/TravelCard';
import { useRouter } from 'expo-router';

const Home = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(travelData);
    const router = useRouter(); // useRouter for navigation

    // Handle Search Logic
    const handleSearch = (text) => {
        setSearchText(text);
        if (text.trim() === '') {
            setFilteredData(travelData); // Reset to original data
            return;
        }

        const filtered = travelData
            .map((category) => {
                const filteredPlaces = category.places.filter((place) =>
                    place.place.toLowerCase().includes(text.toLowerCase())
                );
                return { ...category, places: filteredPlaces };
            })
            .filter((category) => category.places.length > 0);

        setFilteredData(filtered);
    };

    const handleCardClick = (id) => {
        router.push(`/${id}`); // Navigate using router.push
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/50x50.png?text=Logo' }}
                    style={styles.logo}
                />
                <Text style={styles.title}>TrekWatch</Text>
            </View>

            {/* Search Bar */}
            <TextInput
                placeholder="Search for places..."
                style={styles.searchBar}
                value={searchText}
                onChangeText={handleSearch}
            />

            {/* Categories and Travel Cards */}
            {filteredData.map((category) => (
                <View key={category.id} style={styles.categoryContainer}>
                    <Text style={styles.categoryTitle}>{category.category}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {category.places.map((place) => (
                            <View key={place.id}>
                                <TravelCard
                                    place={place.place}
                                    description={place.description}
                                    image={place.image}
                                    onPress={() => handleCardClick(place.id)} // Pass navigation function
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            ))}

            {/* No Results Message */}
            {filteredData.length === 0 && (
                <Text style={styles.noResultsText}>No places found for "{searchText}".</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    searchBar: {
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 16,
    },
    categoryContainer: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    noResultsText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginVertical: 16,
    },
});

export default Home;