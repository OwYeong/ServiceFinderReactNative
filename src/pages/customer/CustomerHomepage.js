import UserService from '@services/UserService';
import React, {useState, useEffect, useRef} from 'react';
import {
    Animated,
    Button,
    Dimensions,
    Easing,
    FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import LinearGradient from 'react-native-linear-gradient';
import {CustomColors, CustomMixins, CustomTypography} from '@styles';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Searchbar, Surface, TouchableRipple} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

import CharacterSvg from '@assets/images/character.svg';
import Cloud1Svg from '@assets/images/cloud-1.svg';
import Cloud2Svg from '@assets/images/cloud-2.svg';
import ProviderService from '@services/ProviderService';
import PopularServiceDisplay from '@organisms/PopularServiceDisplay';
import SearchService from '@services/SearchService';
import {SvgCssUri} from 'react-native-svg';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import PopularServiceDisplaySkeleton from '@organisms/PopularServiceDisplaySkeleton';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import _ from 'lodash';

const moveCloud = {
    0: {
        translateX: 0,
    },
    0.5: {
        translateX: -20,
    },
    1: {
        translateX: 0,
    },
};

const moveCloudReverse = {
    0: {
        translateX: 0,
    },
    0.5: {
        translateX: 20,
    },
    1: {
        translateX: 0,
    },
};

