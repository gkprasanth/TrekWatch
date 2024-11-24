import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { travelData } from '@/app/data/sampleData';
import TravelCard from '@/components/TravelCard';
import { useRouter } from 'expo-router';

const Home = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(travelData);
    const [selectedCategory, setSelectedCategory] = useState('all'); // Track selected category
    const router = useRouter(); // useRouter for navigation

    // Handle Search Logic
    const handleSearch = (text) => {
        setSearchText(text);
        filterData(text, selectedCategory); // Filter data based on both search and category
    };

    // Handle Category Selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        filterData(searchText, category); // Filter data based on both search and category
    };

    // Filter data based on search and category
    const filterData = (search, category) => {
        let filtered = travelData;

        // Filter by category
        if (category !== 'all') {
            filtered = filtered.filter((categoryItem) => categoryItem.category === category);
        }

        // Filter by search text
        if (search.trim() !== '') {
            filtered = filtered.map((category) => {
                const filteredPlaces = category.places.filter((place) =>
                    place.place.toLowerCase().includes(search.toLowerCase())
                );
                return { ...category, places: filteredPlaces };
            }).filter((category) => category.places.length > 0);
        }

        setFilteredData(filtered);
    };

    const handleCardClick = (id) => {
        router.push(`/${id}`); // Navigate using router.push
    };

    // Get unique categories for the filter
    const categories = ['all', ...new Set(travelData.map((category) => category.category))];

    return (
        <ImageBackground
            source={{ uri: 'https://static.vecteezy.com/system/resources/previews/030/318/046/non_2x/natures-marvel-active-tourist-on-rocks-admiring-lush-mountains-epitomizes-trekking-adventure-vertical-mobile-wallpaper-ai-generated-free-photo.jpg' }}
            style={styles.background}
            imageStyle={{
                opacity: 0.5
            }}
        >
            <ScrollView style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.title}>TrekWatch</Text>
                </View>

                {/* Search Bar */}
                <TextInput
                    placeholder="Search for places..."
                    style={styles.searchBar}
                    value={searchText}
                    onChangeText={handleSearch}
                />

                {/* Category Filter - Moved Below Search Bar */}
                <View style={styles.categoryContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
                            onPress={() => handleCategorySelect(category)}
                        >
                            <Text style={styles.categoryButtonText}>{category === 'all' ? 'All' : category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Categories and Travel Cards - Cards horizontally scrollable */}
                {filteredData.map((category) => (
                    <View key={category.id} style={styles.categoryContainerColumn}>
                        <Text style={styles.categoryTitle}>{category.category}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.cardContainer}>
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
                            </View>
                        </ScrollView>
                    </View>
                ))}

                {/* No Results Message */}
                {filteredData.length === 0 && (
                    <Text style={styles.noResultsText}>No places found for "{searchText}".</Text>
                )}
            </ScrollView>
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 8,
        flexWrap: 'wrap',
    },
    categoryButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    categoryButtonText: {
        fontSize: 14,
        color: '#333',
    },
    selectedCategory: {
        backgroundColor: '#00BFFF',
    },
    searchBar: {
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 16,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardContainer: {
        flexDirection: 'row', // Cards should be aligned horizontally
    },
    categoryContainerColumn: {
        flexDirection: 'column', // Category title and cards section stacked vertically
        marginBottom: 16, // Added margin to space out different categories
    },
    noResultsText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginVertical: 16,
    },
});

export default Home;
