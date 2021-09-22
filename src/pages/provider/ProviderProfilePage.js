import UserService from '@services/UserService';
import React, {useState, useEffect, useRef} from 'react';
import {
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

import ProviderSchedulePage from './ProviderSchedulePage';
import PhotoListingComponent from '@organisms/PhotoListingComponent';
import ProviderService from '@services/ProviderService';

import BottomSheet from 'react-native-bottomsheet-reanimated';
import ImageCropPicker from 'react-native-image-crop-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Portal} from '@gorhom/portal';

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
    const [isPhotoListingScrollable, setIsPhotoListingScrollable] = useState(false);

    const [photosList, setPhotosList] = useState([]);

    const coverImageActionSheet = useRef(null);
    const businessLogoActionSheet = useRef(null);

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
                    style={{flex: 1}}
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
                                        coverImageActionSheet.current.snapTo(0);
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
                                        businessLogoActionSheet.current.snapTo(1);
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
                        <View
                            onLayout={event => {
                                var {x, y, width, height} = event.nativeEvent.layout;

                                setTabBarOffsetY(y);
                            }}></View>
                        <TabView
                            style={{height: Dimensions.get('window').height - 64}}
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
                                        return <ProviderSchedulePage />;
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
                    </View>
                </ScrollView>
            </SafeAreaView>
            <Portal>
                <BottomSheet
                    ref={coverImageActionSheet}
                    bottomSheerColor="#FFFFFF"
                    // ref="BottomSheet"
                    initialPosition={0}
                    snapPoints={[260, 0]}
                    isBackDrop={true}
                    isBackDropDismissByPress={true}
                    isRoundBorderWithTipHeader={true}
                    // backDropColor="red"
                    // isModal
                    // containerStyle={{backgroundColor:"red"}}
                    // tipStyle={{backgroundColor:"red"}}
                    // headerStyle={{backgroundColor:"red"}}
                    // bodyStyle={{backgroundColor:"red",flex:1}}
                    body={
                        <View style={{paddingVertical: 16}}>
                            <TouchableOpacity
                                onPress={() => {
                                    ImageCropPicker.openPicker({
                                        width: 1200,
                                        height: 600,
                                        cropping: true,
                                        mediaType: 'photo',
                                    })
                                        .then(image => {
                                            setCoverImagePath(image.path);
                                            setCoverImageMime(image.mime);
                                            coverImageActionSheet.current.snapTo(0);

                                            // var reference = null;

                                            // if (image.mime == 'image/jpeg') {
                                            //     reference = storage().ref(
                                            //         `userData/${auth().currentUser.uid}/coverImage.png`,
                                            //     );
                                            // } else {
                                            //     reference = storage().ref(
                                            //         `userData/${auth().currentUser.uid}/coverImage.jpg`,
                                            //     );
                                            // }

                                            // reference
                                            //     .putFile(image.path)
                                            //     .then(data => {
                                            //         setCoverImagePath(image.path);

                                            //     })
                                            //     .catch(err => {
                                            //         console.log('Cover image upload error');
                                            //         console.log(err);
                                            //     });
                                        })
                                        .catch(e => {
                                            console.log(e);
                                        });
                                }}>
                                <View style={styles.actionButton}>
                                    <View
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            overflow: 'hidden',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: CustomColors.GRAY_LIGHT,
                                        }}>
                                        <FontAwesome name="photo" size={24} color={CustomColors.GRAY_DARK} />
                                    </View>
                                    <Text style={styles.actionButtonLabel}>Select From Gallery</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    ImageCropPicker.openCamera({
                                        width: 1200,
                                        height: 600,
                                        cropping: true,
                                    })
                                        .then(image => {
                                            setCoverImagePath(image.path);
                                            setCoverImageMime(image.mime);
                                            coverImageActionSheet.current.snapTo(0);
                                        })
                                        .catch(e => {
                                            console.log(e);
                                        });
                                }}>
                                <View style={styles.actionButton}>
                                    <View
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            overflow: 'hidden',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: CustomColors.GRAY_LIGHT,
                                        }}>
                                        <FontAwesome name="camera" size={24} color={CustomColors.GRAY_DARK} />
                                    </View>
                                    <Text style={styles.actionButtonLabel}>Snap cover image from camera</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setCoverImagePath(null);
                                    businessLogoActionSheet.current.snapTo(0);
                                }}>
                                <View style={styles.actionButton}>
                                    <View
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            overflow: 'hidden',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: CustomColors.GRAY_LIGHT,
                                        }}>
                                        <FontAwesome name="file-image-o" size={24} color={CustomColors.GRAY_DARK} />
                                    </View>
                                    <Text style={styles.actionButtonLabel}>Use default image</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </Portal>
            <BottomSheet
                ref={businessLogoActionSheet}
                bottomSheerColor="#FFFFFF"
                // ref="BottomSheet"
                initialPosition={0}
                snapPoints={[0, 260]}
                isBackDrop={true}
                isBackDropDismissByPress={true}
                isRoundBorderWithTipHeader={true}
                // backDropColor="red"
                // isModal
                // containerStyle={{backgroundColor:"red"}}
                // tipStyle={{backgroundColor:"red"}}
                // headerStyle={{backgroundColor:"red"}}
                // bodyStyle={{backgroundColor:"red",flex:1}}
                body={
                    <View style={{paddingVertical: 16}}>
                        <TouchableOpacity
                            onPress={() => {
                                ImageCropPicker.openPicker({
                                    width: 800,
                                    height: 800,
                                    cropping: true,
                                    mediaType: 'photo',
                                })
                                    .then(image => {
                                        businessLogoActionSheet.current.snapTo(0);
                                    })
                                    .catch(e => {
                                        console.log(e);
                                    });
                            }}>
                            <View style={styles.actionButton}>
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: CustomColors.GRAY_LIGHT,
                                    }}>
                                    <FontAwesome name="photo" size={24} color={CustomColors.GRAY_DARK} />
                                </View>
                                <Text style={styles.actionButtonLabel}>Select From Gallery</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                ImageCropPicker.openCamera({
                                    width: 800,
                                    height: 800,
                                    cropping: true,
                                })
                                    .then(image => {
                                        businessLogoActionSheet.current.snapTo(0);
                                    })
                                    .catch(e => {
                                        console.log(e);
                                    });
                            }}>
                            <View style={styles.actionButton}>
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: CustomColors.GRAY_LIGHT,
                                    }}>
                                    <FontAwesome name="camera" size={24} color={CustomColors.GRAY_DARK} />
                                </View>
                                <Text style={styles.actionButtonLabel}>Snap Business Profile from camera</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                businessLogoActionSheet.current.snapTo(0);
                            }}>
                            <View style={styles.actionButton}>
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: CustomColors.GRAY_LIGHT,
                                    }}>
                                    <FontAwesome name="file-image-o" size={24} color={CustomColors.GRAY_DARK} />
                                </View>
                                <Text style={styles.actionButtonLabel}>Use default image</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            />
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
    businessInfoContainer: {},
});
