import UserService from '@services/UserService';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import {CustomColors, CustomMixins, CustomTypography} from '@styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {Button, IconButton} from 'react-native-paper';
import CommonFunction from '@utils/CommonFunction';
import {TabView, TabBar, SceneMap, PagerPan} from 'react-native-tab-view';

import PhotoListingComponent from '@organisms/PhotoListingComponent';
import ProviderService from '@services/ProviderService';
import ReviewService from '@services/ReviewService';

import BottomSheet from 'react-native-bottomsheet-reanimated';
// import BottomSheet, {BottomSheetBackdrop, useBottomSheetTimingConfigs, BottomSheetView} from '@gorhom/bottom-sheet';
import ImageCropPicker from 'react-native-image-crop-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Portal} from '@gorhom/portal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import {showMessage} from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import ReviewDisplayComponent from '@organisms/ReviewDisplayComponent';

const ViewServiceProvider = ({route}) => {
    const navigation = useNavigation();

    const providerId = route.params.providerId;

    const [providerInfo, setProviderInfo] = useState(null);

    const [isBusinessLogoLoading, setIsBusinessLogoLoading] = useState(false);
    const [isCoverImgLoading, setIsCoverImgLoading] = useState(false);

    useEffect(() => {
        const unsubscriber = ProviderService.getProviderById(setProviderInfo, providerId);

        return () => {
            unsubscriber();
        };
    }, []);

    return (
        <View style={{backgroundColor: 'transparent'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} barStyle={"light-content"} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}} edges={['right', 'bottom', 'left',]}>
                <ScrollView
                    style={{flex: 1}}
                    onScroll={event => {
                        // console.log(event.nativeEvent.contentOffset.y, ' > ', tabBarOffsetY);
                        // if (event.nativeEvent.contentOffset.y > tabBarOffsetY) {
                        //     setIsPhotoListingScrollable(true);
                        // } else {
                        //     setIsPhotoListingScrollable(false);
                        // }
                    }}
                    contentContainerStyle={{flexGrow: 1}}
                    nestedScrollEnabled={true}>
                    <View style={styles.bigContainer}>
                        <View style={styles.imageContainer}>
                            <View>
                                <SkeletonPlaceholder>
                                    <View
                                        style={{
                                            width: '100%',
                                            aspectRatio: 3.5 / 2,
                                            height: undefined,
                                            overflow: 'hidden',
                                        }}></View>
                                </SkeletonPlaceholder>
                                <Image
                                    style={[styles.coverImage, {opacity: isCoverImgLoading ? 0 : 1}]}
                                    source={
                                        !!providerInfo?.coverImgUrl
                                            ? {uri: providerInfo?.coverImgUrl}
                                            : require('@assets/images/default-coverImage.png')
                                    }
                                    onLoadStart={() => {
                                        console.log('image load start');
                                        setIsCoverImgLoading(true);
                                    }}
                                    onLoadEnd={() => {
                                        console.log('image load end');
                                        setIsCoverImgLoading(false);
                                    }}
                                    resizeMode="cover"
                                />
                            </View>
                            <TouchableHighlight
                                style={[styles.businessProfileImageWrapper]}
                                onPress={() => {
                                    businessLogoActionSheet.current?.snapTo(1);
                                }}
                                activeOpacity={0.6}
                                underlayColor="#FFFFFF">
                                <View>
                                    <SkeletonPlaceholder>
                                        <View
                                            style={{
                                                width: 180,
                                                height: 180,
                                                marginLeft: -5,
                                                marginTop: -5,
                                                borderRadius: 90,
                                                overflow: 'hidden',
                                            }}></View>
                                    </SkeletonPlaceholder>
                                    <Image
                                        style={[styles.businessProfileImage, {opacity: isBusinessLogoLoading ? 0 : 1}]}
                                        onLoadStart={() => {
                                            console.log('image load start');
                                            setIsBusinessLogoLoading(true);
                                        }}
                                        onLoadEnd={() => {
                                            console.log('image load end');
                                            setIsBusinessLogoLoading(false);
                                        }}
                                        source={
                                            !!providerInfo?.businessLogoUrl
                                                ? {uri: providerInfo?.businessLogoUrl}
                                                : require('@assets/images/default-profileImage.png')
                                        }
                                    />
                                </View>
                            </TouchableHighlight>
                        </View>
                        <Text style={styles.businessName}>{providerInfo?.businessName}</Text>
                        <Text style={styles.serviceType}>
                            {CommonFunction.getDisplayNameForServiceType(providerInfo?.serviceType)}
                        </Text>
                        <Text style={styles.pricing}>
                            Starting from RM{providerInfo?.priceStart} to RM{providerInfo?.priceEnd}
                        </Text>
                        <View style={styles.actionBtnContainer}>
                            <Button
                                style={{
                                    flex: 1,
                                    marginRight: 8,
                                    borderRadius: 8,
                                    backgroundColor: CustomColors.GRAY_LIGHT,

                                    elevation: 1,
                                }}
                                contentStyle={{
                                    height: 40,
                                }}
                                labelStyle={{
                                    fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                    marginTop: 10,
                                    color: CustomColors.GRAY_DARK,
                                }}
                                icon="mode-edit"
                                mode="contained"
                                uppercase={false}
                                onPress={() => {
                                    navigation.navigate('BusinessProfileEdit');
                                }}>
                                Edit Business Profile
                            </Button>
                            <IconButton
                                style={{
                                    backgroundColor: CustomColors.GRAY_LIGHT,
                                    borderRadius: 8,
                                    margin: 0,
                                    height: 40,
                                    width: 60,
                                    elevation: 1,
                                }}
                                icon="more-horiz"
                                color={CustomColors.GRAY_DARK}
                                size={24}
                                onPress={() => {
                                    serviceProviderProfileActionSheet.current?.snapTo(1);
                                }}
                            />
                        </View>

                        <View
                            style={{
                                marginTop: 24,
                                borderBottomColor: CustomColors.GRAY_LIGHT,
                                borderBottomWidth: 2,
                            }}
                        />
                        <View style={styles.businessInfoContainer}>
                            <Text style={styles.title}>Business description</Text>
                            <Text style={styles.desc}>{providerInfo?.businessDesc}</Text>
                            <Text style={styles.title}>Service Description</Text>
                            <Text style={styles.desc}>{providerInfo?.businessServiceDesc}</Text>
                        </View>

                        {/* <Button
                                onPress={async () => {
                                    UserService.logOut();
                                }}
                                title="LogOut">
                                logout  
                            </Button> */}
                        <View
                            onLayout={event => {
                                var {x, y, width, height} = event.nativeEvent.layout;

                                // setTabBarOffsetY(y);
                            }}></View>
                        {/* <TabView
                            style={{height: Dimensions.get('window').height - 64 - 24}}
                            navigationState={navigationState}
                            renderScene={({route}) => {
                                switch (route.key) {
                                    case 'photos':
                                        return (
                                            <PhotoListingComponent
                                                dataList={photosList}
                                                isScrollEnabled={isPhotoListingScrollable}
                                            />
                                        );
                                    case 'reviews':
                                        return (
                                            <ReviewDisplayComponent
                                                dataList={reviewList}
                                                averageRating={providerInfo?.averageRatings}
                                                starStats={providerInfo?.starStats}
                                            />
                                        );
                                    default:
                                        return null;
                                }
                            }}
                            renderTabBar={props => {
                                return (
                                    <TabBar
                                        {...props}
                                        inactiveColor={CustomColors.GRAY}
                                        indicatorStyle={{backgroundColor: CustomColors.GRAY_DARK}}
                                        style={{backgroundColor: 'white', elevation: 0}}
                                        labelStyle={{
                                            fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                            fontSize: CustomTypography.FONT_SIZE_16,
                                            color: CustomColors.GRAY_DARK,
                                        }}
                                    />
                                );
                            }}
                            onIndexChange={index => {
                                setNavigationState({...navigationState, index: index});
                            }}
                            renderPager={props => <PagerPan {...props} />}
                            initialLayout={{
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').height - 64 - 50,
                            }}
                        /> */}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ViewServiceProvider;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
    },
    imageContainer: {
        width: '100%',
        paddingBottom: 90,
        marginBottom: 8,
    },
    coverImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 3.5 / 2,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    businessProfileImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        marginTop: -175,
    },
    businessProfileImageWrapper: {
        width: 180,
        height: 180,
        borderRadius: 100,
        overflow: 'hidden',
        borderWidth: 5,
        borderColor: CustomColors.WHITE,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
    },
    businessName: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_26,
        color: CustomColors.GRAY_DARK,
        justifyContent: 'center',
        textAlign: 'center',
    },
    serviceType: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_DARK,
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: -5,
    },
    pricing: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.GRAY,
        justifyContent: 'center',
        textAlign: 'center',
    },
    actionBtnContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    title: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.GRAY_DARK,
        marginTop: 20,
    },
    desc: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_DARK,
    },
    actionButton: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    actionButtonLabel: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.GRAY_DARK,
        marginHorizontal: 16,
    },
});
