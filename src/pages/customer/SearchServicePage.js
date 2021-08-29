import {useNavigation} from '@react-navigation/native';
import {CustomColors, CustomTypography} from '@styles';
import React, {useRef, useState} from 'react';
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
} from 'react-native';
import {IconButton, List, Searchbar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import SearchService from '@services/SearchService';

const SearchServicePage = ({route}) => {
    const searchBarRef = useRef(null);
    const navigation = useNavigation();
    const {searchBarX, searchBarY} = route.params;
    const [serviceCategories, setServiceCategories] = useState([]);
    const [showClearIcon, setShowClearIcon] = useState(false);

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

    useState(() => {
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
                        onChangeText={text => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setShowClearIcon(text.length > 0);
                        }}
                        inputStyle={{padding: 0, margin: 0, fontSize: 14}}
                        onFocus={() => {}}
                        icon={() => <FeatherIcon name="search" size={20} />}
                        clearIcon={() => (showClearIcon ? <MaterialIcon name="cancel" size={20} /> : null)}
                        placeholder="Find your service"
                    />
                </View>
                <ScrollView style={{marginTop: 16, flex: 1}} contentContainerStyle={{flexGrow: 1}}>
                    <View style={{flex: 1}}>
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
                                                console.log('haha');
                                            }}></List.Item>
                                    ))}
                                </List.Accordion>
                            ))}
                        </View>
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
        paddingHorizontal: 16,
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
    },

    backIcon: {
        width: 38,
        height: 38,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    allServiceContainer: {
        marginTop: 16,
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
