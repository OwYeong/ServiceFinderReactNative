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

const BookServicePage = ({route}) => {
    const navigation = useNavigation();
    const providerId = route.params.providerId;
    const stepIndicatorList = [
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
    ];
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

    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [dateTimePickerMode, setDateTimePickerMode] = useState('date');
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);

    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [providerNotAvailableAtHisHour, setProviderNotAvailableAtHisHour] = useState(false);

    const [providerInfo, setProviderInfo] = useState(null);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [bookNowNotAvailable, setBookNowNotAvailable] = useState(false);

    const swiperRef = useRef(null);

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

    useEffect(()=>{
        if (!isFetchingData) {
            if (
                !!providerInfo?.workingHours &&
                moment(new Date()).isAfter(
                    moment(new Date()).set({
                        hour: providerInfo.workingHours.endHour,
                        minute: 0,
                        second: 0,
                        millisecond: 0,
                    }),
                ) ||
                moment(new Date()).isBefore(
                    moment(new Date()).set({
                        hour: providerInfo.workingHours.startHour,
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
                        .set({hour: providerInfo.workingHours.startHour, minute: 0, second: 0, millisecond: 0})
                        .toDate(),
                );
                setSelectedTime(
                    moment()
                        .add(1, 'day')
                        .startOf('day')
                        .set({hour: providerInfo.workingHours.startHour, minute: 0, second: 0, millisecond: 0})
                        .toDate(),
                );

                setBookNowNotAvailable(true);
            }
        }
    },[selectedDateTime])

    useEffect(() => {
        if (!!providerInfo?.workingHours) {
            if (
                moment(selectedTime).hours() < providerInfo.workingHours.startHour ||
                moment(selectedTime).hours() >= providerInfo.workingHours.endHour
            ) {
                setProviderNotAvailableAtHisHour(true);
            } else {
                setProviderNotAvailableAtHisHour(false);
            }
        }
    }, [selectedTime]);

    useEffect(() => {
        if (!isFetchingData) {
            if (
                !!providerInfo?.workingHours &&
                moment(new Date()).isAfter(
                    moment(new Date()).set({
                        hour: providerInfo.workingHours.endHour,
                        minute: 0,
                        second: 0,
                        millisecond: 0,
                    }),
                ) ||
                moment(new Date()).isBefore(
                    moment(new Date()).set({
                        hour: providerInfo.workingHours.startHour,
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
                        .set({hour: providerInfo.workingHours.startHour, minute: 0, second: 0, millisecond: 0})
                        .toDate(),
                );
                setSelectedTime(
                    moment()
                        .add(1, 'day')
                        .startOf('day')
                        .set({hour: providerInfo.workingHours.startHour, minute: 0, second: 0, millisecond: 0})
                        .toDate(),
                );

                setBookNowNotAvailable(true);
            }
        }
    }, [isFetchingData]);

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
                        <StepIndicator
                            style={{marginTop: 30}}
                            renderStepIndicator={renderStepIndicator}
                            customStyles={stepIndicatorCustomStyles}
                            currentPosition={currentSwiperIndex}
                            stepCount={3}
                            labels={stepIndicatorList.map(e => e.label)}
                        />
                    </View>

                    <View style={styles.contentContainer}>
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
                                            setBookType(value || '');
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
                                            <Ionicons name="md-chevron-down" size={20} fill={CustomColors.GRAY_DARK} />
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
                                                setShowDateTimePicker(true);
                                                setDateTimePickerMode('date');
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
                                                    {moment(selectedTime).format('hh: mm A')}
                                                </Text>
                                            </View>
                                        </TouchableRipple>

                                        {providerNotAvailableAtHisHour ? (
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
                                                    Provider not avaialbe at this hour
                                                </Text>
                                            </View>
                                        ) : null}
                                    </View>
                                ) : null}

                                {bookType=='now' && bookNowNotAvailable ? (
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
                                            Book now is not available for this provider.{'\n'}Try book for later
                                            instead.
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                                <View style={styles.serviceLocationSetupContainer}>
                                    <Text style={styles.sectionTitle}>Pick Service Date Time</Text>
                                    <Text style={styles.sectionDesc}>
                                        Please specify your service location and coverage. Only customer who are in your
                                        area of service could see your service.{' '}
                                    </Text>
                                </View>
                            </ScrollView>
                            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                                <View style={styles.additionalInputSetupContainer}></View>
                            </ScrollView>
                        </Swiper>
                    </View>

                    <LoadingModal
                        animationIn={'bounceIn'}
                        animationOut={'bounceOut'}
                        animationOutTiming={150}
                        isVisible={loadingModal.isVisible}
                        modalTitle={loadingModal.modalTitle}
                        statusBarTranslucent={true}
                        useNativeDriver={true}></LoadingModal>
                    {showDateTimePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={selectedDateTime}
                            mode={dateTimePickerMode}
                            is24Hour={false}
                            minimumDate={new Date()}
                            maximumDate={new Date().setDate(new Date().getDate() + 2)}
                            minuteInterval={30}
                            display="default"
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate || selectedDateTime;
                                setShowDateTimePicker(Platform.OS === 'ios');
                                setSelectedDateTime(currentDate);
                            }}
                        />
                    )}
                    {showTimePicker && (
                        <DateTimePicker
                            testID="timePicker"
                            value={selectedTime}
                            mode={'time'}
                            is24Hour={false}
                            minuteInterval={30}
                            display="spinner"
                            onChange={(event, selectedDate) => {
                                const currentTime = selectedDate || selectedTime;
                                setShowTimePicker(Platform.OS === 'ios');
                                setSelectedTime(currentTime);
                            }}
                        />
                    )}
                </View>
            </SafeAreaView>
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
