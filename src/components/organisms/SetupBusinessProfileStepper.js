import CustomFormikTextInput from '@molecules/CustomFormikTextInput';
import {CustomColors, CustomTypography} from '@styles';
import {FastField, Field, Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {LayoutAnimation, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button, HelperText, Surface, TextInput, TouchableRipple} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import StepIndicator from 'react-native-step-indicator';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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

const validationSchema = yup.object().shape({
    businessName: yup.string().max(40).required('Business name is required.'),
    businessDesc: yup.string().max(1000).required('Business name is required.'),
    serviceType: yup.string().required('Service type is mandatory'),
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
            label: 'Service\nLocation',
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

    const [initialFormValue, setInitialFormValue] = useState({
        businessCategory: 'car',
        serviceType: '',
        businessName: '',
    });

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
                        <ScrollView contentContainerStyle={{flexGrow: 1}} >
                            <View style={{flex: 1, padding: 20}}>
                                <Text style={styles.sectionTitle}>Business Profile</Text>
                                <Text style={styles.sectionDesc}>Complete the details about your business.</Text>
                                <Text style={styles.subSectionTitle}>Business Type</Text>
                                <Formik
                                    initialValues={initialFormValue}
                                    validationSchema={validationSchema}
                                    onSubmit={(values, settings) => {}}>
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
                                                                                <View style={{width: 36, height: 36}}>
                                                                                    {businessCategory[key].icon(
                                                                                        values,
                                                                                        key,
                                                                                    )}
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
                                                        placeholder={{label: 'Select your service type', value: null}}
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
                                                    placeholder="Your last name"
                                                    numberOfLines={5}
                                                    multiline></Field>
                                                <Field
                                                    component={CustomFormikTextInput}
                                                    style={styles.inputPrompt}
                                                    label="Email"
                                                    name="email"
                                                    placeholder="Your email address"
                                                    keyboardType="email-address"></Field>
                                                <Field
                                                    component={CustomFormikTextInput}
                                                    style={styles.inputPrompt}
                                                    label="Password"
                                                    name="password"
                                                    placeholder="Your password"></Field>
                                                <Field
                                                    component={CustomFormikTextInput}
                                                    style={styles.inputPrompt}
                                                    label="Password"
                                                    name="password"
                                                    placeholder="Your password"></Field>
                                                <Field
                                                    component={CustomFormikTextInput}
                                                    style={styles.inputPrompt}
                                                    label="Password"
                                                    name="password"
                                                    placeholder="Your password"></Field>
                                                <Field
                                                    component={CustomFormikTextInput}
                                                    style={styles.inputPrompt}
                                                    label="Password"
                                                    name="password"
                                                    placeholder="Your password"></Field>
                                                <Field
                                                    component={CustomFormikTextInput}
                                                    style={styles.inputPrompt}
                                                    label="Password"
                                                    name="password"
                                                    placeholder="Your password"></Field>
                                                <View style={styles.registerBtnContainer}>
                                                    <Button
                                                        style={styles.registerBtn}
                                                        mode="contained"
                                                        disabled={isSubmitting}
                                                        contentStyle={{height: 50}}
                                                        color={CustomColors.PRIMARY_BLUE}
                                                        dark
                                                        onPress={() => {
                                                            Object.keys(errors).length > 0
                                                                ? setModal({
                                                                      isVisible: true,
                                                                      modalType: 'error',
                                                                      modalTitle: 'Error !',
                                                                      modalDesc: 'Please ensure all input are correct.',
                                                                      onDismiss: () => {
                                                                          setModal({...modal, isVisible: false});
                                                                      },
                                                                  })
                                                                : handleSubmit();
                                                        }}>
                                                        SIGN UP
                                                    </Button>
                                                </View>
                                            </>
                                        );
                                    }}
                                </Formik>
                            </View>
                        </ScrollView>
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
    registerBtnContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    registerBtn: {
        marginTop: 12,
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
