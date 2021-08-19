import React from 'react';
import {StyleSheet, Text, View, Platform, TouchableOpacity} from 'react-native';

import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {CustomColors, CustomTypography} from '@styles';
import LoadingCharacter from '@atoms/LoadingCharacter';

const LoadingModal = ({isVisible = false, modalTitle = '', animationIn = 'bounceIn', ...inputProps}) => {
    const deviceHeight =
        Platform.OS === 'ios'
            ? Dimensions.get('window').height
            : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT');

    return (
        <Modal
            style={styles.modalContainer}
            isVisible={isVisible}
            deviceHeight={deviceHeight}
            statusBarTranslucent={true}
            animationIn="bounceIn"
            onRequestClose={() => {
                
            }}
            {...inputProps}>
            <View style={styles.modalContent}>
                <View style={styles.iconContainer}>
                    <View style={{width: 64, height: 64, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 64, height: 64}}>
                            <LottieView
                                source={require('@assets/animations/loadingSpinner.json')}
                                autoPlay
                                loop={true}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.modalTitleContainer}>
                    <LoadingCharacter
                        text={modalTitle}
                        textColor={CustomColors.GRAY_DARK}
                        fontSize={CustomTypography.FONT_SIZE_12}
                        fontFamily={CustomTypography.FONT_FAMILY_REGULAR}
                        animationDelayAfterEachLoop={1000}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default LoadingModal;

const styles = StyleSheet.create({
    modalContainer: {},
    modalContent: {
        minHeight: 200,
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 12,
        paddingVertical: 24,
        borderRadius: 12,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    modalTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_24,
        color: CustomColors.GRAY_DARK,
        textAlign: 'center',
    },
    modalTitleContainer: {
        width: 200,
        alignSelf: 'center',
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
