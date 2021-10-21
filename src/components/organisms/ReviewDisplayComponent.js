import {useNavigation} from '@react-navigation/core';
import {CustomColors, CustomTypography} from '@styles';
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
import {Avatar, ProgressBar} from 'react-native-paper';
import {Rating, AirbnbRating} from 'react-native-ratings';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

const ReviewDisplayComponent = ({averageRating, starStats, dataList, isScrollEnabled = true}) => {
    const navigation = useNavigation();
    const totalReview = Object.values(starStats).reduce((a, b) => a + b);
    useEffect(() => {
        LogBox.ignoreLogs([
            'VirtualizedLists should never be nested',
            // name of the error/warning here, or a regex here
        ]);
    }, []);

    return (
        <View style={{padding: 16}}>
            <View>
                <Text style={styles.header}>Rating and Overview</Text>
                <View style={{flexDirection: 'row'}}>
                    <View style={{justifyContent: 'center'}}>
                        <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
                        <Rating
                            type="custom"
                            startingValue={averageRating}
                            isDisabled={true}
                            showRating={false}
                            imageSize={14}
                            readonly
                        />
                    </View>
                    <View style={{flex: 1, paddingLeft: 24}}>
                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.ratingNum}>5</Text>
                            <View style={{flex: 1, paddingLeft: 8}}>
                                <ProgressBar
                                    style={{height: 10, borderRadius: 20, backgroundColor: CustomColors.GRAY_LIGHT}}
                                    progress={totalReview > 0 ? starStats.numOf5Star / totalReview : 0}
                                    color="#f1c40f"
                                />
                            </View>
                        </View>
                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.ratingNum}>4</Text>
                            <View style={{flex: 1, paddingLeft: 8}}>
                                <ProgressBar
                                    style={{height: 10, borderRadius: 20, backgroundColor: CustomColors.GRAY_LIGHT}}
                                    progress={totalReview > 0 ? starStats.numOf4Star / totalReview : 0}
                                    color="#f1c40f"
                                />
                            </View>
                        </View>
                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.ratingNum}>3</Text>
                            <View style={{flex: 1, paddingLeft: 8}}>
                                <ProgressBar
                                    style={{height: 10, borderRadius: 20, backgroundColor: CustomColors.GRAY_LIGHT}}
                                    progress={totalReview > 0 ? starStats.numOf3Star / totalReview : 0}
                                    color="#f1c40f"
                                />
                            </View>
                        </View>
                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.ratingNum}>2</Text>
                            <View style={{flex: 1, paddingLeft: 8}}>
                                <ProgressBar
                                    style={{height: 10, borderRadius: 20, backgroundColor: CustomColors.GRAY_LIGHT}}
                                    progress={totalReview > 0 ? starStats.numOf2Star / totalReview : 0}
                                    color="#f1c40f"
                                />
                            </View>
                        </View>
                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.ratingNum}>1</Text>
                            <View style={{flex: 1, paddingLeft: 8}}>
                                <ProgressBar
                                    style={{height: 10, borderRadius: 20, backgroundColor: CustomColors.GRAY_LIGHT}}
                                    progress={totalReview > 0 ? starStats.numOf1Star / totalReview : 0}
                                    color="#f1c40f"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <Text
                style={[
                    styles.header,
                    {
                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                        marginTop: 16,
                        marginBottom: 8,
                    },
                ]}>
                Reviews
            </Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                scrollEnabled={isScrollEnabled}
                nestedScrollEnabled={true}
                data={dataList}
                removeClippedSubviews={true}
                ListHeaderComponent={() =>
                    !dataList.length > 0 ? <View style={styles.noReviewContainer}><MaterialIcons size={60} color={CustomColors.GRAY} name='rate-review'/><Text style={styles.noReviewText}>Oops, there are no reviews yet.</Text></View> : null
                }
                renderItem={({item, index}) => (
                    <View
                        style={{
                            flex: 1,
                            borderTopWidth: 1,
                            borderColor: CustomColors.GRAY,
                            paddingVertical: 16,
                        }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Avatar.Text color={'white'} size={30} label={item.reviewerName.charAt(0)} />
                            <Text style={styles.reviewerName}>{item.reviewerName}</Text>
                            
                        </View>
                        <View
                            style={{
                                marginTop: 8,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}>
                            <Rating
                                type="custom"
                                startingValue={item.numOfStar}
                                isDisabled={true}
                                showRating={false}
                                imageSize={14}
                                readonly
                            />
                            <Text
                                style={{
                                    fontSize: CustomTypography.FONT_SIZE_14,
                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                    color: CustomColors.GRAY,
                                    marginTop: 4,
                                    marginLeft: 8,
                                }}>
                                {moment(new Date(item.postedDateTime)).format('DD-MM-yyyy')}
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: CustomTypography.FONT_SIZE_14,
                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                color: CustomColors.GRAY,
                                marginTop: 8,
                            }}>
                            {item.feedback || 'No Message Given'}
                        </Text>
                    </View>
                )}
                //Setting the number of column
                numColumns={1}
                keyExtractor={(item, index) => index}
            />
        </View>
    );
};

export default ReviewDisplayComponent;

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
    reviewerName: {
        fontSize: CustomTypography.FONT_SIZE_16,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
        marginLeft: 8,
    },
    header: {
        fontSize: CustomTypography.FONT_SIZE_20,
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        color: CustomColors.GRAY_DARK,
    },
    averageRating: {
        fontSize: CustomTypography.FONT_SIZE_26,
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        color: CustomColors.GRAY_DARK,
    },
    ratingNum: {
        fontSize: CustomTypography.FONT_SIZE_12,
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        color: CustomColors.GRAY_DARK,
    },
    noReviewContainer: {
        flex:1,
        width:'100%',
        height:'100%',
        paddingVertical: 30
    },
    noReviewText: {
        fontSize: CustomTypography.FONT_SIZE_16,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY,
        marginTop: 16
    }
});
