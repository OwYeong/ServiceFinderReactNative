import {useNavigation} from '@react-navigation/native';
import {CustomColors, CustomTypography} from '@styles';
import React, {useRef, useState, useEffect} from 'react';
import {
    Button,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Animated,
    Easing,
    TouchableWithoutFeedback,
    Platform,
    UIManager,
    LayoutAnimation,
    ScrollView,
    Image,
} from 'react-native';
import {IconButton, List, Searchbar, TouchableRipple} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import SearchService from '@services/SearchService';
import SearchingSkeleton from '@organisms/SearchingSkeleton';
import NoResultIllustration from '@assets/images/no-result-found-illustration';
import CommonFunction from '@utils/CommonFunction';
import {Rating} from 'react-native-ratings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const SearchServicePage = ({route}) => {
    const searchBarRef = useRef(null);
    const navigation = useNavigation();
    const {searchBarX, searchBarY} = route.params;
    const [serviceCategories, setServiceCategories] = useState([]);
    const [showClearIcon, setShowClearIcon] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isEnterPressed, setIsEnterPressed] = useState(false);
    const [searchResults, setSearchResults] = useState({isLoadingMoreData: false, data: []});
    const [lastKeywordSearched, setLastKeywordSearched] = useState("");

    const searchBarAnimatedValue = useRef(new Animated.Value(0)).current;

    const searchBarWidth = searchBarAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [Dimensions.get('window').width - 40, Dimensions.get('window').width - 64 - 16], // <-- any value larger than your content's height
    });

    const searchBarHeight = searchBarAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 40],
    });

    const searchBarTransformX = searchBarAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-24, 0],
    });

    const searchBarTransformY = searchBarAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [searchBarY + 16, 0],
    });

    const fetchAllServiceCategories = async () => {
        try {
            const categories = await SearchService.getAllServiceCategory();

            const categoriesWithExpandedAttr = categories.map(category => {
                return {...category, isExpanded: false};
            });

            console.log('setted');
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setServiceCategories(categoriesWithExpandedAttr);
        } catch (error) {
            console.log(error);
        }
    };

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 50;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    const searchServiceProvider = async searchKeyword => {
        try {
            setIsEnterPressed(true);
            setIsSearching(true);

            const results = await SearchService.searchProviderInCustomerLocation(searchKeyword);
            console.log('after SEarch');
            setSearchResults({
                isLoadingMoreData: false,
                lastDocumentInList: results.lastVisibleDocument,
                data: results.data,
            });

            setIsSearching(false);
        } catch (error) {
            console.log('search error');
            console.log(error);

            setIsSearching(false);
            setSearchResults({isLoadingMoreData: false, lastDocumentInList: null, data: []});
        }
    };

    const fetchMoreSearchResult = async () => {
        if (!!searchResults.lastDocumentInList && !searchResults.isLoadingMoreData) {
            try {
                setSearchResults({
                    ...searchResults,
                    isLoadingMoreData: true,
                });

                const newSearchResults = await SearchService.searchProviderInCustomerLocation(
                    searchInput,
                    searchResults.lastDocumentInList,
                );

                setTimeout(() => {
                    setSearchResults({
                        isLoadingMoreData: false,
                        lastDocumentInList: newSearchResults.lastVisibleDocument,
                        data: [...searchResults.data, ...newSearchResults.data],
                    });
                }, 2000);
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        Animated.timing(searchBarAnimatedValue, {
            toValue: 1,
            easing: Easing.linear(), // easing function
            useNativeDriver: false,
        }).start(() => {
            searchBarRef.current.focus();
        });

        fetchAllServiceCategories();

        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
    }, []);

    useEffect(() => {
        console.log(searchInput);
    }, [searchInput]);

    return (
        <View style={styles.bigContainer}>
            <StatusBar animated barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={styles.searchContainer}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <View style={styles.backIcon}>
                            <IoniIcon
                                name="chevron-back"
                                color={CustomColors.GRAY_DARK}
                                size={CustomTypography.ICON_SMALL}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <Searchbar
                        ref={searchBarRef}
                        style={[
                            styles.searchBar,
                            {
                                width: searchBarWidth,
                                height: searchBarHeight,
                                transform: [{translateX: searchBarTransformX}, {translateY: searchBarTransformY}],
                            },
                        ]}
                        onSubmitEditing={({text}) => {
                            console.log('Search softkey pressed!', text);
                            if (!!searchInput && lastKeywordSearched != searchInput) {
                                searchServiceProvider(searchInput);
                                setLastKeywordSearched(searchInput)
                            }
                        }}
                        onChangeText={text => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setSearchInput(text);
                            setIsEnterPressed(false);
                            setSearchResults({isLoadingMoreData: false, data: []});
                        }}
                        value={searchInput}
                        inputStyle={{padding: 0, margin: 0, fontSize: 14}}
                        onFocus={() => {}}
                        icon={() => <FeatherIcon name="search" size={20} />}
                        clearIcon={() => <MaterialIcon name="cancel" size={20} />}
                        placeholder="Find your service"
                    />
                </View>
                <ScrollView
                    style={{marginTop: 16, flex: 1}}
                    contentContainerStyle={{flexGrow: 1}}
                    overScrollMode={'always'}
                    onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {
                            fetchMoreSearchResult();
                        }
                    }}>
                    <View style={{flex: 1}}>
                        {!isEnterPressed ? (
                            <View style={styles.allServiceContainer}>
                                {serviceCategories.length > 0 ? <Text style={styles.title}>All Service</Text> : null}
                                {serviceCategories.map((serviceCategory, index) => (
                                    <List.Accordion
                                        key={index}
                                        title={serviceCategory.displayName}
                                        titleStyle={styles.serviceCategoryTitle}
                                        style={{padding: 0, margin: 0}}
                                        expanded={serviceCategory.isExpanded}
                                        onPress={() => {
                                            const newServiceCategories = [...serviceCategories];

                                            newServiceCategories[index] = {
                                                ...newServiceCategories[index],
                                                isExpanded: !newServiceCategories[index].isExpanded,
                                            };

                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                            setServiceCategories(newServiceCategories);
                                        }}>
                                        {serviceCategory.services.map((service, i) => (
                                            <List.Item
                                                title={service.displayName}
                                                titleStyle={styles.serviceTitle}
                                                key={i}
                                                onPress={() => {
                                                    navigation.navigate('BrowseVendorByCategory', {
                                                        serviceType: service.serviceId,
                                                    });
                                                }}></List.Item>
                                        ))}
                                    </List.Accordion>
                                ))}
                            </View>
                        ) : searchResults.data.length > 0 ? (
                            searchResults.data.map(providerInfo => (
                                <TouchableRipple
                                    onPress={() => {
                                        navigation.navigate('ViewServiceProvider', {providerId: providerInfo.id});
                                    }}
                                    key={providerInfo.id}>
                                    <View
                                        style={{flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16}}
                                        needsOffscreenAlphaCompositing={true}
                                        key={providerInfo.id}>
                                        <Animated.View
                                            needsOffscreenAlphaCompositing={true} //Fix Elevation animating issue
                                            elevation={0}
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
                                        </Animated.View>
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
                                                {CommonFunction.getDisplayNameForServiceType(providerInfo.serviceType)}
                                            </Text>
                                            <View style={{alignItems: 'flex-start', marginTop: 5}}>
                                                {!!providerInfo?.starStats &&
                                                Object.values(providerInfo?.starStats).reduce((a, b) => a + b) > 0 ? (
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
                                                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
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
                                                    <View
                                                        style={{
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                            alignItems: 'space-between',
                                                            justifyContent: 'space-between',
                                                        }}>
                                                        <Text
                                                            style={{
                                                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                                fontSize: CustomTypography.FONT_SIZE_12,
                                                                color: CustomColors.GRAY,
                                                            }}>
                                                            No rating yet
                                                        </Text>
                                                        <MaterialIcons
                                                            name="chevron-right"
                                                            size={16}
                                                            color={CustomColors.GRAY}
                                                        />
                                                    </View>
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
                            ))
                        ) : !isSearching ? (
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
                        {searchResults.isLoadingMoreData ? (
                            <Animatable.View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 8,
                                }}>
                                <View style={{flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
                                    <View style={{width: 64, height: 64}}>
                                        <LottieView
                                            source={require('@assets/animations/loadingSpinner.json')}
                                            autoPlay
                                            loop={true}
                                        />
                                    </View>
                                    <Text>Loading more data...</Text>
                                </View>
                            </Animatable.View>
                        ) : null}

                        {isSearching && isEnterPressed ? (
                            <View style={styles.searchSkeletonContainer}>
                                <SearchingSkeleton />
                                <SearchingSkeleton style={{marginTop: 16}} />
                                <SearchingSkeleton style={{marginTop: 16}} />
                                <SearchingSkeleton style={{marginTop: 16}} />
                            </View>
                        ) : null}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default SearchServicePage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        paddingVertical: 8,
        paddingBottom: 0,
        flex: 1,
        backgroundColor: 'white',
    },
    searchBar: {
        alignItems: 'center',
        borderRadius: 8,
        height: 40,
        elevation: 0,
        backgroundColor: CustomColors.GRAY_LIGHT,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    searchSkeletonContainer: {
        padding: 5,
        marginTop: 16,
    },
    backIcon: {
        width: 38,
        height: 38,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    allServiceContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.GRAY_DARK,
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
    },
    serviceCategoryTitle: {
        marginTop: 12,
        marginLeft: -8,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_DARK,
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
    },
    serviceTitle: {
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_DARK,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
    },
});
