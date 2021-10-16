import {useNavigation} from '@react-navigation/core';
import {CustomColors, CustomTypography} from '@styles';
import CommonFunction from '@utils/CommonFunction';
import React, {useEffect, useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View, Image, UIManager, LayoutAnimation} from 'react-native';
import {IconButton, TouchableRipple} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import NoResultIllustration from '@assets/images/no-result-found-illustration';
import {TERMINATORLESS_TYPES, VISITOR_KEYS} from '@babel/types';
import ProviderService from '@services/ProviderService';
import {Rating} from 'react-native-ratings';
import _ from 'lodash';
import SearchingSkeleton from '@organisms/SearchingSkeleton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BrowseVendorByCategory = ({route}) => {
    const navigation = useNavigation();

    const businessCategory = route.params.businessCategory;
    const serviceType = route.params.serviceType;
    const [isFetchingData, setIsFetchingData] = useState(true);

    const [matchedServiceProviders, setMatchedServiceProviders] = useState([]);
    useEffect(() => {
        if (!!businessCategory)
            ProviderService.getProviderByBusinessCategory(businessCategory)
                .then(res => {
                    setMatchedServiceProviders(res.data);

                    setTimeout(() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setIsFetchingData(false);
                    }, 1000);
                    console.log(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        if (!!serviceType)
            ProviderService.getProviderByServiceType(serviceType)
                .then(res => {
                    setMatchedServiceProviders(res.data);
                    setTimeout(() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setIsFetchingData(false);
                    }, 1000);
                })
                .catch(err => {
                    console.log(err);
                });

        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
    }, []);

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={styles.bigContainer}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 16,
                        }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: -16}}>
                            <IconButton
                                icon="arrow-back"
                                color={CustomColors.GRAY_DARK}
                                size={CustomTypography.ICON_SMALL}
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                    fontSize: CustomTypography.FONT_SIZE_16,
                                }}>
                                {CommonFunction.getDisplayNameForServiceType(serviceType) ||
                                    CommonFunction.getDisplayNameForBusinessCategory(businessCategory)}
                            </Text>
                        </View>
                    </View>
                    <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                        <View
                            style={{
                                width: '100%',
                                height: '100%',
                                flex: 1,
                                backgroundColor: CustomColors.WHITE,
                                paddingBottom: 24,
                            }}>
                            <View
                                style={{
                                    width: '100%',
                                    height: 12,
                                    backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                                    marginBottom: 24,
                                }}></View>

                            {isFetchingData ? (
                                <>
                                    <SearchingSkeleton />
                                    <SearchingSkeleton style={{marginTop: 16}} />
                                    <SearchingSkeleton style={{marginTop: 16}} />
                                    <SearchingSkeleton style={{marginTop: 16}} />
                                </>
                            ) : null}

                            {!isFetchingData &&
                                matchedServiceProviders.map(providerInfo => (
                                    <TouchableRipple
                                        onPress={() => {
                                            navigation.navigate('ViewServiceProvider', {providerId: providerInfo.id});
                                            
                                        }}
                                        key={providerInfo.id}>
                                        <View
                                            style={{flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16}}
                                            key={providerInfo.id}>
                                            <View
                                                elevation={2}
                                                style={{
                                                    width: 108,
                                                    height: 108,
                                                    borderRadius: 8,
                                                    overflow: 'hidden',
                                                    backgroundColor: CustomColors.GRAY,
                                                }}>
                                                <Image
                                                    style={{
                                                        width: 108,
                                                        height: 108,
                                                        aspectRatio: 1,
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                    }}
                                                    source={require('@assets/images/default-profileImage.png')}
                                                />
                                                {!!providerInfo?.businessLogoUrl ? (
                                                    <Image
                                                        style={{width: '100%', height: undefined, aspectRatio: 1}}
                                                        source={{uri: providerInfo.businessLogoUrl}}
                                                    />
                                                ) : null}
                                            </View>
                                            <View style={{flex: 1, paddingLeft: 12}}>
                                                <Text
                                                    style={{
                                                        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                        fontSize: CustomTypography.FONT_SIZE_14,
                                                        color: CustomColors.GRAY_DARK,
                                                    }}>
                                                    {_.truncate(providerInfo.businessName, {
                                                        length: 28,
                                                    })}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                        fontSize: CustomTypography.FONT_SIZE_12,
                                                        color: CustomColors.GRAY,
                                                    }}>
                                                    {CommonFunction.getDisplayNameForServiceType(
                                                        providerInfo.serviceType,
                                                    )}
                                                </Text>
                                                <View style={{alignItems: 'flex-start', marginTop: 5}}>
                                                    {!!providerInfo?.starStats &&
                                                    Object.values(providerInfo?.starStats).reduce((a, b) => a + b) >
                                                        0 ? (
                                                        <View
                                                            style={{
                                                                width: '100%',
                                                                flexDirection: 'row',
                                                                alignItems: 'space-between',
                                                                justifyContent: 'space-between',
                                                            }}>
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: 'flex-start',
                                                                }}>
                                                                <Rating
                                                                    type="custom"
                                                                    startingValue={providerInfo.averageRatings}
                                                                    isDisabled={true}
                                                                    showRating={false}
                                                                    imageSize={12}
                                                                    readonly
                                                                />
                                                                <Text
                                                                    style={{
                                                                        fontFamily:
                                                                            CustomTypography.FONT_FAMILY_REGULAR,
                                                                        fontSize: 11,
                                                                        marginLeft: 10,
                                                                        marginTop: -2,
                                                                        color: CustomColors.GRAY,
                                                                    }}>
                                                                    ·{'  '} {providerInfo.averageRatings}
                                                                </Text>
                                                            </View>
                                                            <MaterialIcons
                                                                name="chevron-right"
                                                                size={16}
                                                                color={CustomColors.GRAY}
                                                            />
                                                        </View>
                                                    ) : (
                                                        <Text
                                                            style={{
                                                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                                fontSize: CustomTypography.FONT_SIZE_12,
                                                                color: CustomColors.GRAY,
                                                            }}>
                                                            No rating yet
                                                        </Text>
                                                    )}
                                                </View>

                                                <Text
                                                    style={{
                                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                        fontSize: 11,
                                                        color: CustomColors.GRAY,
                                                        marginTop: 6,
                                                    }}>
                                                    Price range RM{providerInfo.priceStart} ~ RM{providerInfo.priceEnd}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                        fontSize: 11,
                                                        color: CustomColors.GRAY,
                                                    }}>
                                                    Click for more info{'>>'}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableRipple>
                                ))}

                            {matchedServiceProviders.length == 0 && !isFetchingData ? (
                                <View style={{paddingVertical: 100}}>
                                    <View style={{alignItems: 'center'}}>
                                        <View style={{width: 250, height: undefined, aspectRatio: 401 / 305}}>
                                            <NoResultIllustration fill="#fff" />
                                        </View>
                                    </View>
                                    <Text
                                        style={{
                                            fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                            fontSize: 13,
                                            color: CustomColors.GRAY_DARK,
                                            textAlign: 'center',
                                            marginTop: 24,
                                        }}>
                                        We cant find service provider with this category
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                            fontSize: CustomTypography.FONT_SIZE_12,
                                            color: CustomColors.GRAY,
                                            textAlign: 'center',
                                            marginTop: 6,
                                        }}>
                                        Sorry, please search again later or try to{'\n'}search for another category.
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default BrowseVendorByCategory;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
    },
});
