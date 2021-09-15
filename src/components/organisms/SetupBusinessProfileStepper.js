import CustomFormikTextInput from '@molecules/CustomFormikTextInput';
import {CustomColors, CustomTypography} from '@styles';
import {FastField, Field, Formik} from 'formik';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactNative, {TouchableWithoutFeedback} from 'react-native';
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
import {Button, HelperText, Menu, Searchbar, Surface, TextInput, TouchableRipple} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import StepIndicator from 'react-native-step-indicator';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as yup from 'yup';
import LoadingModal from './LoadingModal';
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
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {showMessage} from 'react-native-flash-message';
import Swiper from 'react-native-swiper';
import MapView from 'react-native-maps';
import AutocompleteInput from '@atoms/AutocompleteInput';
import MapService from '@services/MapService';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {debounce} from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const validationSchema = yup.object().shape({
    businessCategory: yup.string().required('Business category is mandatory.'),
    serviceType: yup.string().required('Service type is mandatory.'),
    businessName: yup.string().required('Business name is mandatory.'),
    businessDesc: yup.string().required('Business desc is mandatory.'),
    businessServiceDesc: yup.string().max(1000).required('Business Service Description is mandatory.'),
    priceStart: yup
        .string()
        .max(20)
        .required('Starting price is mandatory.')
        .matches(/^\d*\.?\d*$/, 'Only numbers is allowed'),
    priceEnd: yup
        .string()
        .max(20)
        .required('Ending price is mandatory.')
        .matches(/^\d*\.?\d*$/, 'Only numbers is allowed')
        .when('priceStart', priceStart => {
            if (priceStart) {
                return yup
                    .string()
                    .max(20)
                    .required('Ending price is mandatory.')
                    .typeError('Ending Price is required')
                    .test('price range', 'Ending Price must be larger than start price', endPrice => {
                        if (!endPrice) {
                            //If value is empty
                            return true;
                        }

                        return parseFloat(endPrice) > parseFloat(priceStart);
                    });
            }
        }),
});

