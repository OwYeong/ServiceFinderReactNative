import UserService from '@services/UserService';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ImageBackground,
    RefreshControl,
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import {showMessage} from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import ReviewDisplayComponent from '@organisms/ReviewDisplayComponent';
import Stars from 'react-native-stars';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProviderInfoDisplay from '@organisms/ProviderInfoDisplay';
import ChatService from '@services/ChatService';

const ViewServiceProvider = ({route}) => {
    const navigation = useNavigation();

    const providerId = route.params.providerId;

    const [providerInfo, setProviderInfo] = useState(null);

    const [isBusinessLogoLoading, setIsBusinessLogoLoading] = useState(false);
    const [isCoverImgLoading, setIsCoverImgLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [photosList, setPhotosList] = useState([]);
    const [reviewList, setReviewList] = useState([]);
    const [statusBarContent, setStatusBarContent] = useState('light-content');
    const [isFetchingData, setIsFetchingData] = useState(true);

    const [navigationState, setNavigationState] = useState({
        index: 0,
        routes: [
            {key: 'about', title: 'About Us'},
            {key: 'photos', title: 'Posts'},
            {key: 'reviews', title: 'Reviews'},
        ],
    });
    const [tabBarOffsetY, setTabBarOffsetY] = useState(0);
    const [isPhotoListingScrollable, setIsPhotoListingScrollable] = useState(false);

    const fetchPostAndReviewData = async () => {
        try {
            const photoListData = await ProviderService.getAllPost(providerId);

            setPhotosList(photoListData.data);

            const reviewData = await ReviewService.getAllReview(providerId);

            setReviewList(reviewData.data);

            console.log(photoListData.data) 
            
            console.log(reviewData.data) 
            return true;    
        } catch (error) {

            console.log(error)
            return true;
        }
    };
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        fetchPostAndReviewData();
        
        setRefreshing(false);

    }, []);

    useEffect(() => {
        const unsubscriber = ProviderService.getProviderById(data => {
            setProviderInfo(data);

            setTimeout(() => {
                setIsFetchingData(false);
            }, 1000);
        }, providerId);

        fetchPostAndReviewData();

        return () => {
            unsubscriber();
        };
    }, []);

    return (
        <View style={{backgroundColor: 'transparent'}}>
            <StatusBar barStyle={statusBarContent} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}} edges={['right', 'bottom', 'left']}>
                <ScrollView
                    style={{flex: 1}}
                    onScroll={event => {
                        console.log(event.nativeEvent.contentOffset.y, ' > ', tabBarOffsetY - 30);
                        if (event.nativeEvent.contentOffset.y > tabBarOffsetY - 30) {
                            setIsPhotoListingScrollable(true);

                            setStatusBarContent('dark-content');
                        } else {
                            setIsPhotoListingScrollable(false);
                            setStatusBarContent('light-content');
                        }
                    }}
                    contentContainerStyle={{flexGrow: 1}}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={20} />
                    }
                    nestedScrollEnabled={true}>
                    <View style={styles.bigContainer}>
                        <View style={styles.imageContainer}>
                            <View>
                                <SkeletonPlaceholder>
                                    <View
                                        style={{
                                            width: '100%',
                                            aspectRatio: 3 / 2,
                                            height: undefined,
                                            overflow: 'hidden',
                                        }}></View>
                                </SkeletonPlaceholder>

                                {!isFetchingData ? (
                                    <View style={{width: '100%', position: 'absolute', top: 0, left: 0}}>
                                        <ImageBackground
                                            style={[styles.coverImage]}
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
                                        <View
                                            style={{
                                                position: 'absolute',
                                                left: 6,
                                                right: 6,
                                                top: 24,
                                                zIndex: 100,
                                            }}>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}>
                                                    <IconButton
                                                        icon="arrow-back"
                                                        color={CustomColors.WHITE}
                                                        size={CustomTypography.ICON_SMALL}
                                                        onPress={() => {
                                                            navigation.goBack();
                                                        }}
                                                    />
                                                </View>
                                                <Text
                                                    style={{
                                                        flex: 1,
                                                        color: 'white',
                                                        textAlign: 'center',
                                                        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                        fontSize: CustomTypography.FONT_SIZE_16,
                                                    }}>
                                                    {CommonFunction.getDisplayNameForServiceType(
                                                        providerInfo?.serviceType,
                                                    )}
                                                </Text>
                                                <View style={{}}>
                                                    <IconButton
                                                        icon={() => (
                                                            <Ionicons
                                                                name="chatbubble-ellipses"
                                                                size={30}
                                                                color={CustomColors.WHITE}
                                                            />
                                                        )}
                                                        color={CustomColors.WHITE}
                                                        size={30}
                                                        onPress={async () => {
                                                            try {
                                                                const chatroomId = await ChatService.getChatroomIdBetweenTwoUser(providerInfo.id);
                    
                                                                navigation.navigate('Chatroom', {
                                                                    chatroomId: chatroomId,
                                                                })
                                                            } catch (error) {
                                                                console.log(error);
                                                            }
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{marginTop: -16}}>
                                                {Object.values(providerInfo.starStats).reduce((a, b) => a + b) == 0 ? (
                                                    <Text
                                                        style={{
                                                            color: CustomColors.GRAY_LIGHT,
                                                            textAlign: 'center',
                                                            fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                            fontSize: CustomTypography.FONT_SIZE_12,
                                                        }}>
                                                        No ratings Yet
                                                    </Text>
                                                ) : (
                                                    <Stars
                                                        display={providerInfo?.averageRatings}
                                                        spacing={2}
                                                        count={5}
                                                        starSize={25}
                                                        fullStar={require('@assets/images/full-star.png')}
                                                        halfStar={require('@assets/images/half-star.png')}
                                                        emptyStar={require('@assets/images/empty-star.png')}
                                                    />
                                                )}
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                            }}></View>
                                    </View>
                                ) : null}
                            </View>
                            <View style={[styles.businessProfileImageWrapper]}>
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
                                    {!isFetchingData ? (
                                        <Image
                                            style={[styles.businessProfileImage]}
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
                                    ) : null}
                                </View>
                            </View>
                        </View>

                        {isFetchingData ? (
                            <SkeletonPlaceholder>
                                <View
                                    style={{
                                        width: '80%',
                                        height: 26,
                                        marginHorizontal: '10%',
                                        overflow: 'hidden',
                                    }}></View>
                            </SkeletonPlaceholder>
                        ) : (
                            <Text style={styles.businessName}>{providerInfo?.businessName}</Text>
                        )}

                        {isFetchingData ? (
                            <SkeletonPlaceholder>
                                <View
                                    style={{
                                        marginTop: 8,
                                        width: '60%',
                                        height: 16,
                                        marginHorizontal: '20%',
                                        overflow: 'hidden',
                                    }}></View>
                            </SkeletonPlaceholder>
                        ) : (
                            <Text style={styles.pricing}>
                                Starting from RM{providerInfo?.priceStart} to RM{providerInfo?.priceEnd}
                            </Text>
                        )}

                        {isFetchingData ? null : (
                            <View style={styles.actionBtnContainer}>
                                <Button
                                    style={{
                                        flex: 1,
                                        marginRight: 8,
                                        borderRadius: 8,
                                        backgroundColor: CustomColors.PRIMARY_BLUE,

                                        elevation: 1,
                                    }}
                                    contentStyle={{
                                        height: 40,
                                    }}
                                    labelStyle={{
                                        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                    }}
                                    dark
                                    mode="contained"
                                    onPress={() => {
                                        navigation.navigate('BookServicePage', {providerId: providerId});
                                    }}>
                                    Book Now
                                </Button>
                            </View>
                        )}

                        <View
                            style={{
                                height: 36,
                            }}
                        />

                        <View
                            onLayout={event => {
                                var {x, y, width, height} = event.nativeEvent.layout;

                                setTabBarOffsetY(y);
                            }}></View>

                        {isFetchingData ? (
                            <SkeletonPlaceholder>
                                <View
                                    style={{
                                        marginTop: 8,
                                        width: '100%',
                                        height: Dimensions.get('window').height,
                                        overflow: 'hidden',
                                    }}></View>
                            </SkeletonPlaceholder>
                        ) : (
                            <TabView
                                style={{height: Dimensions.get('window').height + 2}}
                                navigationState={navigationState}
                                renderScene={({route}) => {
                                    switch (route.key) {
                                        case 'about':
                                            return (
                                                <ProviderInfoDisplay
                                                    providerInfo={providerInfo}
                                                    isScrollEnabled={isPhotoListingScrollable}
                                                />
                                            );
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
                                                    averageRating={providerInfo?.averageRatings || 0}
                                                    starStats={
                                                        providerInfo?.starStats || {
                                                            numOf1Star: 0,
                                                            numOf2Star: 0,
                                                            numOf3Star: 0,
                                                            numOf4Star: 0,
                                                            numOf5Star: 0,
                                                        }
                                                    }
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
                            />
                        )}
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
        aspectRatio: 3 / 2,
        backgroundColor: 'white',
    },
    businessProfileImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        marginTop: -175,
        backgroundColor: 'white',
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
        paddingHorizontal: 16,
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
    backIcon: {
        marginLeft: -8,
    },
});
