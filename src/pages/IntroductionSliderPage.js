import React, {useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppIntroSlider from 'react-native-app-intro-slider';
import {CustomColors, CustomTypography} from '@styles';
import {SvgCss, SvgCssUri} from 'react-native-svg';
import CustomerIntroIllustration1 from '@assets/images/intro-customer-illustration-1';
import CustomerIntroIllustration2 from '@assets/images/intro-customer-illustration-2';
import VendorIntroIllustration1 from '@assets/images/intro-vendor-illustration-1';
import VendorIntroIllustration2 from '@assets/images/intro-vendor-illustration-2';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import {Surface} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import PhoneVerification from '@organisms/PhoneVerification';
const movingLeft = {
    0: {
        translateX: 0,
        scale: 1,
    },
    0.25: {
        translateX: -5,
    },
    0.75: {
        translateX: 5,
        scale: 1,
    },
    1: {
        translateX: 0,
        scale: 1,
    },
};

const IntroductionSliderPage = ({accType}) => {
    const customerSlides = [
        <View style={styles.slide}>
            <View
                style={{
                    width: 300,
                    height: 300,
                    borderRadius: 350 / 2,
                    backgroundColor: '#d0f4fc',
                    overflow: 'hidden',
                    marginTop: 50,
                }}>
                <Animatable.View
                    animation={movingLeft}
                    iterationCount={'infinite'}
                    easing={'linear'}
                    duration={5000}
                    useNativeDriver={true}>
                    <CustomerIntroIllustration1 style={{transform: [{scale: 1.1}]}} width="100%" height="100%" fill="#ffffff" />
                </Animatable.View>
            </View>
            <Text style={styles.title}>Book Service Online {'\n'}Anywhere, Anytime</Text>
            <Text style={styles.desc}>
                With ServiceFinder, you could book service at anywhere, anytime online and enjoys the service from the
                comfort of your doorstep.
            </Text> 
        </View>,
        <View style={styles.slide}>
            <View
                style={{
                    width: 300,
                    height: 300,
                    borderRadius: 350 / 2,
                    backgroundColor: '#d0f4fc',
                    overflow: 'hidden',
                    marginTop: 50,
                    justifyContent: 'center',
                }}>
                <Animatable.View
                    animation={movingLeft}
                    iterationCount={'infinite'}
                    easing={'linear'}
                    duration={5000}
                    useNativeDriver={true}>
                    <CustomerIntroIllustration2
                        style={{transform: [{scale: 1.05}]}}
                        width="100%"
                        height="100%"
                        fill="#ffffff"
                    />
                </Animatable.View>
            </View>
            <Text style={styles.title}>Offers wide variety of{'\n'}services for selection</Text>
            <Text style={styles.desc}>
                With ServiceFinder, you could always find your desired services. ServiceFinder is an platform that
                offers all kind of services.
            </Text>
        </View>,
        <PhoneVerification></PhoneVerification>,
    ];

    const vendorSlides = [
        <View style={styles.slide}>
            <View
                style={{
                    width: 300,
                    height: 300,
                    borderRadius: 350 / 2,
                    backgroundColor: '#d0f4fc',
                    overflow: 'hidden',
                    marginTop: 50,
                }}>
                <Animatable.View
                    animation={movingLeft}
                    iterationCount={'infinite'}
                    easing={'linear'}
                    duration={5000}
                    useNativeDriver={true}>
                    <VendorIntroIllustration1 style={{transform: [{scale: 1.1}]}} width="100%" height="100%" fill="#ffffff" />
                </Animatable.View>
            </View>
            <Text style={styles.title}>Connect Your Business {'\n'}To Online Consumer</Text>
            <Text style={styles.desc}>
                Sell your service on ServiceFinder platform hassle-free and expand your business to online consumer market at minimal cost.
            </Text>
        </View>,
        <View style={styles.slide}>
            <View
                style={{
                    width: 300,
                    height: 300,
                    borderRadius: 350 / 2,
                    backgroundColor: '#d0f4fc',
                    overflow: 'hidden',
                    marginTop: 50,
                    justifyContent: 'center',
                }}>
                <Animatable.View
                    animation={movingLeft}
                    iterationCount={'infinite'}
                    easing={'linear'}
                    duration={5000}
                    useNativeDriver={true}>
                    <VendorIntroIllustration2
                        style={{transform: [{scale: 1.05}]}}
                        width="100%"
                        height="100%"
                        fill="#ffffff"
                    />
                </Animatable.View>
            </View>
            <Text style={styles.title}>Free Sales Analysis {'\n'} On Your Business</Text>
            <Text style={styles.desc}>
                We provide free analytic service for you to analyse the limitation of your business and boost your sales performance effortlessly.
            </Text>
        </View>,
        <PhoneVerification></PhoneVerification>,
    ];

    const slides = accType == 'consumer' ? customerSlides : vendorSlides;

    const [showPrevButtonInIntroSlide, setShowPrevButtonInIntroSlide] = useState(false);

    return (
        <View style={styles.bigContainer}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                {/* <SvgCss width="100%" height="100%" xml={`require('@assets/images/intro-customer-illustration-1.svg')`} /> */}

                <AppIntroSlider
                    data={slides}
                    renderItem={({item}) => {
                        return item;
                    }}
                    onSlideChange={(index, lastIndex) => {
                        console.log('index and las' + index + ' -- ' + lastIndex);
                        setShowPrevButtonInIntroSlide(index < slides.length - 1);
                    }}
                    keyExtractor={(item, index) => index}
                    activeDotStyle={{backgroundColor: CustomColors.GRAY_DARK}}
                    showPrevButton={showPrevButtonInIntroSlide}
                    showDoneButton={false}
                    renderPrevButton={() => (
                        <View style={styles.buttonCircle}>
                            <IoniIcon name="ios-arrow-back" color="rgba(255, 255, 255, .9)" size={24} />
                        </View>
                    )}
                    renderNextButton={() => (
                        <View style={styles.buttonCircle}>
                            <IoniIcon name="ios-arrow-forward" color="rgba(255, 255, 255, .9)" size={24} />
                        </View>
                    )}></AppIntroSlider>
            </SafeAreaView>
        </View>
    );
};

export default IntroductionSliderPage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'white',
    },
    slide: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        padding: 24,
        paddingBottom: 48,
    },
    title: {
        marginTop: 24,
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: 26,
        color: CustomColors.GRAY_DARK,
        textAlign: 'center',
    },
    desc: {
        marginTop: 12,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_MEDIUM,
        textAlign: 'justify',
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
