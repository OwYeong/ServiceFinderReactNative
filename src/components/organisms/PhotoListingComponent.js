import {useNavigation} from '@react-navigation/core';
import { CustomColors, CustomTypography } from '@styles';
import React, {useEffect, useState} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    YellowBox,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    LogBox,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PhotoListingComponent = ({dataList, isScrollEnabled = true}) => {
    const navigation = useNavigation();
    useEffect(() => {
        LogBox.ignoreLogs([
            'VirtualizedLists should never be nested',
            // name of the error/warning here, or a regex here
        ]);
    }, []);

    return (
        <View>
            {dataList.length > 0 ? (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={isScrollEnabled}
                    nestedScrollEnabled={true}
                    data={dataList}
                    removeClippedSubviews={true}
                    renderItem={({item, index}) => (
                        <TouchableHighlight
                            style={{
                                flex: 1 / 3,
                                borderWidth: 1,
                                borderColor: 'white',
                            }}
                            onPress={() => {
                                navigation.navigate('PostView', {
                                    postData: {
                                        ...item,
                                    },
                                });
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
            ) : (
                <View style={{padding:16, paddingVertical:160,  alignItems:'center'  }}>
                    <FontAwesome size={70} color={CustomColors.GRAY} name="picture-o" />
                    <Text style={{marginTop: 16,fontFamily: CustomTypography.FONT_FAMILY_MEDIUM, fontSize: CustomTypography.FONT_SIZE_24, color:CustomColors.GRAY}}>No Post Yet</Text>
                </View>
            )}
        </View>
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
