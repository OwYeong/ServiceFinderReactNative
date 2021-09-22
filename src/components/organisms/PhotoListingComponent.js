import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

const PhotoListingComponent = ({dataList, isScrollEnabled = true}) => {
    return (
        <FlatList
            scrollEnabled={isScrollEnabled}
            nestedScrollEnabled={true}
            data={[
                ...dataList,
                ...dataList,
                ...dataList,
                ...dataList,
                ...dataList,
                ...dataList,
                ...dataList,
                ...dataList,
                ...dataList,
            ]}
            renderItem={({item, index}) => (
                <TouchableHighlight
                    style={{
                        flex: 1 / 3,
                        borderWidth: 1,
                        borderColor: 'white',
                    }}
                    onPress={() => {
                        // coverImageActionSheet.current.snapTo(1);
                    }}
                    activeOpacity={0.6}
                    underlayColor="#000000">
                    <View>
                        <Image style={styles.imageThumbnail} source={{uri: item.imageUrl}} />
                    </View>
                </TouchableHighlight>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index}
        />
    );
};

export default PhotoListingComponent;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'white',
    },
    imageThumbnail: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
});
