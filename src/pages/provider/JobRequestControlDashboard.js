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
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {
    TextInput,
    Button,
    IconButton,
    Avatar,
    Portal,
    Dialog,
    Checkbox,
    RadioButton,
    TouchableRipple,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, TabBar, SceneMap, PagerPan} from 'react-native-tab-view';
import RequestService from '@services/RequestService';
import moment from 'moment';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Constants} from '~constants';
import MapView, {Marker} from 'react-native-maps';
import GeoLocationUtils from '@utils/GeoLocationUtils';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import ServiceProviderMarkerSvg from '@assets/images/service-provider-marker';

const JobRequestControlDashboard = ({route}) => {
    const navigation = useNavigation();
    const requestId = route.params.requestId;

    const mapViewRef = useRef(null);

    const [requestData, setRequestData] = useState({});
    const [customerFormInputDisplayDialog, setCustomerFormInputDisplayDialog] = useState({
        isVisible: false,
        customerFormResponse: [],
    });

    const [googleMapRedirectDialog, setGoogleMapRedirectDialog] = useState({
        isVisible: false,
        redirectCoordinate: '',
    });

    const [startJobDialog, setStartJobDialog] = useState({
        isVisible: false,
        requestId: '',
    });

    var realTimeLocationWatcher = null;
    const [realTimeLocation, setRealTimeLocation] = useState(null);

    useEffect(() => {
        const unsubscriber = RequestService.getRequestById(setRequestData, requestId);

        return () => {
            unsubscriber();
        };
    }, []);

    useEffect(() => {
        if (
            requestData?.serviceStatus == Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS &&
            realTimeLocationWatcher == null
        ) {
            realTimeLocationWatcher = Geolocation.watchPosition(
                position => {
                    console.log('my real time position');
                    console.log(position);
                    setRealTimeLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    try {
                        RequestService.updateRequest(
                            {
                                serviceProviderRealTimePosition: {
                                    coor: {
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                    },
                                },
                            },
                            requestId,
                        );
                    } catch (err) {
                        console.log(err);
                    }
                },
                error => {
                    console.log(error);
                },
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1},
            );
        }

        if (requestData?.serviceStatus != Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS) {
            if (!!realTimeLocationWatcher) Geolocation.clearWatch(realTimeLocationWatcher);
            setRealTimeLocation(null);
        }
        return () => {
            if (!!realTimeLocationWatcher) Geolocation.clearWatch(realTimeLocationWatcher);
            realTimeLocationWatcher = null;
        };
    }, [requestData]);

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
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
                                Job Request Control Dashboard
                            </Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Avatar.Text
                                        color={'white'}
                                        size={40}
                                        label={requestData?.customerInfo?.lastName?.charAt(0)}
                                    />
                                    <View style={{marginLeft: 16}}>
                                        <Text style={styles.customerName}>
                                            {requestData?.customerInfo?.firstName +
                                                ' ' +
                                                requestData?.customerInfo?.lastName}
                                        </Text>
                                        <Text style={styles.requestedDateTime}>
                                            requested at{' '}
                                            {moment(new Date(requestData?.dateTimeRequested)).format(
                                                'YYYY-MM-DD hh:mm A',
                                            )}
                                        </Text>
                                    </View>
                                </View>
                                <Button onPress={() => {}}>Chat</Button>
                            </View>
                            <View
                                style={{
                                    width: '100%',
                                    marginTop: 24,
                                    padding: 8,
                                    borderRadius: 10,
                                    backgroundColor:
                                        requestData?.serviceStatus == Constants.SERVICE_STATUS.WAITING_FOR_SERVICE
                                            ? '#a8a8a8'
                                            : requestData?.serviceStatus == Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS
                                            ? CustomColors.PRIMARY_BLUE
                                            : '#95F985',
                                }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: CustomTypography.FONT_SIZE_16,
                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                        color: CustomColors.WHITE,
                                    }}>
                                    Status:{' '}
                                    {requestData?.serviceStatus == Constants.SERVICE_STATUS.WAITING_FOR_SERVICE
                                        ? 'WAITING TO SERVICE'
                                        : null}
                                    {requestData?.serviceStatus == Constants.SERVICE_STATUS.SERVICE_IN_PROGRESS
                                        ? 'SERVICE IN PROGESSING'
                                        : null}
                                    {requestData?.serviceStatus == Constants.SERVICE_STATUS.SERVICE_COMPLETED
                                        ? 'SERVICE COMPLETED'
                                        : null}
                                </Text>
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
                            {!!requestData?.requestLocation?.addressCoor ? (
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
                                            zIndex: 1000,
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
                            ) : null}
                            {requestData?.serviceStatus == Constants.SERVICE_STATUS.WAITING_FOR_SERVICE ? (
                                <View style={styles.actionBtnContainer}>
                                    <Button
                                        style={styles.actionBtn}
                                        mode="contained"
                                        contentStyle={{height: 50}}
                                        color={CustomColors.PRIMARY_BLUE}
                                        dark
                                        onPress={() => {
                                            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                                                interval: 10000,
                                                fastInterval: 5000,
                                            })
                                                .then(data => {
                                                    // The user has accepted to enable the location services
                                                    // data can be :
                                                    //  - "already-enabled" if the location services has been already enabled
                                                    //  - "enabled" if user has clicked on OK button in the popup

                                                    if (!GeoLocationUtils.hasLocationPermission()) {
                                                        return;
                                                    }

                                                    setStartJobDialog({isVisible: true, requestId: requestId});
                                                })
                                                .catch(err => {
                                                    // The user has not accepted to enable the location services or something went wrong during the process
                                                    // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
                                                    // codes :
                                                    //  - ERR00 : The user has clicked on Cancel button in the popup
                                                    //  - ERR01 : If the Settings change are unavailable
                                                    //  - ERR02 : If the popup has failed to open
                                                    //  - ERR03 : Internal error
                                                });
                                        }}>
                                        Start Service and notify customer
                                    </Button>
                                </View>
                            ) : null}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>

            <Portal>
                <Dialog
                    visible={googleMapRedirectDialog.isVisible}
                    onDismiss={() => {
                        setGoogleMapRedirectDialog({isVisible: false});
                    }}>
                    <Dialog.Title>Redirect to Google Maps</Dialog.Title>
                    <Dialog.Content>
                        <Text>
                            Do you want to view the actual location at google map? you will be redirect to google map
                            app.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            style={{width: 80}}
                            color={CustomColors.GRAY}
                            onPress={() => {
                                setGoogleMapRedirectDialog({isVisible: false});
                            }}>
                            No
                        </Button>
                        <Button
                            style={{width: 80}}
                            onPress={() => {
                                var url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${googleMapRedirectDialog.redirectCoordinate}`;
                                Linking.canOpenURL(url)
                                    .then(supported => {
                                        if (!supported) {
                                            console.log("Can't handle url: " + url);
                                        } else {
                                            return Linking.openURL(url);
                                        }
                                    })
                                    .catch(err => console.error('An error occurred', err));

                                setGoogleMapRedirectDialog({isVisible: false});
                            }}>
                            Yes
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Portal>
                <Dialog
                    visible={startJobDialog.isVisible}
                    onDismiss={() => {
                        setStartJobDialog({isVisible: false});
                    }}>
                    <Dialog.Title>Start job confirmation</Dialog.Title>
                    <Dialog.Content>
                        <Text>
                            Are you sure you want to start this job? This will notify the customer and this action
                            cannot be reverted.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            style={{width: 80}}
                            color={CustomColors.GRAY}
                            onPress={() => {
                                setStartJobDialog({isVisible: false});
                            }}>
                            No
                        </Button>
                        <Button
                            style={{width: 80}}
                            onPress={() => {
                                RequestService.startJobRequest(
                                    startJobDialog.requestId,
                                    requestData.customerInfo.userId,
                                )
                                    .then(data => {
                                        showMessage({
                                            message: 'Request Successfully started. Customer may now see your location',
                                            type: 'info',
                                            position: 'center',
                                            titleStyle: {marginTop: 5},
                                            backgroundColor: 'rgba(0,0,0,0.6)', // background color 
                                            color: 'white', // text color
                                            hideOnPress: true,
                                            autoHide: true,
                                            duration: 1000,
                                        });
                                        setStartJobDialog({isVisible: false});
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            }}>
                            Yes
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Portal>
                <Dialog
                    style={{backgroundColor: CustomColors.WHITE}}
                    visible={customerFormInputDisplayDialog.isVisible}
                    dismissable={false}
                    needsOffscreenAlphaCompositing={true} //Fix Elevation animating issue
                    onDismiss={() => {
                        setCustomerFormInputDisplayDialog({...customerFormInputDisplayDialog, isVisible: false});
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                        }}>
                        <Text style={styles.dialogTitle}>Customer Form Response</Text>
                        <IconButton
                            icon="close"
                            size={24}
                            color={CustomColors.GRAY_DARK}
                            onPress={() => {
                                setCustomerFormInputDisplayDialog({isVisible: false, customerFormResponse: []});
                            }}></IconButton>
                    </View>

                    <Dialog.ScrollArea style={{paddingHorizontal: 0, paddingVertical: 0}}>
                        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{flexGrow: 1}}>
                            <View style={{widht: '100%', flex: 1, paddingHorizontal: 16, paddingVertical: 24}}>
                                {customerFormInputDisplayDialog.customerFormResponse.map((currentQuestion, index) => (
                                    <View
                                        style={styles.questionSetupWrapper}
                                        needsOffscreenAlphaCompositing={true} //Fix Elevation animating issue
                                        key={currentQuestion.id}>
                                        <Text style={[styles.inputTitle, {marginTop: 8, marginLeft: 8}]}>
                                            {currentQuestion.questionName}
                                        </Text>
                                        {currentQuestion.questionType == Constants.QUESTIONNAIRE_TYPE.TEXT_ANSWER ? (
                                            <TextInput
                                                disabled
                                                mode="outlined"
                                                label="Customer response"
                                                multiline
                                                placeholder="Your question"
                                                style={[styles.inputPrompt]}
                                                value={currentQuestion.response}></TextInput>
                                        ) : null}

                                        {currentQuestion.questionType ==
                                        Constants.QUESTIONNAIRE_TYPE.TEXT_ANSWER ? null : (
                                            <View style={{marginTop: 16}}>
                                                {currentQuestion.options.map((option, i) => (
                                                    <View
                                                        style={{flexDirection: 'row', alignItems: 'center'}}
                                                        key={option.optionId}>
                                                        {currentQuestion.questionType ==
                                                        Constants.QUESTIONNAIRE_TYPE.CHECK_BOX ? (
                                                            <Checkbox
                                                                style={{marginTop: 5}}
                                                                status={
                                                                    currentQuestion.response.includes(
                                                                        option.optionId.toString(),
                                                                    )
                                                                        ? 'checked'
                                                                        : 'unchecked'
                                                                }
                                                                disabled
                                                            />
                                                        ) : null}
                                                        {currentQuestion.questionType ==
                                                        Constants.QUESTIONNAIRE_TYPE.MULTIPLE_CHOICE ? (
                                                            <RadioButton
                                                                status={
                                                                    currentQuestion.response == option.optionId
                                                                        ? 'checked'
                                                                        : 'unchecked'
                                                                }
                                                                disabled
                                                            />
                                                        ) : null}
                                                        <TextInput
                                                            disabled
                                                            mode="flat"
                                                            label=""
                                                            placeholder="Option name"
                                                            style={[
                                                                styles.inputPrompt,
                                                                {
                                                                    flex: 1,
                                                                    height: 36,
                                                                    marginHorizontal: 8,
                                                                    marginTop: 0,
                                                                    backgroundColor: 'transparent',
                                                                },
                                                            ]}
                                                            value={option.optionName}
                                                        />
                                                        <View style={{width: 30, height: 30}}></View>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </Dialog.ScrollArea>
                </Dialog>
            </Portal>
        </View>
    );
};

export default JobRequestControlDashboard;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
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
});
