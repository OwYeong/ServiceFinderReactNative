import React from 'react';
import {StyleSheet, Text, View, Platform, TouchableOpacity} from 'react-native';

import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {CustomColors, CustomTypography} from '@styles';

const CustomModal = ({
    isVisible = false,
    modalType = '',
    modalTitle = '',
    modalDesc = '',
    animationIn = 'bounceIn',
    buttonOnPressCallback,
    ...inputProps
}) => {
    const deviceHeight =
        Platform.OS === 'ios'
            ? Dimensions.get('window').height
            : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT');

    const getModalAnimatedIcon = () => {
        switch (modalType) {
            case 'success':
                return (
                    <View style={{width: 100, height: 100}}>
                        <LottieView
                            source={require('@assets/animations/successAnim.json')}
                            autoPlay
                            loop={false}
                            duration={1500}
                        />
                    </View>
                );
                break;
            case 'error':
                return (
                    <View style={{width: 128, height: 128}}>
                        <LottieView
                            source={require('@assets/animations/errorAnim.json')}
                            autoPlay
                            loop={false}
                            duration={1500}
                        />
                    </View>
                );
                break;
            default:
                return (
                    <View style={{width: 128, height: 128}}>
                        <LottieView
                            source={require('@assets/animations/errorAnim.json')}
                            autoPlay
                            loop={false}
                            duration={1500}
                        />
                    </View>
                );
                break;
        }
    };
    return (
        <Modal
            style={styles.modalContainer}
            isVisible={isVisible}
            deviceHeight={deviceHeight}
            statusBarTranslucent={true}
            animationIn="bounceIn"
            {...inputProps}>
            <View style={styles.modalContent}>
                <View style={styles.iconContainer}>
                    <View style={{width: 128, height: 128, justifyContent: 'center', alignItems: 'center'}}>
                        {getModalAnimatedIcon()}
                    </View>
                </View>
                <Text style={styles.modalTitle}>{modalTitle}</Text>
                <Text style={styles.modalDesc}>{modalDesc}</Text>
                <TouchableOpacity onPress={buttonOnPressCallback}>
                    <View style={styles.modalCloseBtn}>
                        <Text style={styles.modalCloseText}>Close</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default CustomModal;

const styles = StyleSheet.create({
    modalContainer: {},
    modalContent: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 24,
    },
    modalTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_24,
        color: CustomColors.GRAY_DARK,
        textAlign: 'center',
    },
    modalDesc: {
        marginTop: 8,
        paddingHorizontal:24,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.GRAY_DARK,
        textAlign: 'justify',
    },
    modalCloseBtn: {
        margin: 8,
        marginTop: 16,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalCloseText: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.PRIMARY_BLUE_SATURATED,
    },
});
