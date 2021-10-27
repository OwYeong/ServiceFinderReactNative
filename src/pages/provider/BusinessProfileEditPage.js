import {useNavigation} from '@react-navigation/core';
import ProviderService from '@services/ProviderService';
import UserService from '@services/UserService';
import {CustomColors, CustomTypography} from '@styles';
import {FastField, Field, Formik} from 'formik';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Alert,
    Image,
    Keyboard,
    LayoutAnimation,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {TextInput, Button, IconButton, HelperText, TouchableRipple, Searchbar, Menu} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import * as yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import CustomFormikTextInput from '@molecules/CustomFormikTextInput';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import GeoLocationUtils from '@utils/GeoLocationUtils';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {getBoundsOfDistance, isPointInPolygon} from 'geolib';

import CategoryCarIcon from '@assets/images/serviceCategory/category-car';
import CategoryDeviceIcon from '@assets/images/serviceCategory/category-deviceRepair';
import CategoryEducationIcon from '@assets/images/serviceCategory/category-educationLesson';
import CategoryEventIcon from '@assets/images/serviceCategory/category-event';
import CategoryHealthIcon from '@assets/images/serviceCategory/category-healthCare';
import CategoryMaintenanceIcon from '@assets/images/serviceCategory/category-maintenance';
import CategoryPersonalIcon from '@assets/images/serviceCategory/category-personalCare';
import CategoryPetIcon from '@assets/images/serviceCategory/category-petCare';
import {Constants} from '~constants';
import MapView, {Circle} from 'react-native-maps';
import MapService from '@services/MapService';
import {debounce} from 'lodash';
import LoadingModal from '@organisms/LoadingModal';

