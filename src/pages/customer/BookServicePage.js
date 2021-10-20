import CustomFormikTextInput from '@molecules/CustomFormikTextInput';
import {CustomColors, CustomTypography} from '@styles';
import {FastField, Field, Formik} from 'formik';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactNative, {Alert, Keyboard, Platform, TouchableWithoutFeedback} from 'react-native';
import {
    LayoutAnimation,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import {
    ActivityIndicator,
    Button,
    Checkbox,
    HelperText,
    IconButton,
    Menu,
    RadioButton,
    Searchbar,
    Surface,
    TextInput,
    TouchableRipple,
} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import StepIndicator from 'react-native-step-indicator';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as yup from 'yup';
import LoadingModal from '@organisms/LoadingModal';
import RNPickerSelect from 'react-native-picker-select';
import {SvgCss} from 'react-native-svg';
import CategoryCarIcon from '@assets/images/serviceCategory/category-car';
import CategoryDeviceIcon from '@assets/images/serviceCategory/category-deviceRepair';
import CategoryEducationIcon from '@assets/images/serviceCategory/category-educationLesson';
import CategoryEventIcon from '@assets/images/serviceCategory/category-event';
import CategoryHealthIcon from '@assets/images/serviceCategory/category-healthCare';
import CategoryMaintenanceIcon from '@assets/images/serviceCategory/category-maintenance';
import CategoryPersonalIcon from '@assets/images/serviceCategory/category-personalCare';
import CategoryPetIcon from '@assets/images/serviceCategory/category-petCare';
import Animated from 'react-native-reanimated';
import BottomSheet from 'react-native-bottomsheet-reanimated';
import ImageCropPicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import {showMessage} from 'react-native-flash-message';
import Swiper from 'react-native-swiper';
import MapView, {Circle, Marker, OverlayComponent} from 'react-native-maps';
import AutocompleteInput from '@atoms/AutocompleteInput';
import MapService from '@services/MapService';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {debounce} from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import GeoLocationUtils from '@utils/GeoLocationUtils';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {getBoundsOfDistance, isPointInPolygon} from 'geolib';
import FormIllustrationSvg from '@assets/images/form-illustration';
import {Constants} from '~constants';
import ProviderService from '@services/ProviderService';
import moment from 'moment';
import UserService from '@services/UserService';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import DateTimePicker from '@react-native-community/datetimepicker';
import {CardField, useConfirmPayment} from '@stripe/stripe-react-native';
import PaymentService from '@services/PaymentService';
import RequestService from '@services/RequestService';
import firebase from '@react-native-firebase/app';

const BookServicePage = ({route}) => {
    const navigation = useNavigation();
    const userInfo = useSelector(state => state.loginState.userInfo);

    const {confirmPayment, loading} = useConfirmPayment();

    const providerId = route.params.providerId;
    const [stepIndicatorList, setStepIndicatorList] = useState([
        {
            label: 'Service\nDate / Time',
            icon: (position, stepStatus) =>
                stepStatus == 'finished' ? (
                    <FontAwesome5 name="calendar-check" size={20} color={CustomColors.PRIMARY_BLUE} />
                ) : (
                    <FontAwesome5
                        name="calendar-alt"
                        size={stepStatus == 'current' ? 24 : 20}
                        color={CustomColors.WHITE}
                    />
                ),
        },
        {
            label: 'Information\nPrompt',
            icon: (position, stepStatus) =>
                stepStatus == 'finished' ? (
                    <MaterialCommunityIcons name="file-document-edit" size={20} color={CustomColors.PRIMARY_BLUE} />
                ) : (
                    <MaterialCommunityIcons
                        name="file-document-edit"
                        size={stepStatus == 'current' ? 24 : 20}
                        color={CustomColors.WHITE}
                    />
                ),
        },
        {
            label: 'Payment\nDetail',
            icon: (position, stepStatus) =>
                stepStatus == 'finished' ? (
                    <MaterialIcons name="payment" size={20} color={CustomColors.PRIMARY_BLUE} />
                ) : (
                    <MaterialIcons name="payment" size={stepStatus == 'current' ? 24 : 20} color={CustomColors.WHITE} />
                ),
        },
    ]);
    const stepIndicatorCustomStyles = {
        stepIndicatorSize: 40,
        currentStepIndicatorSize: 45,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: CustomColors.WHITE,
        stepStrokeWidth: 2,
        separatorStrokeFinishedWidth: 3,
        stepStrokeFinishedColor: CustomColors.WHITE,
        stepStrokeUnFinishedColor: CustomColors.WHITE,
        separatorFinishedColor: CustomColors.WHITE,
        separatorUnFinishedColor: CustomColors.WHITE,
        stepIndicatorFinishedColor: CustomColors.WHITE,
        stepIndicatorUnFinishedColor: CustomColors.PRIMARY_BLUE,
        stepIndicatorCurrentColor: CustomColors.PRIMARY_BLUE,
        stepIndicatorLabelFontSize: 12,
        currentStepIndicatorLabelFontSize: 12,
        stepIndicatorLabelCurrentColor: CustomColors.WHITE,
        stepIndicatorLabelFinishedColor: CustomColors.PRIMARY_BLUE,
        stepIndicatorLabelUnFinishedColor: CustomColors.WHITE,
        labelColor: CustomColors.WHITE,
        labelSize: CustomTypography.FONT_SIZE_12,
        labelFontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        currentStepLabelColor: CustomColors.WHITE,
        stepIndicatorContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'transparent', // change the color to "rgba(1,0,0,0)"
        },
    };

    const [loadingModal, setLoadingModal] = useState({
        isVisible: false,
        modalTitle: 'Creating account...',
    });

    const [currentSwiperIndex, setCurrentSwiperIndex] = useState(0);
    const [bookType, setBookType] = useState('now');

    const [selectedDateTime, setSelectedDateTime] = useState(
        moment().add(1, 'day').minutes(0).seconds(0).milliseconds(0).toDate(),
    );
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [providerOffDay, setProviderOffDay] = useState(false);
    const [isProviderTimetableClash, setIsProviderTimetableClash] = useState(false);

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [providerNotAvailableAtHisHour, setProviderNotAvailableAtHisHour] = useState(false);
    const [providerNotAvailableAtDateSelected, setProviderNotAvailableAtDateSelected] = useState(false);
    const [formResponse, setFormResponse] = useState([]);
    const [cardHolderName, setCardHolderName] = useState('');

    const [providerInfo, setProviderInfo] = useState(null);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [bookNowNotAvailable, setBookNowNotAvailable] = useState(false);

    const swiperRef = useRef(null);

    const submitServiceDateTime = async () => {
        setIsProviderTimetableClash(false);
        try {
            console.log(bookType);
            console.log(providerOffDay + '  ' + bookNowNotAvailable);
            const currentDateTime = moment().add(1, 'day').minutes(0).seconds(0).milliseconds(0).toDate();

            if (bookType == 'now') {
                if (bookType == 'now' && (bookNowNotAvailable || providerOffDay)) {
                    showMessage({
                        message: 'Book now not available.',
                        type: 'info',
                        position: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)', // background color
                        color: 'white', // text color
                        titleStyle: {marginTop: 5},
                        hideOnPress: true,
                        autoHide: true,
                        duration: 2000,
                    });
                    return;
                }

                const isTimeTableClashOccur = await RequestService.checkIfRequestTimeIsAvailableForServiceProvider(
                    currentDateTime,
                    providerId,
                );

                if (isTimeTableClashOccur) {
                    showMessage({
                        message: 'Service provider is busy now.',
                        type: 'info',
                        position: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)', // background color
                        color: 'white', // text color
                        titleStyle: {marginTop: 5},
                        hideOnPress: true,
                        autoHide: true,
                        duration: 2000,
                    });
                    setIsProviderTimetableClash(true);
                    return;
                }
            } else {
                if (bookType == 'later' && (providerNotAvailableAtHisHour || providerNotAvailableAtDateSelected)) {
                    showMessage({
                        message: 'Please pick a valid date and time.',
                        type: 'info',
                        position: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)', // background color
                        color: 'white', // text color
                        titleStyle: {marginTop: 5},
                        hideOnPress: true,
                        autoHide: true,
                        duration: 2000,
                    });
                    return;
                }

                const isTimeTableClashOccur = await RequestService.checkIfRequestTimeIsAvailableForServiceProvider(
                    selectedDateTime,
                    providerId,
                );

                if (isTimeTableClashOccur) {
                    showMessage({
                        message: 'Service provider is busy at selected date time.',
                        type: 'info',
                        position: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)', // background color
                        color: 'white', // text color
                        titleStyle: {marginTop: 5},
                        hideOnPress: true,
                        autoHide: true,
                        duration: 2000,
                    });

                    setIsProviderTimetableClash(true);
                    return;
                }
            }

            swiperRef.current.scrollBy(1);
        } catch (error) {
            console.log(errorF);
        }
    };

    const submitFormResponse = () => {
        swiperRef.current.scrollBy(1);
    };

    const createNewServiceRequest = async doorstepServiceFeeStripeRef => {
        try {
            if (!providerInfo?.withAdditionalForm) {
                //without additional form
                const requestData = {
                    customerInfo: {
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        phoneNumber: userInfo.phoneNumber,
                        userId: auth().currentUser.uid,
                    },
                    dateTimeRequested: firebase.firestore.FieldValue.serverTimestamp(),
                    doorstepServiceFee: 10,
                    requestLocation: {
                        ...userInfo.serviceAddress,
                    },
                    requestStatus: Constants.REQUEST_STATUS.PENDING,
                    requestTimeSlot: {
                        start: bookType == 'now' ? moment().toDate() : selectedDateTime,
                        end:
                            bookType == 'now'
                                ? moment().add(1, 'hours').toDate()
                                : moment(selectedDateTime).add(1, 'hours').toDate(),
                    },
                    serviceProvider: {
                        businessCategory: providerInfo?.businessCategory,
                        businessLogoUrl: providerInfo?.businessLogoUrl,
                        businessName: providerInfo?.businessName,
                        serviceType: providerInfo?.serviceType,
                        userId: providerInfo?.id,
                    },
                    serviceStatus: Constants.SERVICE_STATUS.WAITING_FOR_SERVICE,
                    doorstepServiceFeeStripeRef: doorstepServiceFeeStripeRef,
                };

                const newDocumentId = await RequestService.createRequest(requestData);

                navigation.navigate('viewRequest', {requestId: newDocumentId});
            } else {
                //with additional form
                const requestData = {
                    customerFormResponse: [...formResponse],
                    customerInfo: {
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        phoneNumber: userInfo.phoneNumber,
                        userId: auth().currentUser.uid,
                    },
                    dateTimeRequested: firebase.firestore.FieldValue.serverTimestamp(),
                    doorstepServiceFee: 10,
                    requestLocation: {
                        ...userInfo.serviceAddress,
                    },
                    requestStatus: Constants.REQUEST_STATUS.PENDING,
                    requestTimeSlot: {
                        start: bookType == 'now' ? moment().toDate() : selectedDateTime,
                        end:
                            bookType == 'now'
                                ? moment().add(1, 'hours').toDate()
                                : moment(selectedDateTime).add(1, 'hours').toDate(),
                    },
                    serviceProvider: {
                        businessCategory: providerInfo?.businessCategory,
                        businessLogoUrl: providerInfo?.businessLogoUrl,
                        businessName: providerInfo?.businessName,
                        serviceType: providerInfo?.serviceType,
                        userId: providerInfo?.id,
                    },
                    // doorStepServiceFeeStripeRef:
                    serviceStatus: Constants.SERVICE_STATUS.WAITING_FOR_SERVICE,
                    doorstepServiceFeeStripeRef: doorstepServiceFeeStripeRef,
                };

                const newDocumentId = await RequestService.createRequest(requestData);
                console.log(newDocumentId);
                showMessage({
                    message: 'Service request placed successfully',
                    type: 'info',
                    position: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)', // background color
                    color: 'white', // text color
                    titleStyle: {marginTop: 5},
                    hideOnPress: true,
                    autoHide: true,
                    duration: 2000,
                });
                navigation.navigate('ViewRequest', {requestId: newDocumentId});
            }
        } catch (error) {
            console.log(error);
            showMessage({
                message: 'Some Error Occurs.',
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

    const payAndProceed = async () => {
        // 1. fetch Intent Client Secret from backend
        const clientSecret = await PaymentService.fetchPaymentIntentClientSecret(10.0);

        // 2. Gather customer billing information (ex. email)
        const billingDetails = {
            name: cardHolderName,
        };

        if (clientSecret == null) {
            showMessage({
                message: 'Some error occured, please try again later.',
                type: 'info',
                position: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)', // background color
                color: 'white', // text color
                titleStyle: {marginTop: 5},
                hideOnPress: true,
                autoHide: true,
                duration: 2000,
            });
            return;
        }

        const {error, paymentIntent} = await confirmPayment(clientSecret, {
            type: 'Card',
            billingDetails,
        });
        console.log(error);
        if (error || cardHolderName == '') {
            showMessage({
                message: 'Payment Details is incomplete.',
                type: 'info',
                position: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)', // background color
                color: 'white', // text color
                titleStyle: {marginTop: 5},
                hideOnPress: true,
                autoHide: true,
                duration: 2000,
            });
        } else if (paymentIntent) {
            console.log('calling createNewServiceRequest');
            createNewServiceRequest(paymentIntent.clientSecret);
        }
    };

    const serviceDateTimeSubmitCallback = debounce(submitServiceDateTime.bind(this), 500);
    const formResponseSubmitCallback = debounce(submitFormResponse.bind(this), 500);
    const payAndProceedCallback = debounce(payAndProceed.bind(this), 500);

    const renderStepIndicator = ({position, stepStatus}) => {
        return stepIndicatorList[position].icon(position, stepStatus);
    };

    useEffect(() => {
        const unsubscriber = ProviderService.getProviderById(data => {
            setProviderInfo(data);

            setTimeout(() => {
                setIsFetchingData(false);
            }, 1000);

            return () => {
                unsubscriber();
            };
        }, providerId);
    }, []);

    useEffect(() => {
        if (!isFetchingData) {
            if (
                (!!providerInfo?.workingHours &&
                    moment(new Date()).isAfter(
                        moment(new Date()).set({
                            hour: providerInfo?.workingHours?.endHour,
                            minute: 0,
                            second: 0,
                            millisecond: 0,
                        }),
                    )) ||
                moment(new Date()).isBefore(
                    moment(new Date()).set({
                        hour: providerInfo?.workingHours?.startHour,
                        minute: 0,
                        second: 0,
                        millisecond: 0,
                    }),
                )
            ) {
                setBookNowNotAvailable(true);
            }

            if (!!providerInfo?.workingHours) {
                console.log('hehehe');
                if (
                    moment(selectedDateTime).hours() < providerInfo?.workingHours?.startHour ||
                    moment(selectedDateTime).hours() >= providerInfo?.workingHours?.endHour
                ) {
                    setProviderNotAvailableAtHisHour(true);
                } else {
                    setProviderNotAvailableAtHisHour(false);
                }
            }

            if (
                bookType == 'later' &&
                providerInfo?.dateNotAvailable.indexOf(moment(selectedDateTime).format('YYYY-MM-DD')) !== -1
            ) {
                setProviderNotAvailableAtDateSelected(true);
            } else {
                setProviderNotAvailableAtDateSelected(false);
            }
        }
    }, [selectedDateTime]);

    useEffect(() => {
        if (!isFetchingData) {
            if (!providerInfo?.withAdditionalForm) {
                setStepIndicatorList([
                    {
                        label: 'Service\nDate / Time',
                        icon: (position, stepStatus) =>
                            stepStatus == 'finished' ? (
                                <FontAwesome5 name="calendar-check" size={20} color={CustomColors.PRIMARY_BLUE} />
                            ) : (
                                <FontAwesome5
                                    name="calendar-alt"
                                    size={stepStatus == 'current' ? 24 : 20}
                                    color={CustomColors.WHITE}
                                />
                            ),
                    },
                    {
                        label: 'Payment\nDetail',
                        icon: (position, stepStatus) =>
                            stepStatus == 'finished' ? (
                                <MaterialIcons name="payment" size={20} color={CustomColors.PRIMARY_BLUE} />
                            ) : (
                                <MaterialIcons
                                    name="payment"
                                    size={stepStatus == 'current' ? 24 : 20}
                                    color={CustomColors.WHITE}
                                />
                            ),
                    },
                ]);
            } else {
                setFormResponse([
                    ...providerInfo?.additionalForm.map(ques => {
                        switch (ques.questionType) {
                            case Constants.QUESTIONNAIRE_TYPE.TEXT_ANSWER:
                                ques.response = 'Your Answer';
                                break;
                            case Constants.QUESTIONNAIRE_TYPE.CHECK_BOX:
                                ques.response = [ques.options[0].optionId];
                                break;
                            case Constants.QUESTIONNAIRE_TYPE.MULTIPLE_CHOICE:
                                ques.response = ques.options[0].optionId;
                                break;
                        }

                        return ques;
                    }),
                ]);
            }

            if (
                !!providerInfo?.dateNotAvailable &&
                providerInfo?.dateNotAvailable.indexOf(moment().format('YYYY-MM-DD')) !== -1
            ) {
                setProviderOffDay(true);
            }

            if (
                (!!providerInfo?.workingHours &&
                    moment(new Date()).isAfter(
                        moment(new Date()).set({
                            hour: providerInfo?.workingHours?.endHour,
                            minute: 0,
                            second: 0,
                            millisecond: 0,
                        }),
                    )) ||
                moment(new Date()).isBefore(
                    moment(new Date()).set({
                        hour: providerInfo?.workingHours?.startHour,
                        minute: 0,
                        second: 0,
                        millisecond: 0,
                    }),
                )
            ) {
                setSelectedDateTime(
                    moment()
                        .add(1, 'day')
                        .startOf('day')
                        .set({hour: providerInfo?.workingHours?.startHour, minute: 0, second: 0, millisecond: 0})
                        .toDate(),
                );
                setBookNowNotAvailable(true);
            }
        }
    }, [isFetchingData]);

    useEffect(() => {
        if (bookType == 'later') {
            if (providerInfo?.dateNotAvailable.indexOf(moment(selectedDateTime).format('YYYY-MM-DD')) !== -1) {
                setProviderNotAvailableAtDateSelected(true);
            } else {
                setProviderNotAvailableAtDateSelected(false);
            }
        }
    }, [bookType]);

    return (
        <View style={{backgroundColor: CustomColors.PRIMARY_BLUE}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={styles.bigContainer}>
                    <View style={styles.headerContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: -16, marginBottom: 30}}>
                            <IconButton
                                icon="arrow-back"
                                color={CustomColors.WHITE}
                                size={CustomTypography.ICON_SMALL}
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            />
                            <Text style={styles.headerTitle}>Book Service</Text>
                        </View>
                        {!isFetchingData ? (
                            <StepIndicator
                                style={{marginTop: 30}}
                                renderStepIndicator={renderStepIndicator}
                                customStyles={stepIndicatorCustomStyles}
                                currentPosition={currentSwiperIndex}
                                stepCount={!!providerInfo?.withAdditionalForm ? 3 : 2}
                                labels={stepIndicatorList.map(e => e.label)}
                            />
                        ) : null}
                    </View>

                    <View style={styles.contentContainer}>
                        {!isFetchingData ? (
                            <Swiper
                                ref={swiperRef}
                                showsButtons={false}
                                showsPagination={false}
                                scrollEnabled={false}
                                onIndexChanged={index => {
                                    setCurrentSwiperIndex(index);
                                }}
                                keyboardShouldPersistTaps="handled"
                                loop={false}>
                                <View style={{width: '100%', flex: 1, padding: 20}}>
                                    <Text style={styles.sectionTitle}>Pick Service Date And Time</Text>
                                    <View style={{marginTop: 24}}>
                                        <RNPickerSelect
                                            placeholder={{}}
                                            items={[
                                                {
                                                    label: 'Book Service For Now',
                                                    value: 'now',
                                                },
                                                {
                                                    label: 'Book Service For Later',
                                                    value: 'later',
                                                },
                                            ]}
                                            onValueChange={value => {
                                                console.log('value change' + value);
                                                setBookType(value);
                                            }}
                                            style={{
                                                ...pickerSelectStyles,
                                                iconContainer: {
                                                    top: 13,
                                                    right: 12,
                                                },
                                            }}
                                            useNativeAndroidPickerStyle={false}
                                            Icon={() => (
                                                <Ionicons
                                                    name="md-chevron-down"
                                                    size={20}
                                                    fill={CustomColors.GRAY_DARK}
                                                />
                                            )}
                                            value={bookType}
                                        />
                                    </View>
                                    {bookType == 'later' ? (
                                        <View
                                            style={{
                                                marginTop: 24,
                                            }}>
                                            <View
                                                style={{
                                                    width: '100%',
                                                    height: 1,
                                                    backgroundColor: CustomColors.GRAY,
                                                }}></View>
                                            <TouchableRipple
                                                style={{
                                                    marginTop: 24,
                                                }}
                                                onPress={() => {
                                                    setShowDatePicker(true);
                                                }}>
                                                <View
                                                    style={{
                                                        padding: 16,
                                                        paddingVertical: 12,
                                                        borderRadius: 8,

                                                        borderWidth: 1,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        backgroundColor: 'white',
                                                    }}>
                                                    <MaterialCommunityIcons
                                                        name="calendar-month"
                                                        size={24}
                                                        color={CustomColors.GRAY}
                                                    />
                                                    <Text
                                                        style={{
                                                            marginLeft: 12,
                                                            fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                            fontSize: CustomTypography.FONT_SIZE_16,
                                                            color: CustomColors.GRAY_MEDIUM,
                                                        }}>
                                                        {moment(selectedDateTime).format('DD MMM YYYY')}
                                                    </Text>
                                                </View>
                                            </TouchableRipple>
                                            <TouchableRipple
                                                style={{
                                                    marginTop: 12,
                                                }}
                                                onPress={() => {
                                                    setShowTimePicker(true);
                                                }}>
                                                <View
                                                    style={{
                                                        padding: 16,
                                                        paddingVertical: 12,
                                                        borderRadius: 8,
                                                        borderWidth: 1,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}>
                                                    <MaterialCommunityIcons
                                                        name="clock-time-three-outline"
                                                        size={24}
                                                        color={CustomColors.GRAY}
                                                    />
                                                    <Text
                                                        style={{
                                                            marginLeft: 12,
                                                            fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                            fontSize: CustomTypography.FONT_SIZE_16,
                                                            color: CustomColors.GRAY_MEDIUM,
                                                        }}>
                                                        {moment(selectedDateTime).format('hh: mm A')}
                                                    </Text>
                                                </View>
                                            </TouchableRipple>

                                            {providerNotAvailableAtHisHour ? (
                                                <View
                                                    style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
                                                    <MaterialCommunityIcons
                                                        name="alert-circle-outline"
                                                        size={24}
                                                        color={CustomColors.ALERT}
                                                    />
                                                    <Text
                                                        style={{
                                                            marginLeft: 8,
                                                            fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                            fontSize: CustomTypography.FONT_SIZE_12,
                                                            color: CustomColors.ALERT,
                                                        }}>
                                                        Service provider not available at this hour. You can only
                                                        schedule the service request within the the service provider
                                                        business hours (
                                                        {moment(providerInfo?.workingHours?.startHour || '1', [
                                                            'HH',
                                                        ]).format('h A')}{' '}
                                                        to{' '}
                                                        {moment(providerInfo?.workingHours?.endHour || '1', [
                                                            'HH',
                                                        ]).format('h A')}
                                                        )
                                                    </Text>
                                                </View>
                                            ) : null}
                                            {providerNotAvailableAtDateSelected ? (
                                                <View
                                                    style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
                                                    <MaterialCommunityIcons
                                                        name="alert-circle-outline"
                                                        size={24}
                                                        color={CustomColors.ALERT}
                                                    />
                                                    <Text
                                                        style={{
                                                            marginLeft: 8,
                                                            fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                            fontSize: CustomTypography.FONT_SIZE_12,
                                                            color: CustomColors.ALERT,
                                                        }}>
                                                        This service provider is not operating on{' '}
                                                        {moment(selectedDateTime).format('DD MMM YYYY')}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    ) : null}

                                    {bookType == 'now' && bookNowNotAvailable ? (
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
                                            <MaterialCommunityIcons
                                                name="alert-circle-outline"
                                                size={24}
                                                color={CustomColors.ALERT}
                                            />
                                            <Text
                                                style={{
                                                    marginLeft: 8,
                                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                    fontSize: CustomTypography.FONT_SIZE_12,
                                                    color: CustomColors.ALERT,
                                                }}>
                                                Book now is only available between service provider's business hour (
                                                {moment(providerInfo?.workingHours?.startHour || '1', ['HH']).format(
                                                    'h A',
                                                )}{' '}
                                                to{' '}
                                                {moment(providerInfo?.workingHours?.endHour || '1', ['HH']).format(
                                                    'h A',
                                                )}
                                                )
                                            </Text>
                                        </View>
                                    ) : null}

                                    {bookType == 'now' && providerOffDay ? (
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
                                            <MaterialCommunityIcons
                                                name="alert-circle-outline"
                                                size={24}
                                                color={CustomColors.ALERT}
                                            />
                                            <Text
                                                style={{
                                                    marginLeft: 8,
                                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                    fontSize: CustomTypography.FONT_SIZE_12,
                                                    color: CustomColors.ALERT,
                                                }}>
                                                This Service Provider is not operating today.
                                            </Text>
                                        </View>
                                    ) : null}
                                    {isProviderTimetableClash ? (
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
                                            <MaterialCommunityIcons
                                                name="alert-circle-outline"
                                                size={24}
                                                color={CustomColors.ALERT}
                                            />
                                            <Text
                                                style={{
                                                    marginLeft: 8,
                                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                    fontSize: CustomTypography.FONT_SIZE_12,
                                                    color: CustomColors.ALERT,
                                                }}>
                                                This Service Provider is busy at selected date time. Please try to select another time.
                                            </Text>
                                        </View>
                                    ) : null}

                                    <View style={styles.actionBtnContainer}>
                                        <Button
                                            style={styles.actionBtn}
                                            mode="contained"
                                            contentStyle={{height: 50}}
                                            color={CustomColors.PRIMARY_BLUE}
                                            dark
                                            onPress={serviceDateTimeSubmitCallback}>
                                            NEXT
                                        </Button>
                                    </View>
                                </View>
                                {providerInfo?.withAdditionalForm ? (
                                    <ScrollView contentContainerStyle={{flexGrow: 1}}>
                                        <View style={{flex: 1, width: '100%', padding: 20}}>
                                            <Text style={styles.sectionTitle}>Fill in the form below</Text>
                                            <Text style={styles.sectionDesc}>
                                                Please fill in the form below. The following details are required by
                                                service provider.
                                            </Text>
                                            {formResponse.map((question, i) => {
                                                switch (question.questionType) {
                                                    case Constants.QUESTIONNAIRE_TYPE.TEXT_ANSWER:
                                                        return (
                                                            <View
                                                                style={{width: '100%', marginTop: 36}}
                                                                key={question.id}>
                                                                <Text style={styles.questionTitle}>
                                                                    {question.questionName}
                                                                </Text>
                                                                <TextInput
                                                                    label="Your Answer"
                                                                    mode="outlined"
                                                                    style={styles.inputPrompt}
                                                                    placeholder="Enter your answer"
                                                                    onEndEditing={e => {
                                                                        if (e.nativeEvent.text == '') {
                                                                            const newFormResponse = [...formResponse];

                                                                            newFormResponse[i].response = 'Your Answer';

                                                                            setFormResponse(newFormResponse);
                                                                        }
                                                                    }}
                                                                    onChangeText={text => {
                                                                        const newFormResponse = [...formResponse];

                                                                        newFormResponse[i].response = text;

                                                                        setFormResponse(newFormResponse);
                                                                    }}
                                                                    value={question.response}
                                                                    multiline></TextInput>
                                                            </View>
                                                        );
                                                    case Constants.QUESTIONNAIRE_TYPE.CHECK_BOX:
                                                        return (
                                                            <View
                                                                style={{width: '100%', marginTop: 36}}
                                                                key={question.id}>
                                                                <Text style={styles.questionTitle}>
                                                                    {question.questionName}
                                                                </Text>
                                                                <View>
                                                                    {question.options.map(option => (
                                                                        <Checkbox.Item
                                                                            key={option.optionId}
                                                                            color={CustomColors.PRIMARY_BLUE_SATURATED}
                                                                            style={{paddingHorizontal: 0}}
                                                                            onPress={() => {
                                                                                const newFormResponse = [
                                                                                    ...formResponse,
                                                                                ];
                                                                                const response =
                                                                                    [...formResponse[i].response] || [];

                                                                                if (
                                                                                    response.indexOf(option.optionId) !=
                                                                                    -1
                                                                                ) {
                                                                                    if (response.length == 1) {
                                                                                        return;
                                                                                    }
                                                                                    response.splice(
                                                                                        response.indexOf(
                                                                                            option.optionId,
                                                                                        ),
                                                                                        1,
                                                                                    );
                                                                                } else {
                                                                                    response.push(option.optionId);
                                                                                }
                                                                                newFormResponse[i].response = response;

                                                                                setFormResponse(newFormResponse);
                                                                            }}
                                                                            label={option.optionName}
                                                                            status={
                                                                                formResponse[i].response.indexOf(
                                                                                    option.optionId,
                                                                                ) != -1
                                                                                    ? 'checked'
                                                                                    : 'unchecked'
                                                                            }
                                                                        />
                                                                    ))}
                                                                </View>
                                                            </View>
                                                        );
                                                    case Constants.QUESTIONNAIRE_TYPE.MULTIPLE_CHOICE:
                                                        return (
                                                            <View
                                                                style={{width: '100%', marginTop: 36}}
                                                                key={question.id}>
                                                                <Text style={styles.questionTitle}>
                                                                    {question.questionName}
                                                                </Text>
                                                                <View>
                                                                    {question.options.map(option => (
                                                                        <RadioButton.Item
                                                                            key={option.optionId}
                                                                            color={CustomColors.PRIMARY_BLUE_SATURATED}
                                                                            style={{paddingHorizontal: 0}}
                                                                            onPress={() => {
                                                                                const newFormResponse = [
                                                                                    ...formResponse,
                                                                                ];

                                                                                newFormResponse[i].response =
                                                                                    option.optionId;

                                                                                setFormResponse(newFormResponse);
                                                                            }}
                                                                            label={option.optionName}
                                                                            status={
                                                                                formResponse[i].response ==
                                                                                option.optionId
                                                                                    ? 'checked'
                                                                                    : 'unchecked'
                                                                            }
                                                                        />
                                                                    ))}
                                                                </View>
                                                            </View>
                                                        );
                                                }
                                            })}
                                            <View style={styles.actionBtnContainer}>
                                                <Button
                                                    style={styles.actionBtn}
                                                    mode="contained"
                                                    contentStyle={{height: 50}}
                                                    color={CustomColors.PRIMARY_BLUE}
                                                    dark
                                                    onPress={formResponseSubmitCallback}>
                                                    NEXT
                                                </Button>
                                            </View>
                                        </View>
                                    </ScrollView>
                                ) : null}

                                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                                    <View style={{flex: 1, width: '100%', padding: 20}}>
                                        <Text style={styles.sectionTitle}>
                                            Make Payment Now and{'\n'}Place Your Service Request
                                        </Text>
                                        <Text style={styles.sectionDesc}>
                                            Please make a payment for the doorstep service fee ( RM 10 ). Please note
                                            that this payment will act as a deposit to the service request, hence this
                                            funds will not be return if you cancel the service request later.
                                        </Text>

                                        <View
                                            style={{
                                                padding: 12,
                                                backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                                                borderRadius: 12,
                                                elevation: 1,
                                                marginTop: 24,
                                            }}>
                                            <Text
                                                style={{
                                                    fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                    fontSize: CustomTypography.FONT_SIZE_16,
                                                    color: CustomColors.GRAY_MEDIUM,
                                                }}>
                                                Payment Details
                                            </Text>
                                            <Text
                                                style={{
                                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                                    fontSize: CustomTypography.FONT_SIZE_16,
                                                    color: CustomColors.GRAY_MEDIUM,
                                                }}>
                                                Doorstep service fee ( deposit ): {'\n'}RM 10.00
                                            </Text>
                                            <TextInput
                                                mode={'outlined'}
                                                style={[
                                                    styles.inputPrompt,
                                                    {marginTop: 20, height: 50, borderRadius: 34},
                                                ]}
                                                onChangeText={text => {
                                                    setCardHolderName(text);
                                                }}
                                                label="CardHolder Name"
                                                value={cardHolderName}
                                            />
                                            <CardField
                                                placeholder={{
                                                    number: '4242 4242 4242 4242',
                                                }}
                                                onCardChange={cardDetails => {
                                                    console.log('cardDetails', cardDetails);
                                                }}
                                                onFocus={focusedField => {
                                                    console.log('focusField', focusedField);
                                                }}
                                                cardStyle={inputStyles}
                                                style={styles.cardField}></CardField>
                                        </View>
                                        <View style={styles.actionBtnContainer}>
                                            <Button
                                                style={styles.actionBtn}
                                                mode="contained"
                                                contentStyle={{height: 50}}
                                                color={CustomColors.PRIMARY_BLUE}
                                                dark
                                                onPress={payAndProceedCallback}>
                                                Make Payment and proceed
                                            </Button>
                                        </View>
                                    </View>
                                </ScrollView>
                            </Swiper>
                        ) : null}
                    </View>

                    <LoadingModal
                        animationIn={'bounceIn'}
                        animationOut={'bounceOut'}
                        animationOutTiming={150}
                        isVisible={loadingModal.isVisible}
                        modalTitle={loadingModal.modalTitle}
                        statusBarTranslucent={true}
                        useNativeDriver={true}></LoadingModal>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={selectedDateTime}
                            mode={'date'}
                            is24Hour={false}
                            minimumDate={new Date().setDate(new Date().getDate() + 1)}
                            maximumDate={new Date().setDate(new Date().getDate() + 3)}
                            minuteInterval={30}
                            display="default"
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate || selectedDateTime;
                                setShowDatePicker(Platform.OS === 'ios');
                                setSelectedDateTime(currentDate);
                            }}
                        />
                    )}
                    {showTimePicker && (
                        <DateTimePicker
                            testID="timePicker"
                            value={selectedDateTime}
                            mode={'time'}
                            is24Hour={false}
                            minuteInterval={30}
                            display="spinner"
                            onChange={(event, selectedDate) => {
                                const currentTime = selectedDate || selectedDateTime;
                                setShowTimePicker(Platform.OS === 'ios');
                                setSelectedDateTime(currentTime);
                            }}
                        />
                    )}
                </View>
            </SafeAreaView>
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
        </View>
    );
};

