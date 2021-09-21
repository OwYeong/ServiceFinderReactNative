import React from 'react';
import {Dimensions, FlatList, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

const PhotoListingComponent = ({dataList}) => {
    const windowWidth = Dimensions.get('window').width;

    return (
        <FlatList
            nestedScrollEnabled
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
            renderItem={({item}) => (
                <TouchableHighlight
                    style={{
                        flex: 1,
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
