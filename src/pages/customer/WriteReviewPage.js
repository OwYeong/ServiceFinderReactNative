import React, {useEffect, useRef, useState} from 'react';
import NewRequestDisplayComponent from '@organisms/NewRequestDisplayComponent';
import RequestHistoryDisplayComponent from '@organisms/RequestHistoryDisplayComponent';
import {useNavigation} from '@react-navigation/core';
import ProviderService from '@services/ProviderService';
import UserService from '@services/UserService';
import {CustomColors, CustomTypography} from '@styles';
import {
    Dimensions,
    Image,
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {
    TextInput,
    Button,
    IconButton,
    Avatar,
    Dialog,
    Checkbox,
    RadioButton,
    TouchableRipple,
    HelperText,
    Surface,
    ActivityIndicator,
} from 'react-native-paper';
import {Portal} from '@gorhom/portal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, TabBar, SceneMap, PagerPan} from 'react-native-tab-view';
import RequestService from '@services/RequestService';
import moment from 'moment';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Constants} from '~constants';
import MapView, {Marker} from 'react-native-maps';
import GeoLocationUtils from '@utils/GeoLocationUtils';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import ServiceProviderMarkerSvg from '@assets/images/service-provider-marker';
import BottomSheet from 'react-native-bottomsheet-reanimated';
import CommonFunction from '@utils/CommonFunction';
import WaitingForServiceIllustration from '@assets/images/waiting-for-service-illustration';
import PendingResponseIllustration from '@assets/images/pending-response-from-vendor-illustration';
import {AirbnbRating} from 'react-native-ratings';
import {debounce} from 'lodash';
import ReviewService from '@services/ReviewService';
import firebase from '@react-native-firebase/app';
import {useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';

const WriteReviewPage = ({route}) => {
    const userInfo = useSelector(state => state.loginState.userInfo);

    const navigation = useNavigation();
    const requestId = route.params.requestId;

    const [requestData, setRequestData] = useState({});

    const [isFetchingData, setIsFetchingData] = useState(true);

    const [isStarTouched, setIsStartTouched] = useState(false);
    const [starCount, setStarCount] = useState(false);
    const [message, setMessage] = useState('');

    const submitFeedback = async () => {
        try {
            const reviewData = {
                feedback: message,
                postedDateTime: firebase.firestore.FieldValue.serverTimestamp(),
                numOfStar: starCount,
                reviewerName: userInfo?.firstName + ' ' + userInfo?.lastName,
                reviewerId: requestData?.customerInfo?.userId,
                serviceProviderId: requestData?.serviceProvider?.userId,
                requestId: requestId
                
            };
            const newlyAddedReview = await ReviewService.createReview(reviewData);

            if(!!newlyAddedReview){
                showMessage({
                    message: 'Review submitted successfully.',
                    type: 'info',
                    position: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)', // background color
                    color: 'white', // text color
                    titleStyle: {marginTop: 5},
                    hideOnPress: true,
                    autoHide: true,
                    duration: 2000,
                });
                navigation.goBack();
            }
            
        } catch (error) {
            showMessage({
                message: 'Some error occur. Please try again later.',
                type: 'info',
                position: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)', // background color
                color: 'white', // text color
                titleStyle: {marginTop: 5},
                hideOnPress: true,
                autoHide: true,
                duration: 2000,
            });
        }
    };

    const submitFeedbackCallback = debounce(submitFeedback.bind(this), 500);

    useEffect(() => {
        RequestService.getRequestByIdOneTimeRead(requestId)
            .then(data => {
                setRequestData(data);

                setTimeout(() => {
                    setIsFetchingData(false);
                }, 1000);

            })
            .catch(err => {
                console.log(err);
            });

        return () => {};
    }, []);

    return (
        <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <View>
                            <IconButton
                                icon="close"
                                size={24}
                                color={CustomColors.GRAY}
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            />
                        </View>
                        <View style={{paddingVertical: 80, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{width: 100, height: 100, borderRadius: 50, overflow: 'hidden'}}>
                                {!!requestData?.serviceProvider?.businessLogoUrl ? (
                                    <Image
                                        style={{width: '100%', height: '100%'}}
                                        source={{
                                            uri: requestData?.serviceProvider?.businessLogoUrl,
                                        }}></Image>
                                ) : (
                                    <Image
                                        style={{width: '100%', height: '100%'}}
                                        source={require('@assets/images/default-profileImage.png')}></Image>
                                )}
                            </View>
                        </View>
                        <Text
                            style={{
                                width: '100%',
                                paddingHorizontal: 30,
                                textAlign: 'center',
                                fontSize: CustomTypography.FONT_SIZE_20,
                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                color: CustomColors.GRAY_DARK,
                            }}>
                            How was the service of {'\n'}
                            {requestData?.serviceProvider?.businessName}?
                        </Text>
                        <Text
                            style={{
                                width: '100%',
                                paddingHorizontal: 30,
                                textAlign: 'center',
                                fontSize: CustomTypography.FONT_SIZE_12,
                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                color: CustomColors.GRAY,
                            }}>
                            Enjoy the service? Your feedback may {'\n'}help him/her to improve.
                        </Text>
                        <View style={{marginTop: 20}}>
                            <AirbnbRating
                                showRating={false}
                                count={5}
                                defaultRating={3}
                                size={30}
                                onFinishRating={numOfStar => {
                                    setIsStartTouched(true);
                                    setStarCount(numOfStar);
                                }}
                            />
                        </View>
                        {isStarTouched ? (
                            <>
                                <View style={{paddingHorizontal: 40, marginTop: 20}}>
                                    <TextInput
                                        style={{
                                            fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                            backgroundColor: CustomColors.WHITE,
                                            borderRadius: 12,
                                            paddingVertical: 2,
                                            marginTop: 8,
                                        }}
                                        mode="outlined"
                                        label={'Leave a Message'}
                                        placeholder={'Write your message here'}
                                        value={message}
                                        onChangeText={text => {
                                            setMessage(text);
                                        }}
                                    />
                                </View>
                                <View style={styles.actionBtnContainer}>
                                    <Button
                                        style={styles.actionBtn}
                                        mode="contained"
                                        contentStyle={{height: 50}}
                                        color={CustomColors.PRIMARY_BLUE}
                                        dark
                                        onPress={() => {
                                            submitFeedbackCallback();
                                        }}>
                                        Submit
                                    </Button>
                                </View>
                            </>
                        ) : null}
                    </View>
                </ScrollView>
                {isFetchingData ? (
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 1000,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }}>
                        <ActivityIndicator animating={true} color={CustomColors.WHITE} />
                    </View>
                ) : null}
            </SafeAreaView>
        </View>
    );
};

export default WriteReviewPage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
        paddingBottom: 32,
    },
    backIcon: {
        marginLeft: -8,
    },
    customerName: {
        fontSize: CustomTypography.FONT_SIZE_14,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
    },
    requestedDateTime: {
        fontSize: CustomTypography.FONT_SIZE_12,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
        marginTop: -2,
    },
    contentContainer: {
        paddingHorizontal: 16,
    },
    requestedAddress: {
        flex: 1,
        fontSize: CustomTypography.FONT_SIZE_14,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
        marginLeft: 20,
    },
    requestedTimeSlot: {
        flex: 1,
        fontSize: CustomTypography.FONT_SIZE_14,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
        marginLeft: 20,
        marginTop: 5,
    },
    actionBtnContainer: {
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionBtn: {
        marginTop: 40,
        width: '100%',
        borderRadius: 8,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        justifyContent: 'center',
        marginBottom: 16,
    },
    errorText: {
        fontSize: CustomTypography.FONT_SIZE_12,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: 'red',
        margin: 0,
        padding: 0,
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