const CustomerHomepage = () => {
    const navigation = useNavigation();
    const userInfo = useSelector(state => state.loginState.userInfo);

    const [popularServiceList, setPopularServiceList] = useState({isLoadingMoreData: false, data: []});
    const [popularServiceFetchBlock, setPopularServiceFetchBlock] = useState(false);
    const [isFetchingPopularService, setIsFetchingPopularService] = useState(true);

    const [serviceCategories, setServiceCategories] = useState([]);
    const [statusBarColor, setStatusBarColor] = useState('transparent');

    const [categoryWrapperWidth, setCategoryWrapperWidth] = useState(0);
    const [popularContainerOffsetY, setPopularContainerOffsetY] = useState(0);
    const popularServiceSpinnerRef = useRef(null);
    const popularServiceFlatlistRef = useRef(null);
    const [searchBarxy, setSearchBarxy] = useState({x: 0, y: 0});

    const fetchPopularServiceData = async () => {
        try {
            const popularServices = await ProviderService.getPopularServiceOfTheMonthWithPagination();
            console.log(popularServices);

            setIsFetchingPopularService(false);
            setPopularServiceList({
                ...popularServiceList,
                lastDocumentInList: popularServices.lastVisibleDocument,
                data: popularServices.data,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const fetchMorePopularServiceData = async () => {
        if (!!popularServiceList.lastDocumentInList) {
            try {
                setTimeout(() => {
                    popularServiceFlatlistRef.current.scrollToEnd();
                }, 20);

                const newPopularServices = await ProviderService.getPopularServiceOfTheMonthWithPagination(
                    popularServiceList.lastDocumentInList,
                );

                console.log('im called');

                setTimeout(() => {
                    setPopularServiceList({
                        isLoadingMoreData: false,
                        lastDocumentInList: newPopularServices.lastVisibleDocument,
                        data: [...popularServiceList.data, ...newPopularServices.data],
                    });

                    if (newPopularServices.data.length == 0) {
                        setTimeout(() => {
                            popularServiceFlatlistRef.current.scrollToEnd();
                            setPopularServiceFetchBlock(false);
                        }, 100);
                    } else {
                        setPopularServiceFetchBlock(false);
                    }
                }, 2000);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const fetchAllServiceCategories = async () => {
        try {
            const categories = await SearchService.getAllServiceCategory();

            console.log('setted');
            console.log(categories);
            setServiceCategories(categories);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        setTimeout(() => {
            //TEMPORARY: Show skeleton effect

            fetchPopularServiceData();
            fetchAllServiceCategories();
        }, 1000);
    }, []);

    useEffect(() => {
        console.log(popularServiceList);
        if (popularServiceList.isLoadingMoreData) {
            fetchMorePopularServiceData();
        }
    }, [popularServiceList.isLoadingMoreData]);
    return (
        <LinearGradient
            colors={[CustomColors.PRIMARY_BLUE, CustomColors.SECONDARY_BLUE_PURPLE]}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 1}}
            style={styles.bigContainer}>
            <StatusBar animated barStyle={'dark-content'} backgroundColor={statusBarColor} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                    onScroll={event => {
                        if (event.nativeEvent.contentOffset.y > popularContainerOffsetY) {
                            setStatusBarColor('white');
                        } else {
                            setStatusBarColor('transparent');
                        }
                    }}>
                    <View style={styles.bigContainer}>
                        <View style={styles.headerContainerGradient}>
                            <LinearGradient
                                colors={[CustomColors.PRIMARY_BLUE, CustomColors.SECONDARY_BLUE_PURPLE]}
                                start={{x: 0, y: 1}}
                                end={{x: 1, y: 1}}
                                style={styles.headerGradient}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        console.log('haha');
                                        navigation.navigate('LocationPicker');
                                    }}>
                                    <View style={styles.locationWrapper}>
                                        <Text style={styles.serviceAt}>
                                            SERVICE AT{'\n'}
                                            <Text style={styles.serviceLocation}>
                                                {_.truncate(userInfo?.serviceAddress?.addressFullName, {length: 48})}{' '}
                                                <Icon name="caret-down" width={36} height={36} />
                                            </Text>
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <Text style={styles.slogan}>Book Service{'\n'}to your doorstep</Text>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        navigation.navigate('SearchService', {
                                            searchBarX: searchBarxy.x,
                                            searchBarY: searchBarxy.y,
                                        });
                                    }}>
                                    <View
                                        onLayout={event => {
                                            var {x, y, width, height} = event.nativeEvent.layout;

                                            console.log('gagaga' + y);

                                            setSearchBarxy({x: x, y: y});
                                        }}>
                                        <Searchbar
                                            style={styles.searchBar}
                                            editable={false}
                                            icon={() => <FeatherIcon name="search" size={20} />}
                                            placeholder="Find your service"
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={styles.character}>
                                    <CharacterSvg fill="#000000" />
                                </View>
                                <Animatable.View
                                    style={styles.cloud1}
                                    animation={moveCloudReverse}
                                    duration={8000}
                                    easing="ease-in-out"
                                    iterationCount="infinite"
                                    useNativeDriver={true}
                                    direction="reverse">
                                    <Cloud1Svg fill={CustomColors.WHITE} />
                                </Animatable.View>
                                <Animatable.View
                                    style={styles.cloud2}
                                    animation={moveCloud}
                                    duration={6000}
                                    iterationDelay={500}
                                    useNativeDriver={true}
                                    easing="ease-in-out"
                                    iterationCount="infinite"
                                    direction="reverse">
                                    <Cloud2Svg fill={CustomColors.WHITE} />
                                </Animatable.View>
                            </LinearGradient>
                        </View>
                        <View
                            style={styles.popularContainer}
                            onLayout={event => {
                                var {x, y, width, height} = event.nativeEvent.layout;

                                setPopularContainerOffsetY(y);
                            }}>
                            <View style={[styles.headerContainerGradient, {height: 'auto'}]}>
                                <LinearGradient
                                    colors={[CustomColors.PRIMARY_BLUE, CustomColors.SECONDARY_BLUE_PURPLE]}
                                    start={{x: 0, y: 1}}
                                    end={{x: 1, y: 1}}
                                    style={styles.headerGradientBottomPortion}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>Popular This month</Text>
                                        <Text style={styles.viewAll}>View All</Text>
                                    </View>
                                </LinearGradient>
                                <View style={{flex: 1}}>
                                    <FlatList
                                        ref={popularServiceFlatlistRef}
                                        style={styles.popularServiceScrollView}
                                        scrollEnabled={popularServiceList.data.length > 0}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        data={popularServiceList.data}
                                        renderItem={({index, item}) => {
                                            return (
                                                <Animatable.View
                                                    animation="fadeIn"
                                                    useNativeDriver={true}
                                                    needsOffscreenAlphaCompositing={true} //Fix Elevation animating issue
                                                    style={[
                                                        styles.popularServiceWrapper,
                                                        {paddingLeft: index > 0 ? 0 : 20},
                                                    ]}>
                                                    <TouchableRipple
                                                        onPress={() => {
                                                            navigation.navigate('ViewServiceProvider', {providerId: item.id});
                                                        }}>
                                                        <PopularServiceDisplay
                                                            serviceType={item.serviceType}
                                                            appointmentInCurrentMonth={item.popularity.AUG_2021}
                                                            businessName={item.businessName}
                                                            profileImgUrl={item.businessLogoUrl}
                                                            coverImageUrl={item.coverImgUrl}
                                                        />
                                                    </TouchableRipple>
                                                </Animatable.View>
                                            );
                                        }}
                                        keyExtractor={item => item.id}
                                        ListHeaderComponent={() => {
                                            return isFetchingPopularService ? (
                                                <>
                                                    <View style={styles.popularServiceWrapper}>
                                                        <PopularServiceDisplaySkeleton style={{}} />
                                                        <View style={{width: 20, height: '100%'}}></View>
                                                        <PopularServiceDisplaySkeleton style={{}} />
                                                    </View>
                                                </>
                                            ) : popularServiceList.data.length > 0 ? null : (
                                                <View style={{padding: 20}}>
                                                    <View style={{width: 250, height: 100, justifyContent: 'center'}}>
                                                        <Text
                                                            style={{
                                                                textAlign: 'left',
                                                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                                color: CustomColors.GRAY,
                                                                fontSize: CustomTypography.FONT_SIZE_12,
                                                            }}>
                                                            Sorry, there are no popular service at your area currently
                                                        </Text>
                                                    </View>
                                                </View>
                                            );
                                        }}
                                        ListFooterComponent={() => {
                                            if (popularServiceList.isLoadingMoreData) {
                                                return (
                                                    <Animatable.View
                                                        ref={popularServiceSpinnerRef}
                                                        style={{
                                                            width: 48,
                                                            flex: 1,
                                                            alignItems: 'center',
                                                            justifyContent: 'flex-end',
                                                            marginRight: 8,
                                                        }}>
                                                        <View style={{width: 64, height: 64}}>
                                                            <LottieView
                                                                source={require('@assets/animations/loadingSpinner.json')}
                                                                autoPlay
                                                                loop={true}
                                                            />
                                                        </View>
                                                    </Animatable.View>
                                                );
                                            } else {
                                                return null;
                                            }
                                        }}
                                        overScrollMode="never"
                                        onEndReached={() => {
                                            console.log('end reach');
                                            if (!popularServiceFetchBlock) {
                                                setPopularServiceList({...popularServiceList, isLoadingMoreData: true});
                                                setPopularServiceFetchBlock(true);
                                            }
                                        }}
                                        onEndReachedThreshold={0}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.browseByCategoryContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Browse by category</Text>
                                <Text style={styles.viewAll}></Text>
                            </View>
                            <View
                                style={styles.categoryWrapper}
                                onLayout={event => {
                                    var {x, y, width, height} = event.nativeEvent.layout;
                                    setCategoryWrapperWidth(width);
                                }}>
                                {serviceCategories.map((item, index) => (
                                    <Animatable.View
                                        key={index}
                                        style={{
                                            width: (categoryWrapperWidth - 50) / 2,
                                            marginRight: (index + 1) % 2 > 0 ? 10 : 0,
                                            marginTop: 8,
                                        }}
                                        needsOffscreenAlphaCompositing={true} //Fix Elevation animating issue
                                        animation="fadeIn"
                                        useNativeDriver={true}>
                                        <Surface style={{elevation: 1, borderRadius: 8}}>
                                            <TouchableRipple
                                                style={{
                                                    flex: 1,
                                                    borderRadius: 8,
                                                }}
                                                borderless
                                                onPress={() => {
                                                    navigation.navigate('BrowseVendorByCategory', {
                                                        businessCategory: item.id,
                                                    });
                                                }}
                                                rippleColor="rgba(0, 0, 0, .2)">
                                                <View style={styles.categoryButton}>
                                                    <View style={{width: 64, height: 64}}>
                                                        <SvgCssUri width="100%" height="100%" uri={item.iconUrl} />
                                                    </View>
                                                    <Text style={styles.categoryButtonLabel}>{item.displayName}</Text>
                                                </View>
                                            </TouchableRipple>
                                        </Surface>
                                    </Animatable.View>
                                ))}
                                {serviceCategories.length <= 0 ? (
                                    <>
                                        <View
                                            style={{
                                                width: Math.floor((Dimensions.get('window').width - 50) / 2),
                                                height: 102,
                                                marginTop: 8,
                                                marginRight: 10,
                                                borderRadius: 8,
                                                overflow: 'hidden',
                                            }}>
                                            <SkeletonPlaceholder>
                                                <View style={{height: 102}}></View>
                                            </SkeletonPlaceholder>
                                        </View>
                                        <View
                                            style={{
                                                width: Math.floor((Dimensions.get('window').width - 50) / 2),
                                                height: 102,
                                                marginTop: 8,
                                                marginRight: 0,
                                                borderRadius: 8,
                                                overflow: 'hidden',
                                            }}>
                                            <SkeletonPlaceholder>
                                                <View style={{height: 102}}></View>
                                            </SkeletonPlaceholder>
                                        </View>
                                    </>
                                ) : null}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default CustomerHomepage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainerGradient: {
        width: '100%',
        height: 330,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    headerGradient: {
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: 50,
        overflow: 'hidden',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    headerGradientBottomPortion: {
        width: '100%',
        height: 40,
    },
    sectionHeader: {
        width: '100%',
        height: 40,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopRightRadius: 50,
    },
    popularContainer: {
        width: '100%',
        overflow: 'hidden',
    },
    sectionTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_DARK,
    },
    viewAll: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.GRAY_DARK,
    },
    locationWrapper: {
        width: '100%',
    },
    serviceAt: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_12,
        color: CustomColors.WHITE,
    },
    serviceLocation: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.WHITE,
    },
    slogan: {
        fontFamily: CustomTypography.FONT_FAMILY_BOLD,
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.WHITE,
        marginTop: 16,
    },
    searchBar: {
        borderRadius: 8,
        marginTop: 16,
    },
    character: {
        width: 200,
        height: 200,
        position: 'absolute',
        bottom: -80,
        right: 10,
        zIndex: 20,
    },
    cloud1: {
        width: 120,
        height: 50,
        position: 'absolute',
        bottom: 10,
        right: 10,
    },

    cloud2: {
        width: 100,
        height: 60,
        position: 'absolute',
        bottom: 30,
        right: 100,
    },
    popularServiceScrollView: {},
    popularServiceWrapper: {
        flex: 1,
        padding: 20,
        flexDirection: 'row',
    },
    browseByCategoryContainer: {
        width: '100%',
    },
    categoryButton: {
        padding: 12,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: CustomColors.WHITE_BLUE,
    },
    categoryWrapper: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 20,
        paddingTop: 12,
    },
    categoryButtonLabel: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.GRAY_DARK,
    },
});