const SetupBusinessProfileStepper = () => {
    const stepIndicatorList = [
        {
            label: 'Business\nProfile',
            icon: (position, stepStatus) =>
                stepStatus == 'finished' ? (
                    <FontAwesome5 name="user-tie" size={20} color={CustomColors.PRIMARY_BLUE} />
                ) : (
                    <FontAwesome5
                        name="user-tie"
                        size={stepStatus == 'current' ? 24 : 20}
                        s
                        color={CustomColors.WHITE}
                    />
                ),
        },
        {
            label: 'Service\nCoverage',
            icon: (position, stepStatus) =>
                stepStatus == 'finished' ? (
                    <Ionicons name="location-sharp" size={20} color={CustomColors.PRIMARY_BLUE} />
                ) : (
                    <Ionicons
                        name="location-sharp"
                        size={stepStatus == 'current' ? 24 : 20}
                        color={CustomColors.WHITE}
                    />
                ),
        },
        {
            label: 'Additional\nInput',
            icon: (position, stepStatus) =>
                stepStatus == 'finished' ? (
                    <Ionicons name="document-text" size={20} color={CustomColors.PRIMARY_BLUE} />
                ) : (
                    <Ionicons
                        name="document-text"
                        size={stepStatus == 'current' ? 24 : 20}
                        color={CustomColors.WHITE}
                    />
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
    const [userInput, setUserInput] = useState({});

    const [initialFormValue, setInitialFormValue] = useState({
        businessCategory: 'car',
        serviceType: '',
        businessName: '',
        businessDesc: '',
        businessServiceDesc: '',
        priceStart: '',
        priceEnd: '',
    });

    const [coverImagePath, setCoverImagePath] = useState(null);
    const [businessLogoPath, setBusinessLogoPath] = useState('');
    const [showClearIcon, setShowClearIcon] = useState(false);
    const [searchBary, setSearchBary] = useState(0);

    const [addressQuery, setAddressQuery] = useState('');
    const [addressQueryResult, setAddressQueryResult] = useState([]);
    const [showAddressSuggestion, setShowAddressSuggestion] = useState(false);

    const coverImageActionSheet = useRef(null);
    const businessLogoActionSheet = useRef(null);
    const swiperRef = useRef(null);
    const serviceCoverageSectionScrollViewRef = useRef(null);
    const addressSearchBarRef = useRef(null);

    const searchAddress = async query => {
        try {
            const res = await MapService.searchAddress(query);
            console.log(res);
            const queryResult = res.results.map(result => {
                return {
                    addressCoor: {
                        lat: result.position.lat,
                        lon: result.position.lon,
                    },
                    addressFullName: result.address.freeformAddress,
                    id: result.id,
                };
            });

            setAddressQueryResult(queryResult);
        } catch (err) {
            console.log('search address error');
            console.log(err);
        }
    };

    const searchAddressCallback = useCallback(debounce(searchAddress, 1000), []);

    const businessCategory = {
        car: {
            displayName: 'Car Maintenance',
            icon: (values, key) => {
                return (
                    <CategoryCarIcon
                        fill={values.businessCategory == key ? CustomColors.WHITE : CustomColors.PRIMARY_BLUE}
                    />
                );
            },
        },
        deviceRepair: {
            displayName: 'Device Maintenance',
            icon: (values, key) => {
                return (
                    <CategoryDeviceIcon
                        fill={values.businessCategory == key ? CustomColors.WHITE : CustomColors.PRIMARY_BLUE}
                    />
                );
            },
        },
        educationLesson: {
            displayName: 'Education Lesson',
            icon: (values, key) => {
                return (
                    <CategoryEducationIcon
                        fill={values.businessCategory == key ? CustomColors.WHITE : CustomColors.PRIMARY_BLUE}
                    />
                );
            },
        },
        event: {
            displayName: 'Events',
            icon: (values, key) => {
                return (
                    <CategoryEventIcon
                        fill={values.businessCategory == key ? CustomColors.WHITE : CustomColors.PRIMARY_BLUE}
                    />
                );
            },
        },
        healthCare: {
            displayName: 'Health Care',
            icon: (values, key) => {
                return (
                    <CategoryHealthIcon
                        fill={values.businessCategory == key ? CustomColors.WHITE : CustomColors.PRIMARY_BLUE}
                    />
                );
            },
        },
        home: {
            displayName: 'Home Maintenance',
            icon: (values, key) => {
                return (
                    <CategoryMaintenanceIcon
                        fill={values.businessCategory == key ? CustomColors.WHITE : CustomColors.PRIMARY_BLUE}
                    />
                );
            },
        },
        personalCare: {
            displayName: 'Personal Care',
            icon: (values, key) => {
                return (
                    <CategoryPersonalIcon
                        fill={values.businessCategory == key ? CustomColors.WHITE : CustomColors.PRIMARY_BLUE}
                    />
                );
            },
        },
        petCare: {
            displayName: 'Pet Care',
            icon: (values, key) => {
                return (
                    <CategoryPetIcon
                        fill={values.businessCategory == key ? CustomColors.WHITE : CustomColors.PRIMARY_BLUE}
                    />
                );
            },
        },
    };

    const serviceTypes = {
        home: [
            {
                displayName: 'Cleaning',
                serviceId: 'cleaning',
            },
            {
                displayName: 'Plumber',
                serviceId: 'plumber',
            },
            {
                displayName: 'Electrical / Wiring',
                serviceId: 'electricalWiring',
            },
            {
                displayName: 'Air Conditioner Maintenance',
                serviceId: 'airCond',
            },
            {
                displayName: 'Landscape / Gardening',
                serviceId: 'landscapeGarden',
            },
            {
                displayName: 'Interior Design',
                serviceId: 'interiorDesign',
            },
            {
                displayName: 'Pest Control',
                serviceId: 'pestControl',
            },
        ],

        personalCare: [
            {
                displayName: 'Saloon',
                serviceId: 'saloon',
            },
            {
                displayName: 'Massage Service',
                serviceId: 'massage',
            },
        ],
        car: [
            {
                displayName: 'Car Maintenance',
                serviceId: 'carWash',
            },
            {
                displayName: 'Wind Screen Replacement',
                serviceId: 'windScreenReplacement',
            },
        ],
        deviceRepair: [
            {
                displayName: 'Computer Repair',
                serviceId: 'computerRepair',
            },
            {
                displayName: 'Phone Repair',
                serviceId: 'phoneRepair',
            },
        ],
        educationLesson: [
            {
                displayName: 'Fitness Course',
                serviceId: 'fitness',
            },
            {
                displayName: 'Language Course',
                serviceId: 'language',
            },
        ],
        event: [
            {
                displayName: 'Catering Organize',
                serviceId: 'catering',
            },
            {
                displayName: 'Photographer / Videographer',
                serviceId: 'photographerVideographer',
            },
            {
                displayName: 'WeddingOrganize',
                serviceId: 'wedding',
            },
        ],
        healthCare: [
            {
                displayName: 'Medical Care',
                serviceId: 'medical',
            },
            {
                displayName: 'Psychologist',
                serviceId: 'psychologist',
            },
            {
                displayName: 'Physical Therapy',
                serviceId: 'physicalTherapy',
            },
        ],
        petCare: [
            {
                displayName: 'Pet Saloon',
                serviceId: 'petSaloon',
            },
            {
                displayName: 'Pet Medical',
                serviceId: 'petMedical',
            },
        ],
    };

    const [loadingModal, setLoadingModal] = useState({
        isVisible: false,
        modalTitle: 'Creating account...',
    });

    const renderStepIndicator = ({position, stepStatus}) => {
        return stepIndicatorList[position].icon(position, stepStatus);
    };

    useEffect(() => {
        console.log('hellow');
    }, [addressQuery]);

    useEffect(() => {}, []);

    return (
        <View style={{backgroundColor: CustomColors.PRIMARY_BLUE}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={styles.bigContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Setup Your Business Profile</Text>
                        <StepIndicator
                            style={{marginTop: 10}}
                            renderStepIndicator={renderStepIndicator}
                            customStyles={stepIndicatorCustomStyles}
                            currentPosition={1}
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
                            keyboardShouldPersistTaps="handled"
                            loop={false}>
                            <View style={styles.businessProfileSetupContainer}>
                                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                                    <View style={{flex: 1, padding: 20}}>
                                        <Text style={styles.sectionTitle}>Business Profile</Text>
                                        <Text style={styles.sectionDesc}>
                                            Complete the details about your business.
                                        </Text>
                                        <Text style={styles.subSectionTitle}>Business Type</Text>
                                        <Formik
                                            initialValues={initialFormValue}
                                            validationSchema={validationSchema}
                                            onSubmit={(values, settings) => {
                                                const {
                                                    businessCategory,
                                                    serviceType,
                                                    businessName,
                                                    businessDesc,
                                                    businessServiceDesc,
                                                    priceStart,
                                                    priceEnd,
                                                } = values;

                                                setUserInput({
                                                    businessProfile: {
                                                        businessCategory: businessCategory,
                                                        serviceType: serviceType,
                                                        businessName: businessName,
                                                        businessDesc: businessDesc,
                                                        businessServiceDesc: businessServiceDesc,
                                                        priceStart: priceStart,
                                                        priceEnd: priceEnd,
                                                        coverImagePath: coverImagePath,
                                                        businessLogoPath: businessLogoPath,
                                                    },
                                                });

                                                swiperRef.current.scrollBy(1);
                                            }}>
                                            {({
                                                handleSubmit,
                                                values,
                                                handleChange,
                                                isValid,
                                                errors,
                                                resetForm,
                                                isSubmitting,
                                            }) => {
                                                return (
                                                    <>
                                                        <View style={styles.categorySelectWrapper}>
                                                            <Text style={[styles.inputTitle, {marginBottom: 8}]}>
                                                                Please specify your business type:
                                                            </Text>
                                                            <FastField name="businessCategory">
                                                                {props => {
                                                                    const {
                                                                        field: {name, onBlur, onChange, value},
                                                                        form: {errors, touched, setFieldTouched},
                                                                        ...inputProps
                                                                    } = props;

                                                                    return (
                                                                        <>
                                                                            {Object.keys(businessCategory).map(
                                                                                (key, index) => (
                                                                                    <TouchableRipple
                                                                                        key={key}
                                                                                        style={
                                                                                            styles.categoryButtonWrapper
                                                                                        }
                                                                                        borderless
                                                                                        onPress={() => {
                                                                                            console.log('prfesseed');
                                                                                            onChange(name)(key);
                                                                                            // handleChange('serviceType')('');
                                                                                        }}
                                                                                        rippleColor="rgba(0, 0, 0, .1)">
                                                                                        <View
                                                                                            style={[
                                                                                                styles.categoryButton,
                                                                                                {
                                                                                                    backgroundColor:
                                                                                                        value == key
                                                                                                            ? CustomColors.PRIMARY_BLUE
                                                                                                            : CustomColors.WHITE,
                                                                                                    borderColor:
                                                                                                        value == key
                                                                                                            ? CustomColors.PRIMARY_BLUE
                                                                                                            : CustomColors.PRIMARY_BLUE_SATURATED,
                                                                                                },
                                                                                            ]}>
                                                                                            <View
                                                                                                style={{
                                                                                                    width: 36,
                                                                                                    height: 36,
                                                                                                }}>
                                                                                                {businessCategory[
                                                                                                    key
                                                                                                ].icon(values, key)}
                                                                                                <CategoryCarIcon />
                                                                                            </View>
                                                                                            <Text
                                                                                                style={[
                                                                                                    styles.categoryButtonLabel,
                                                                                                    {
                                                                                                        color:
                                                                                                            values.businessCategory ==
                                                                                                            key
                                                                                                                ? CustomColors.WHITE
                                                                                                                : CustomColors.PRIMARY_BLUE,
                                                                                                    },
                                                                                                ]}>
                                                                                                {
                                                                                                    businessCategory[
                                                                                                        key
                                                                                                    ].displayName
                                                                                                }
                                                                                            </Text>
                                                                                        </View>
                                                                                    </TouchableRipple>
                                                                                ),
                                                                            )}
                                                                        </>
                                                                    );
                                                                }}
                                                            </FastField>
                                                        </View>
                                                        <View>
                                                            <Text style={[styles.inputTitle, {marginTop: 16}]}>
                                                                What type of service you provide:
                                                            </Text>
                                                            <RNPickerSelect
                                                                placeholder={{
                                                                    label: 'Select your service type',
                                                                    value: null,
                                                                }}
                                                                items={serviceTypes[values.businessCategory].map(
                                                                    serviceType => ({
                                                                        label: serviceType.displayName,
                                                                        value: serviceType.serviceId,
                                                                    }),
                                                                )}
                                                                onValueChange={value => {
                                                                    handleChange('serviceType')(value || '');
                                                                }}
                                                                style={{
                                                                    ...pickerSelectStyles,
                                                                    iconContainer: {
                                                                        top: 10,
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
                                                                value={values.serviceType}
                                                            />
                                                            <HelperText type="error" style={styles.errorText}>
                                                                {errors['serviceType']}
                                                            </HelperText>
                                                        </View>

                                                        <Text style={styles.subSectionTitle}>Business Details</Text>
                                                        <Text style={[styles.inputTitle, {marginTop: 8}]}>
                                                            Tell us about your service business.
                                                        </Text>
                                                        <View style={styles.imageSetupContainer}>
                                                            <TouchableHighlight
                                                                onPress={() => {
                                                                    coverImageActionSheet.current.snapTo(1);
                                                                }}
                                                                activeOpacity={0.6}
                                                                underlayColor="#FFFFFF">
                                                                <Image
                                                                    style={styles.coverImage}
                                                                    source={
                                                                        !!coverImagePath
                                                                            ? {uri: coverImagePath}
                                                                            : require('@assets/images/default-coverImage.png')
                                                                    }
                                                                    resizeMode="cover"
                                                                />
                                                            </TouchableHighlight>
                                                            <TouchableHighlight
                                                                style={styles.businessProfileImageWrapper}
                                                                onPress={() => {
                                                                    businessLogoActionSheet.current.snapTo(1);
                                                                }}
                                                                activeOpacity={0.6}
                                                                underlayColor="#FFFFFF">
                                                                <Image
                                                                    style={styles.businessProfileImage}
                                                                    source={
                                                                        !!businessLogoPath
                                                                            ? {uri: businessLogoPath}
                                                                            : require('@assets/images/default-profileImage.png')
                                                                    }
                                                                />
                                                            </TouchableHighlight>
                                                        </View>
                                                        <Field
                                                            component={CustomFormikTextInput}
                                                            mode="outlined"
                                                            style={styles.inputPrompt}
                                                            label="Business Name"
                                                            name="businessName"
                                                            placeholder="Your business name"></Field>
                                                        <Field
                                                            component={CustomFormikTextInput}
                                                            mode="outlined"
                                                            style={[styles.inputPrompt]}
                                                            label="Business Desc"
                                                            name="businessDesc"
                                                            placeholder="Your business description"
                                                            numberOfLines={5}
                                                            multiline></Field>
                                                        <Field
                                                            component={CustomFormikTextInput}
                                                            mode="outlined"
                                                            style={[styles.inputPrompt]}
                                                            label="What service that your business provide?"
                                                            name="businessServiceDesc"
                                                            placeholder={
                                                                'Ex: We provide a wide range of services which includes: \n1) ...\n2) ...\n3) ...'
                                                            }
                                                            numberOfLines={7}
                                                            multiline></Field>
                                                        <Text style={styles.subSectionTitle}>Pricing</Text>
                                                        <Text style={[styles.inputTitle, {marginTop: 8}]}>
                                                            Tell your customer a little bit about your pricing.
                                                        </Text>
                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                marginTop: 8,
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                            }}>
                                                            <View style={{flex: 1, marginTop: 0, height: 120}}>
                                                                <Field
                                                                    component={CustomFormikTextInput}
                                                                    mode="outlined"
                                                                    style={[styles.inputPrompt]}
                                                                    left={<TextInput.Affix text="RM" />}
                                                                    label="Price Start"
                                                                    name="priceStart"
                                                                    placeholder="Starting Price"
                                                                    keyboardType="numeric"></Field>
                                                            </View>
                                                            <Text style={{marginBottom: 30}}>{'   ~   '}</Text>
                                                            <View style={{flex: 1, marginTop: 0, height: 120}}>
                                                                <Field
                                                                    component={CustomFormikTextInput}
                                                                    mode="outlined"
                                                                    style={[styles.inputPrompt]}
                                                                    left={<TextInput.Affix text="RM" />}
                                                                    label="Price End"
                                                                    name="priceEnd"
                                                                    placeholder="Ending Price"
                                                                    keyboardType="numeric"></Field>
                                                            </View>
                                                        </View>

                                                        <View style={styles.actionBtnContainer}>
                                                            <Button
                                                                style={styles.actionBtn}
                                                                mode="contained"
                                                                disabled={isSubmitting}
                                                                contentStyle={{height: 50}}
                                                                color={CustomColors.PRIMARY_BLUE}
                                                                dark
                                                                onPress={() => {
                                                                    if (Object.keys(errors).length > 0) {
                                                                        swiperRef.current.scrollBy(1);
                                                                        showMessage({
                                                                            message:
                                                                                'Please make sure all inputs are valid.',
                                                                            type: 'info',
                                                                            position: 'center',
                                                                            backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                                                            color: 'white', // text color
                                                                            titleStyle: {marginTop: 5},
                                                                            hideOnPress: true,
                                                                            autoHide: true,
                                                                            duration: 1000,
                                                                        });
                                                                    } else {
                                                                        handleSubmit();
                                                                    }
                                                                }}>
                                                                NEXT
                                                            </Button>
                                                        </View>
                                                    </>
                                                );
                                            }}
                                        </Formik>
                                    </View>
                                </ScrollView>
                            </View>
                            <ScrollView ref={serviceCoverageSectionScrollViewRef} contentContainerStyle={{flexGrow: 1}}>
                                <View style={styles.serviceLocationSetupContainer}>
                                    <Text style={styles.sectionTitle}>Service Coverage Setup</Text>
                                    <Text style={styles.sectionDesc}>
                                        Please specify your service location and coverage. Only customer who are in your
                                        area of service could see your service.{' '}
                                    </Text>
                                    <Text style={styles.subSectionTitle}>Business Type</Text>
                                    <View
                                        style={{width: '100%'}}
                                        onLayout={event => {
                                            var {x, y, width, height} = event.nativeEvent.layout;
                                            console.log('onlayout', event.nativeEvent.layout);

                                            setSearchBary(y);
                                        }}>
                                        <Menu
                                            onDismiss={() => {
                                                setAddressQueryResult([]);
                                            }}
                                            contentStyle={{height: 200}}
                                            style={{marginTop: 80, left: 22, right: 22, padding: 0}}
                                            anchor={
                                                <Searchbar
                                                    ref={addressSearchBarRef}
                                                    style={[styles.searchBar]}
                                                    onChangeText={text => {
                                                        LayoutAnimation.configureNext(
                                                            LayoutAnimation.Presets.easeInEaseOut,
                                                        );
                                                        setShowClearIcon(text.length > 0);
                                                        setAddressQuery(text);
                                                        searchAddressCallback(addressQuery);
                                                    }}
                                                    value={addressQuery}
                                                    inputStyle={{padding: 0, margin: 0, fontSize: 14}}
                                                    onFocus={event => {
                                                        // `bind` the function if you're using ES6 classes
                                                        console.log('y is ', searchBary);
                                                        addressSearchBarRef.current.blur();
                                                        addressSearchBarRef.current.focus();
                                                        serviceCoverageSectionScrollViewRef.current.scrollTo({
                                                            x: 0,
                                                            y: searchBary,
                                                            animated: true,
                                                        });
                                                        // serviceCoverageSectionScrollViewRef.current.props.scrollToFocusedInput(
                                                        //     ReactNative.findNodeHandle(event.target),
                                                        // );
                                                    }}
                                                    icon={() => <FeatherIcon name="search" size={20} />}
                                                    clearIcon={() =>
                                                        showClearIcon ? <MaterialIcon name="cancel" size={20} /> : null
                                                    }
                                                    placeholder="Find your service"
                                                />
                                            }
                                            visible={addressQueryResult.length > 0}>
                                            {addressQueryResult.map(addr => (
                                                <TouchableRipple
                                                    key={addr.id}
                                                    rippleColor="rgba(0, 0, 0, .32)"
                                                    onPress={() => {
                                                        setUserInput({
                                                            ...userInput,
                                                            serviceCoverage: {
                                                                addressCoor: {
                                                                    lat: addr.addressCoor.lat,
                                                                    lon: addr.addressCoor.lon,
                                                                },
                                                                addressFullName: addr.addressFullName,
                                                            },
                                                        });
                                                        setAddressQuery(addr.addressFullName);
                                                        setAddressQueryResult([]);
                                                    }}>
                                                    <View
                                                        style={{
                                                            width: '100%',
                                                            padding: 16,
                                                            paddingVertical: 8,
                                                            backgroundColor: 'transparent',
                                                        }}>
                                                        <Text style={styles.addressSearchResult}>
                                                            {addr.addressFullName}
                                                        </Text>
                                                    </View>
                                                </TouchableRipple>
                                            ))}

                                            {/* {array.map((value, index) => (
                                        <Menu.Item title={`${query}_${index}`} onPress={() => setMenuVisible(false)} />
                                    ))} */}
                                        </Menu>
                                    </View>
                                    <MapView style={{width: '100%', height: 200}}></MapView>
                                    <View style={styles.actionBtnContainer}>
                                        <Button
                                            style={styles.actionBtn}
                                            mode="contained"
                                            contentStyle={{height: 50}}
                                            color={CustomColors.PRIMARY_BLUE}
                                            dark
                                            onPress={() => {
                                                showMessage({
                                                    message: 'Please make sure all inputs are valid.',
                                                    type: 'info',
                                                    position: 'center',
                                                    backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                                    color: 'white', // text color
                                                    titleStyle: {marginTop: 5},
                                                    hideOnPress: true,
                                                    autoHide: true,
                                                    duration: 1000,
                                                });
                                            }}>
                                            NEXT
                                        </Button>
                                    </View>
                                </View>
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
                </View>
            </SafeAreaView>
            <BottomSheet
                ref={coverImageActionSheet}
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
                                    width: 1200,
                                    height: 600,
                                    cropping: true,
                                    mediaType: 'photo',
                                })
                                    .then(image => {
                                        setCoverImagePath(image.path);
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
                                        setBusinessLogoPath(image.path);
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
                                        setBusinessLogoPath(image.path);
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
                                setBusinessLogoPath(null);
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

export default SetupBusinessProfileStepper;

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
        fontSize: CustomTypography.FONT_SIZE_24,
        color: CustomColors.WHITE,
        textAlign: 'center',
        marginBottom: 20,
    },
    inputPrompt: {
        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingVertical: 2,
        marginTop: 8,
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
    sectionTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_24,
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
    categorySelectWrapper: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 0,
    },
    categoryButtonWrapper: {
        width: '49%',
        borderRadius: 8,
        marginTop: 8,
    },
    categoryButton: {
        padding: 12,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: CustomColors.WHITE,
        borderWidth: 1,
        borderColor: CustomColors.PRIMARY_BLUE_SATURATED,
    },
    categoryButtonLabel: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_12,
        color: CustomColors.GRAY_DARK,
    },
    inputTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.GRAY_DARK,
    },
    imageSetupContainer: {
        width: '100%',
        paddingBottom: 50,
        marginBottom: 16,
        marginTop: 16,
    },
    coverImage: {
        width: Dimensions.get('window').width,
        marginLeft: -20,
        height: undefined,
        aspectRatio: 5 / 2,
    },
    businessProfileImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    businessProfileImageWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        position: 'absolute',
        left: 0,
        bottom: 0,
        borderWidth: 3,
        borderColor: CustomColors.WHITE,
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
    businessProfileSetupContainer: {
        width: '100%',
        flex: 1,
    },
    serviceLocationSetupContainer: {
        flex: 1,
        width: '100%',
        padding: 20,
    },
    searchBar: {
        alignItems: 'center',
        borderRadius: 8,
        width: '100%',
        height: 40,
        elevation: 0,
        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
    },
    addressSearchResult: {
        fontSize: CustomTypography.FONT_SIZE_14,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
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
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderColor: CustomColors.GRAY,
        color: CustomColors.GRAY_DARK,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomWidth: 1,
        paddingRight: 30, // to ensure the text is never behind the icon
        fontSize: CustomTypography.FONT_SIZE_14,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK,
    },
    errorText: {
        fontSize: CustomTypography.FONT_SIZE_12,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: 'red',
        margin: 0,
        padding: 0,
    },
});
