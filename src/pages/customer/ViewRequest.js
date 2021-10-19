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

const ViewRequest = ({route}) => {
    const navigation = useNavigation();
    const requestId = route.params.requestId;

    const [requestData, setRequestData] = useState({});

    const jobRequestActionSheet = useRef(null);
    const mapViewRef = useRef(null);

    useEffect(() => {
        const unsubscriber = RequestService.getRequestById(setRequestData, requestId);

        return () => {
            unsubscriber();
        };
    }, []);

    return (
        <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
                                <IconButton
                                    icon="arrow-back"
                                    color={CustomColors.GRAY_DARK}
                                    size={CustomTypography.ICON_SMALL}
                                    style={styles.backIcon}
                                    onPress={() => {
                                        navigation.goBack();
                                    }}
                                />
                                <Text
                                    style={{
                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                        fontSize: CustomTypography.FONT_SIZE_16,
                                    }}>
                                    My Service Request
                                </Text>
                            </View>
                            {[
                                Constants.SERVICE_STATUS.WAITING_FOR_SERVICE,
                                Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS,
                            ].includes(requestData?.serviceStatus) ? (
                                <View style={{paddingRight: 12}}>
                                    <IconButton
                                        icon="more-vert"
                                        color={CustomColors.GRAY_DARK}
                                        size={CustomTypography.ICON_SMALL}
                                        onPress={() => {
                                            jobRequestActionSheet.current.snapTo(1);
                                        }}
                                    />
                                </View>
                            ) : null}
                        </View>
                        <View style={styles.contentContainer}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{width: 40, height: 40, borderRadius: 20, overflow: 'hidden'}}>
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
                                    <View style={{marginLeft: 16}}>
                                        <Text style={styles.customerName}>
                                            {requestData?.serviceProvider?.businessName}
                                        </Text>
                                        <Text style={styles.requestedDateTime}>
                                            {CommonFunction.getDisplayNameForServiceType(
                                                requestData?.serviceProvider?.serviceType,
                                            )}
                                        </Text>
                                    </View>
                                </View>
                                <Button onPress={() => {}}>Chat</Button>
                            </View>
                            {requestData?.requestStatus == Constants.REQUEST_STATUS.ACCEPTED ? (
                                <View>
                                    {requestData?.serviceStatus == Constants.SERVICE_STATUS.WAITING_FOR_SERVICE ? (
                                        <View
                                            style={{
                                                width: '100%',
                                                paddingVertical: 30,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginTop:50
                                            }}>
                                            <View style={{width: '80%', height: undefined, aspectRatio: 395 / 258}}>
                                                <WaitingForServiceIllustration fill={'#fff'} />
                                            </View>
                                            <Text
                                                style={{
                                                    fontSize: CustomTypography.FONT_SIZE_14,
                                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                    color: CustomColors.GRAY,
                                                    textAlign: 'center',
                                                    marginTop: 12,
                                                    paddingHorizontal: 24
                                                }}>
                                                Waiting service provider to start the service request.
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                            ) : null}
                            {!!requestData ? (
                                <View
                                    style={{
                                        width: '100%',
                                        marginTop: 24,
                                        padding: 8,
                                        borderRadius: 10,
                                        backgroundColor:
                                            requestData?.serviceStatus == Constants.SERVICE_STATUS.WAITING_FOR_SERVICE
                                                ? '#a8a8a8'
                                                : requestData?.serviceStatus ==
                                                  Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS
                                                ? '#70cbff'
                                                : requestData?.serviceStatus ==
                                                  Constants.SERVICE_STATUS.SERVICE_COMPLETED
                                                ? '#95F985'
                                                : CustomColors.ALERT,
                                        opacity: !requestData?.serviceStatus ? 0 : 1,
                                    }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: CustomTypography.FONT_SIZE_16,
                                            fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                            color: CustomColors.WHITE,
                                        }}>
                                        Status:{' '}
                                        {requestData?.requestStatus == Constants.REQUEST_STATUS.PENDING
                                            ? 'PENDING FOR CONFIMATION'
                                            : null}
                                        {requestData?.serviceStatus == Constants.SERVICE_STATUS.WAITING_FOR_SERVICE &&
                                        requestData?.requestStatus == Constants.REQUEST_STATUS.ACCEPTED
                                            ? 'WAITING TO SERVICE'
                                            : null}
                                        {requestData?.serviceStatus == Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS &&
                                        requestData?.requestStatus == Constants.REQUEST_STATUS.ACCEPTED
                                            ? 'SERVICE IN PROGESSING'
                                            : null}
                                        {requestData?.serviceStatus == Constants.SERVICE_STATUS.SERVICE_COMPLETED &&
                                        requestData?.requestStatus == Constants.REQUEST_STATUS.ACCEPTED
                                            ? 'SERVICE COMPLETED'
                                            : null}
                                        {requestData?.serviceStatus == Constants.SERVICE_STATUS.CANCELLED_BY_CUSTOMER &&
                                        requestData?.requestStatus == Constants.REQUEST_STATUS.ACCEPTED
                                            ? 'CANCELLED BY CUSTOMER'
                                            : null}
                                        {requestData?.serviceStatus == Constants.SERVICE_STATUS.CANCELLED_BY_VENDOR &&
                                        requestData?.requestStatus == Constants.REQUEST_STATUS.ACCEPTED
                                            ? 'CANCELLED BY VENDOR'
                                            : null}
                                    </Text>
                                </View>
                            ) : null}

                            {requestData?.serviceStatus == Constants.SERVICE_STATUS.SERVICE_COMPLETED ? (
                                <Surface
                                    style={{
                                        width: '100%',
                                        padding: 16,
                                        elevation: 2,
                                        marginVertical: 16,
                                        borderRadius: 12,
                                        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                                    }}>
                                    <Text style={{fontFamily: CustomTypography.FONT_FAMILY_MEDIUM}}>
                                        Payment earned on this job
                                    </Text>
                                    <View
                                        style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 16}}>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                fontSize: CustomTypography.FONT_SIZE_12,
                                            }}>
                                            Doorstep Service Fee(Deposit):
                                        </Text>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text
                                                style={{
                                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                    fontSize: CustomTypography.FONT_SIZE_12,
                                                }}>
                                                RM
                                            </Text>
                                            <Text
                                                style={{
                                                    width: 80,
                                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                    fontSize: CustomTypography.FONT_SIZE_12,
                                                    textAlign: 'right',
                                                }}>
                                                {requestData?.doorstepServiceFee?.toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                fontSize: CustomTypography.FONT_SIZE_12,
                                            }}>
                                            Job Fee:
                                        </Text>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text
                                                style={{
                                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                    fontSize: CustomTypography.FONT_SIZE_12,
                                                }}>
                                                RM
                                            </Text>
                                            <Text
                                                style={{
                                                    width: 80,
                                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                    fontSize: CustomTypography.FONT_SIZE_12,
                                                    textAlign: 'right',
                                                }}>
                                                {requestData?.paymentReceived?.toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 8}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text
                                                style={{
                                                    paddingVertical: 9,
                                                    fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                    fontSize: CustomTypography.FONT_SIZE_12,
                                                }}>
                                                Total:{'         '}
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    borderTopWidth: 1,
                                                    borderColor: CustomColors.GRAY,
                                                    paddingVertical: 8,
                                                }}>
                                                <Text
                                                    style={{
                                                        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                        fontSize: CustomTypography.FONT_SIZE_12,
                                                    }}>
                                                    RM
                                                </Text>
                                                <Text
                                                    style={{
                                                        width: 80,
                                                        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                        fontSize: CustomTypography.FONT_SIZE_12,
                                                        textAlign: 'right',
                                                    }}>
                                                    {(
                                                        requestData?.doorstepServiceFee + requestData?.paymentReceived
                                                    )?.toFixed(2)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </Surface>
                            ) : null}

                            <View style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: 16}}>
                                <MaterialIcon name="call" size={30} color={CustomColors.GRAY} />
                                <Text style={styles.requestedTimeSlot}>{requestData?.customerInfo?.phoneNumber}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: 16}}>
                                <MaterialIcon name="date-range" size={30} color={CustomColors.GRAY} />
                                <Text style={styles.requestedTimeSlot}>
                                    {moment(new Date(requestData?.requestTimeSlot?.start)).format('YYYY-MM-DD hh:mm A')}
                                </Text>
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: 16}}>
                                <AntDesignIcon name="form" size={30} color={CustomColors.GRAY} />
                                <Button
                                    style={{marginLeft: 8}}
                                    labelStyle={{fontSize: CustomTypography.FONT_SIZE_12}}
                                    onPress={() => {
                                        setCustomerFormInputDisplayDialog({
                                            isVisible: true,
                                            customerFormResponse: requestData.customerFormResponse,
                                        });
                                    }}>
                                    View Customer Input
                                </Button>
                            </View>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    setGoogleMapRedirectDialog({
                                        isVisible: true,
                                        redirectCoordinate: `${requestData?.requestLocation?.addressCoor?.latitude},${requestData?.requestLocation?.addressCoor?.longitude}`,
                                    });
                                }}>
                                <View style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: 16}}>
                                    <MaterialIcon name="location-on" size={30} color={CustomColors.GRAY} />
                                    <Text style={styles.requestedAddress}>
                                        {requestData?.requestLocation?.addressFullName}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            {/* {!!requestData?.requestLocation?.addressCoor ? (
                                <View style={styles.container}>
                                    <MapView
                                        ref={mapViewRef}
                                        showsUserLocation={false}
                                        rotateEnabled={false}
                                        showsMyLocationButton={false}
                                        initialCamera={{
                                            altitude: 15000,
                                            center: {
                                                ...requestData?.requestLocation?.addressCoor,
                                            },
                                            heading: 0,
                                            pitch: 0,
                                            zoom: 11,
                                        }}
                                        style={{
                                            width: '100%',
                                            height: 200,
                                            marginTop: 20,
                                            borderRadius: 20,
                                            overflow: 'hidden',
                                        }}>
                                        <Marker
                                            identifier={'customerLocationMarker'}
                                            coordinate={{
                                                ...requestData?.requestLocation?.addressCoor,
                                            }}
                                            title={'Request Location'}
                                            description={'Customer request Location'}
                                        />
                                        {!!realTimeLocation ? (
                                            <Marker
                                                identifier={'serviceProviderLocationMarker'}
                                                coordinate={{
                                                    ...realTimeLocation,
                                                }}>
                                                <View style={{width: 50, height: 50}}>
                                                    <ServiceProviderMarkerSvg width="100%" height="100%" fill="#fff" />
                                                </View>
                                            </Marker>
                                        ) : null}
                                    </MapView>
                                    <TouchableRipple
                                        style={{
                                            position: 'absolute',
                                            right: 16,
                                            bottom: 16,
                                            borderRadius: 24,
                                            zIndex: 100,
                                        }}
                                        borderless
                                        rippleColor="rgba(0, 0, 0, .32)"
                                        onPress={() => {
                                            try {
                                                if (!!realTimeLocation) {
                                                    mapViewRef.current.fitToSuppliedMarkers(
                                                        ['customerLocationMarker', 'serviceProviderLocationMarker'],
                                                        {edgePadding: {top: 100, right: 100, bottom: 100, left: 100}},
                                                    );
                                                    return;
                                                }

                                                mapViewRef.current.animateCamera({
                                                    center: {
                                                        ...requestData?.requestLocation?.addressCoor,
                                                    },
                                                    zoom: 11,
                                                });
                                            } catch (err) {
                                                console.log(err);
                                            }
                                        }}>
                                        <View
                                            style={{
                                                width: 48,
                                                height: 48,
                                                opacity: 0.7,
                                                borderRadius: 24,
                                                overflow: 'hidden',
                                                backgroundColor: 'white',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <MaterialIcon name="my-location" size={20} color={CustomColors.GRAY_DARK} />
                                        </View>
                                    </TouchableRipple>
                                </View>
                            ) : null} */}
                        </View>
                    </View>
                </ScrollView>
                <Portal>
                    <BottomSheet
                        ref={jobRequestActionSheet}
                        // ref="BottomSheet"
                        initialPosition={0}
                        snapPoints={[0, 130]}
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
                                        jobRequestActionSheet.current.snapTo(0);
                                        setCancelJobDialog({isVisible: true, requestId: requestId});
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
                                            <MaterialCommunityIcons
                                                name="cancel"
                                                size={24}
                                                color={CustomColors.GRAY_DARK}
                                            />
                                        </View>
                                        <Text style={styles.actionButtonLabel}>Cancel this Job</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </Portal>
            </SafeAreaView>
        </View>
    );
};

export default ViewRequest;

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
    inputPrompt: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingVertical: 2,
        marginTop: 8,
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