export default BookServicePage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.PRIMARY_BLUE,
    },
    headerContainer: {
        width: '100%',
        backgroundColor: CustomColors.PRIMARY_BLUE,
        padding: 24,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: CustomColors.WHITE,
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        borderWidth: 2,
        borderColor: 'white',
        overflow: 'hidden',
    },
    headerTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.WHITE,
        textAlign: 'center',
    },
    sectionTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.GRAY_MEDIUM,
    },
    subSectionTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.GRAY_MEDIUM,
        marginTop: 16,
    },
    sectionDesc: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_18,
        color: CustomColors.GRAY_MEDIUM,
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
    },

    inputPrompt: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        borderRadius: 12,
        paddingVertical: 2,
    },
    questionTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_MEDIUM,
    },
    cardField: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        marginVertical: 12,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderColor: CustomColors.GRAY_DARK,
        color: CustomColors.GRAY_DARK,
        borderRadius: 8,
        borderWidth: 1,
        paddingRight: 30, // to ensure the text is never behind the icon
        fontSize: CustomTypography.FONT_SIZE_14,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
        backgroundColor: CustomColors.WHITE,
    },
    errorText: {
        fontSize: CustomTypography.FONT_SIZE_12,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: 'red',
        margin: 0,
        padding: 0,
    },
});

const inputStyles = {
    marginTop: 12,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    paddingVertical: 24,
    borderRadius: 8,
    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
    fontSize: 14,
    placeholderColor: '#999999',
};
