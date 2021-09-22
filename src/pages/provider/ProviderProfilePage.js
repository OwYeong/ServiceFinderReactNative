import UserService from '@services/UserService';
import React, {useState, useEffect} from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    useWindowDimensions,
    View,
} from 'react-native';
import {CustomColors, CustomMixins, CustomTypography} from '@styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {Button, IconButton} from 'react-native-paper';
import CommonFunction from '@utils/CommonFunction';
import {TabView, TabBar, SceneMap, PagerPan} from 'react-native-tab-view';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ProviderSchedulePage from './ProviderSchedulePage';
import PhotoListingComponent from '@organisms/PhotoListingComponent';
import ProviderService from '@services/ProviderService';

const ProviderProfilePage = () => {
    const providerInfo = useSelector(state => state.loginState.providerInfo);
    const userInfo = useSelector(state => state.loginState.userInfo);

    const [navigationState, setNavigationState] = useState({
        index: 0,
        routes: [
            {key: 'photos', title: 'Photos'},
            {key: 'reviews', title: 'Reviews'},
        ],
    });
    const [tabBarOffsetY, setTabBarOffsetY] = useState(0);
    const [isPhotoListingScrollable, setIsPhotoListingScrollable] = useState(false)

    const [photosList, setPhotosList] = useState([]);

    useEffect(() => {
        ProviderService.getAllPost().then(data => {
            setPhotosList(data.data);
            console.log(data.data);
            // <PhotoListingComponent dataList={photosList} />
        });
    }, []);

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView
                    onScroll={event => {
                        console.log(event.nativeEvent.contentOffset.y, ' > ', tabBarOffsetY);

                        if (event.nativeEvent.contentOffset.y > tabBarOffsetY) {
                            setIsPhotoListingScrollable(true);
                        } else {
                            setIsPhotoListingScrollable(false);
                        }
                    }}
                    contentContainerStyle={{flexGrow: 1}}
                    nestedScrollEnabled={true}>
                    <View style={styles.bigContainer}>
                        <View style={{padding: 16}}>
                            <View style={styles.imageContainer}>
                                <TouchableHighlight
                                    style={{borderTopLeftRadius: 8, borderTopRightRadius: 8, overflow: 'hidden'}}
                                    onPress={() => {
                                        // coverImageActionSheet.current.snapTo(1);
                                    }}
                                    activeOpacity={0.6}
                                    underlayColor="#FFFFFF">
                                    <Image
                                        style={styles.coverImage}
                                        source={
                                            !!providerInfo?.coverImgUrl
                                                ? {uri: providerInfo?.coverImgUrl}
                                                : require('@assets/images/default-coverImage.png')
                                        }
                                        resizeMode="cover"
                                    />
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={[styles.businessProfileImageWrapper]}
                                    onPress={() => {
                                        // businessLogoActionSheet.current.snapTo(1);
                                    }}
                                    activeOpacity={0.6}
                                    underlayColor="#FFFFFF">
                                    <Image
                                        style={styles.businessProfileImage}
                                        source={
                                            !!providerInfo?.businessLogoUrl
                                                ? {uri: providerInfo?.businessLogoUrl}
                                                : require('@assets/images/default-profileImage.png')
                                        }
                                    />
                                </TouchableHighlight>
                            </View>
                            <Text style={styles.businessName}>{providerInfo?.businessName}</Text>
                            <Text style={styles.serviceType}>
                                {CommonFunction.getDisplayNameForServiceType(providerInfo?.serviceType)}
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
                                    onPress={() => console.log('Pressed')}>
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
                                    onPress={() => console.log('Pressed')}
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
                        </View>
                        <TabView
                        
                            style={{height: Dimensions.get('window').height - 64 - 48}}
                            navigationState={navigationState}
                            renderScene={({route}) => {
                                switch (route.key) {
                                    case 'photos':
                                        return <PhotoListingComponent dataList={photosList} isScrollEnabled={isPhotoListingScrollable} />;
                                    case 'reviews':
                                        return <ProviderSchedulePage />;
                                    default:
                                        return null;
                                }
                            }}
                            renderTabBar={props => {
                                return (
                                    <TabBar
                                        {...props}
                                        onLayout={event => {
                                            var {x, y, width, height} = event.nativeEvent.layout;
            
                                            setTabBarOffsetY(y);
                                        }}
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
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ProviderProfilePage;

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
        height: undefined,
        aspectRatio: 3.5 / 2,
    },
    businessProfileImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
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
    businessInfoContainer: {},
});
