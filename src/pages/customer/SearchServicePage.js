import React from 'react';
import {Button, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const SearchServicePage = () => {
    return (
        <View style={styles.bigContainer}>
            <StatusBar animated barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <Text>I am the Search Page</Text>
                <Searchbar
                    style={styles.searchBar}
                    inputStyle={{padding: 0, margin: 0, fontSize: 14}}
                    onFocus={() => {}}
                    icon={() => <FeatherIcon name="search" size={20} />}
                    clearIcon={() => <MaterialIcon name="cancel" size={20} />}
                    placeholder="Find your service"
                />
            </SafeAreaView>
        </View>
    );
};

export default SearchServicePage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'white',
    },
    searchBar: {
        width: '80%',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 16,
        height: 40,
    },
});