const validationSchema = yup.object().shape({
    businessCategory: yup.string().required('Business category is mandatory.'),
    serviceType: yup.string().required('Service type is mandatory.'),
    businessName: yup.string().required('Business name is mandatory.'),
    businessDesc: yup.string().required('Business desc is mandatory.'),
    businessServiceDesc: yup.string().max(1000).required('Business Service Description is mandatory.'),
    bankAccountNum: yup.string().max(30).required('Bank Account Number is mandatory.'),
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

const BusinessProfileEditPage = () => {
    const navigation = useNavigation();
    const providerInfo = useSelector(state => state.loginState.providerInfo);

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
                displayName: 'Car Wash',
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

    const [initialFormValue, setInitialFormValue] = useState({
        businessCategory: providerInfo?.businessCategory,
        serviceType: providerInfo?.serviceType,
        businessName: providerInfo?.businessName,
        businessDesc: !!providerInfo?.businessDesc ? providerInfo?.businessDesc.replaceAll('\\n', '\n') : '',
        businessServiceDesc: !!providerInfo?.businessServiceDesc
            ? providerInfo?.businessServiceDesc.replaceAll('\\n', '\n')
            : '',
        priceStart: providerInfo?.priceStart,
        priceEnd: providerInfo?.priceEnd,
        bankAccountNum: providerInfo?.bankAccountNum,
    });

    console.log(providerInfo?.serviceCoverage);
    const [userInput, setUserInput] = useState({
        serviceCoverage: {
            ...providerInfo?.serviceCoverage,

            coverageDistance: providerInfo?.serviceCoverage.coverageDistance.toString(),
        },
        additionalFormSetup: [
            {
                id: 1,
                questionName: 'Untitled Question',
                questionType: Constants.QUESTIONNAIRE_TYPE.TEXT_ANSWER,
                options: [],
            },
        ],
    });

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

    const [showClearIcon, setShowClearIcon] = useState(false);
    const [searchBary, setSearchBary] = useState(0);

    const [addressQuery, setAddressQuery] = useState('');
    const [addressQueryResult, setAddressQueryResult] = useState([]);

    const [loadingModal, setLoadingModal] = useState({
        isVisible: false,
        modalTitle: 'Editing Profile...',
    });

    const addressSearchBarRef = useRef(null);
    const mapViewRef = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {});
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            if (addressSearchBarRef.current.isFocused()) {
                setAddressQueryResult([]);
                addressSearchBarRef.current.blur();
            }
        });

        return () => {
            // clean up
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const editBusinessProfile = userInput => {
        setLoadingModal({isVisible: true, modalTitle: 'Editing profile'});
        console.log('editing');
        console.log(userInput);

        var providerData = {
            businessCategory: userInput.businessProfile.businessCategory,
            serviceType: userInput.businessProfile.serviceType,
            businessName: userInput.businessProfile.businessName,
            businessDesc: userInput.businessProfile.businessDesc,
            businessServiceDesc: userInput.businessProfile.businessServiceDesc,
            priceStart: userInput.businessProfile.priceStart,
            priceEnd: userInput.businessProfile.priceEnd,
            bankAccountNum: userInput.businessProfile.bankAccountNum,
            serviceCoverage: {...userInput.serviceCoverage},
        };
        console.log(providerData);
        ProviderService.updateProviderData(providerData)
            .then(data => {
                ProviderService.fetchProviderDataToRedux()
                    .then(data => {
                        navigation.goBack();
                    })
                    .catch(err => {});
            })
            .catch(err => {
                console.log(err)
                console.log('error when updating');
                showMessage({
                    message: 'Some error occurs. Please try again later.',
                    type: 'info',
                    position: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)', // background color
                    color: 'white', // text color
                    titleStyle: {marginTop: 5},
                    hideOnPress: true,
                    autoHide: true,
                    duration: 1000,
                });
            });
    };

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8}}>
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
                            marginTop: 2,
                        }}>
                        Edit Business Profile
                    </Text>
                </View>
                <ScrollView
                    ref={scrollViewRef}
                    onScroll={event => {
                        console.log(event.nativeEvent.contentOffset.y);
                    }}
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <Text style={[styles.subSectionTitle, {marginTop: 0}]}>Business Details</Text>
                        <Formik
                            initialValues={initialFormValue}
                            validationSchema={validationSchema}
                            onSubmit={(values, settings) => {
                                if (
                                    !userInput.serviceCoverage?.addressCoor &&
                                    !userInput.serviceCoverage?.addressFullName
                                ) {
                                    showMessage({
                                        message: 'Please select your service location first.',
                                        type: 'info',
                                        position: 'center',
                                        titleStyle: {marginTop: 5},
                                        backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                        color: 'white', // text color
                                        hideOnPress: true,
                                        autoHide: true,
                                        duration: 1000,
                                    });
                                    return;
                                }

                                const {
                                    businessCategory,
                                    serviceType,
                                    businessName,
                                    businessDesc,
                                    businessServiceDesc,
                                    priceStart,
                                    priceEnd,
                                    bankAccountNum,
                                } = values;

                                setUserInput({
                                    ...userInput,
                                    businessProfile: {
                                        businessCategory: businessCategory,
                                        serviceType: serviceType,
                                        businessName: businessName,
                                        businessDesc: !!businessDesc ? businessDesc.replaceAll('\n', '\\n') : '',
                                        businessServiceDesc: !!businessServiceDesc
                                            ? businessServiceDesc.replaceAll('\n', '\\n')
                                            : '',
                                        priceStart: priceStart,
                                        priceEnd: priceEnd,
                                        bankAccountNum: bankAccountNum,
                                    },
                                });

                                //Make sure the value is updated before calling editBusinessProfile
                                setUserInput(userInput => {
                                    console.log(userInput);

                                    editBusinessProfile(userInput);
                                    // return updated state
                                    return userInput;
                                });
                            }}>
                            {({handleSubmit, values, handleChange, isValid, errors, resetForm, isSubmitting}) => {
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
                                                            {Object.keys(businessCategory).map((key, index) => (
                                                                <TouchableRipple
                                                                    key={key}
                                                                    style={styles.categoryButtonWrapper}
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
                                                                            {businessCategory[key].icon(values, key)}
                                                                            <CategoryCarIcon />
                                                                        </View>
                                                                        <Text
                                                                            style={[
                                                                                styles.categoryButtonLabel,
                                                                                {
                                                                                    color:
                                                                                        values.businessCategory == key
                                                                                            ? CustomColors.WHITE
                                                                                            : CustomColors.PRIMARY_BLUE,
                                                                                },
                                                                            ]}>
                                                                            {businessCategory[key].displayName}
                                                                        </Text>
                                                                    </View>
                                                                </TouchableRipple>
                                                            ))}
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
                                                items={serviceTypes[values.businessCategory].map(serviceType => ({
                                                    label: serviceType.displayName,
                                                    value: serviceType.serviceId,
                                                }))}
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
                                        <Text style={styles.subSectionTitle}>Bank account details</Text>
                                        <Text style={[styles.inputTitle, {marginTop: 8}]}>
                                            The bank account will be used for ServiceFinder platform to tranfer the
                                            money you earned in the platform. This details will be kept private and
                                            confidential.
                                        </Text>
                                        <Field
                                            component={CustomFormikTextInput}
                                            mode="outlined"
                                            style={[styles.inputPrompt]}
                                            label="Bank Account Number"
                                            name="bankAccountNum"
                                            placeholder={'Your bank account number'}></Field>
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
                                        <Text style={styles.sectionTitle}>Service Coverage Setup</Text>
                                        <Text style={styles.sectionDesc}>
                                            Please specify your service location and coverage. Only customer who are in
                                            your area of service could see your service.{' '}
                                        </Text>
                                        <Text style={styles.subSectionTitle}>Selected Address</Text>
                                        <Text style={styles.inputTitle}>
                                            {userInput.serviceCoverage?.addressFullName || 'No address is selected'}
                                        </Text>
                                        <TextInput
                                            mode="outlined"
                                            label="Coverage Distance"
                                            placeholder="Your Coverage Distance"
                                            keyboardType="numeric"
                                            right={<TextInput.Affix text="KM" />}
                                            style={[styles.inputPrompt, {width: '50%'}]}
                                            value={userInput.serviceCoverage.coverageDistance}
                                            onChangeText={text => {
                                                setUserInput({
                                                    ...userInput,
                                                    serviceCoverage: {
                                                        ...userInput.serviceCoverage,
                                                        coverageDistance: text,
                                                    },
                                                });
                                            }}
                                            onEndEditing={e => {
                                                if (e.nativeEvent.text == '') {
                                                    setUserInput({
                                                        ...userInput,
                                                        serviceCoverage: {
                                                            ...userInput.serviceCoverage,
                                                            coverageDistance: '5',
                                                        },
                                                    });
                                                }
                                            }}
                                        />
                                        <View
                                            style={{width: '100%', marginTop: 16}}
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
                                                style={{marginTop: 70, left: 22, right: 22, padding: 0}}
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

                                                            if (!!text) {
                                                                searchAddressCallback(addressQuery);
                                                            }
                                                        }}
                                                        value={addressQuery}
                                                        inputStyle={{padding: 0, margin: 0, fontSize: 14}}
                                                        onFocus={event => {
                                                            // `bind` the function if you're using ES6 classes
                                                            console.log('y is ', searchBary);

                                                            scrollViewRef.current.scrollTo({
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
                                                            showClearIcon ? (
                                                                <MaterialIcon name="cancel" size={20} />
                                                            ) : null
                                                        }
                                                        onIconPress={() => {
                                                            console.log('clear clicked');
                                                        }}
                                                        placeholder="Find your service"
                                                    />
                                                }
                                                visible={addressQueryResult.length > 0}>
                                                <ScrollView
                                                    contentContainerStyle={{flexGrow: 1}}
                                                    keyboardShouldPersistTaps="always">
                                                    {addressQueryResult.map(addr => (
                                                        <TouchableRipple
                                                            key={addr.id}
                                                            rippleColor="rgba(0, 0, 0, .32)"
                                                            onPress={() => {
                                                                setUserInput({
                                                                    ...userInput,
                                                                    serviceCoverage: {
                                                                        ...userInput.serviceCoverage,
                                                                        addressCoor: {
                                                                            latitude: addr.addressCoor.lat,
                                                                            longitude: addr.addressCoor.lon,
                                                                        },
                                                                        addressFullName: addr.addressFullName,
                                                                    },
                                                                });
                                                                setAddressQuery(addr.addressFullName);
                                                                setAddressQueryResult([]);
                                                                const radiusBoundaries = getBoundsOfDistance(
                                                                    {
                                                                        latitude: addr.addressCoor.lat,
                                                                        longitude: addr.addressCoor.lon,
                                                                    },
                                                                    userInput.serviceCoverage.coverageDistance * 1000,
                                                                );
                                                                mapViewRef.current.fitToCoordinates(radiusBoundaries, {
                                                                    edgePadding: {
                                                                        top: 20,
                                                                        right: 20,
                                                                        bottom: 20,
                                                                        left: 20,
                                                                    },
                                                                });
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
                                                </ScrollView>

                                                {/* {array.map((value, index) => (
                                        <Menu.Item title={`${query}_${index}`} onPress={() => setMenuVisible(false)} />
                                    ))} */}
                                            </Menu>
                                        </View>
                                        <View style={styles.container}>
                                            <MapView
                                                ref={mapViewRef}
                                                showsUserLocation={false}
                                                rotateEnabled={false}
                                                showsMyLocationButton={false}
                                                onRegionChangeComplete={(region, {isGesture}) => {
                                                    console.log(region);
                                                    // setUserInput({
                                                    //     ...userInput,
                                                    //     serviceCoverage: {
                                                    //         addressCoor: {
                                                    //             latitude: region.latitude,
                                                    //             longitude: region.longitude,
                                                    //         },
                                                    //     },
                                                    // });
                                                    if (!userInput.serviceCoverage.addressCoor) {
                                                        return;
                                                    }
                                                    MapService.findAddressByGeoCode(
                                                        `${region.latitude},${region.longitude}`,
                                                    )
                                                        .then(response => {
                                                            setUserInput({
                                                                ...userInput,
                                                                serviceCoverage: {
                                                                    ...userInput.serviceCoverage,
                                                                    addressCoor: {
                                                                        latitude: region.latitude,
                                                                        longitude: region.longitude,
                                                                    },
                                                                    addressFullName:
                                                                        response.addresses[0].address.freeformAddress,
                                                                },
                                                            });
                                                            setAddressQuery(
                                                                response.addresses[0].address.freeformAddress,
                                                            );

                                                            console.log('asd');
                                                            // addressSearchBarRef.current.setNativeProps({ selection:{ start:0 } })
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        });
                                                }}
                                                initialCamera={{
                                                    altitude: 15000,
                                                    center: {
                                                        ...providerInfo?.serviceCoverage.addressCoor,
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
                                                {!!userInput.serviceCoverage?.addressCoor ? (
                                                    <Circle
                                                        center={userInput.serviceCoverage.addressCoor}
                                                        radius={
                                                            parseFloat(userInput.serviceCoverage.coverageDistance) *
                                                                1000 || 5000
                                                        }
                                                        fillColor={'rgba(255, 80, 80,0.2)'}
                                                        strokeWidth={0}
                                                    />
                                                ) : null}
                                                {/* {!!userInput.serviceCoverage?.addressCoor ? (
                                                <Marker coordinate={userInput.serviceCoverage.addressCoor} />
                                            ) : null} */}
                                            </MapView>

                                            {!!userInput.serviceCoverage?.addressCoor ? (
                                                <View
                                                    style={{
                                                        left: '50%',
                                                        marginLeft: -24,
                                                        marginTop: -34,
                                                        position: 'absolute',
                                                        top: '50%',
                                                    }}>
                                                    <MaterialIcon name="location-on" size={48} color={'red'} />
                                                </View>
                                            ) : null}

                                            <TouchableRipple
                                                style={{
                                                    position: 'absolute',
                                                    right: 16,
                                                    bottom: 16,
                                                    borderRadius: 24,
                                                }}
                                                borderless
                                                rippleColor="rgba(0, 0, 0, .32)"
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

                                                            Geolocation.getCurrentPosition(
                                                                position => {
                                                                    setUserInput({
                                                                        ...userInput,
                                                                        serviceCoverage: {
                                                                            ...userInput.serviceCoverage,
                                                                            addressCoor: {
                                                                                latitude: position.coords.latitude,
                                                                                longitude: position.coords.longitude,
                                                                            },
                                                                        },
                                                                    });
                                                                    const radiusBoundaries = getBoundsOfDistance(
                                                                        {
                                                                            latitude: position.coords.latitude,
                                                                            longitude: position.coords.longitude,
                                                                        },
                                                                        userInput.serviceCoverage.coverageDistance *
                                                                            1000,
                                                                    );
                                                                    mapViewRef.current.fitToCoordinates(
                                                                        radiusBoundaries,
                                                                        {
                                                                            edgePadding: {
                                                                                top: 20,
                                                                                right: 20,
                                                                                bottom: 20,
                                                                                left: 20,
                                                                            },
                                                                        },
                                                                    );
                                                                },
                                                                error => {
                                                                    Alert.alert(
                                                                        `Unstable Location Service`,
                                                                        'Unable to Locate your location at the moment. Please try again later.',
                                                                    );
                                                                    console.log(error);
                                                                },
                                                                {
                                                                    timeout: 15000,
                                                                    maximumAge: 10000,
                                                                    distanceFilter: 0,
                                                                    forceRequestLocation: true,
                                                                    forceLocationManager: true,
                                                                    showLocationDialog: true,
                                                                },
                                                            );
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
                                                    <MaterialIcon
                                                        name="my-location"
                                                        size={20}
                                                        color={CustomColors.GRAY_DARK}
                                                    />
                                                </View>
                                            </TouchableRipple>
                                            {userInput.serviceCoverage?.addressCoor ? (
                                                <TouchableRipple
                                                    style={{
                                                        position: 'absolute',
                                                        left: 16,
                                                        bottom: 16,
                                                        borderRadius: 4,
                                                    }}
                                                    borderless
                                                    rippleColor="rgba(0, 0, 0, .32)"
                                                    onPress={() => {
                                                        const radiusBoundaries = getBoundsOfDistance(
                                                            {
                                                                latitude:
                                                                    userInput.serviceCoverage.addressCoor.latitude,
                                                                longitude:
                                                                    userInput.serviceCoverage.addressCoor.longitude,
                                                            },
                                                            userInput.serviceCoverage.coverageDistance * 1000,
                                                        );
                                                        mapViewRef.current.fitToCoordinates(radiusBoundaries, {
                                                            edgePadding: {
                                                                top: 20,
                                                                right: 20,
                                                                bottom: 20,
                                                                left: 20,
                                                            },
                                                        });
                                                    }}>
                                                    <View
                                                        style={{
                                                            borderRadius: 4,
                                                            paddingVertical: 4,
                                                            paddingHorizontal: 16,
                                                            opacity: 0.8,
                                                            alignItems: 'center',
                                                            backgroundColor: 'white',
                                                        }}>
                                                        <Text
                                                            style={{
                                                                fontSize: CustomTypography.FONT_SIZE_14,
                                                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                            }}>
                                                            Fit View
                                                        </Text>
                                                    </View>
                                                </TouchableRipple>
                                            ) : null}
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
                                                    } else {
                                                        handleSubmit();
                                                    }
                                                }}>
                                                Edit business profile
                                            </Button>
                                        </View>
                                    </>
                                );
                            }}
                        </Formik>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <LoadingModal
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}
                animationOutTiming={150}
                isVisible={loadingModal.isVisible}
                modalTitle={loadingModal.modalTitle}
                statusBarTranslucent={true}
                useNativeDriver={true}></LoadingModal>
        </View>
    );
};

export default BusinessProfileEditPage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
        padding: 16,
    },
    backIcon: {
        marginLeft: -8,
    },
    inputPrompt: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingVertical: 2,
        marginTop: 8,
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
    businessProfileSetupContainer: {
        width: '100%',
        flex: 1,
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
