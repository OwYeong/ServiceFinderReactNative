import {CustomColors, CustomTypography} from '@styles';
import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgCss, SvgXml} from 'react-native-svg';
import LogoSvg from '@assets/images/logo.svg';
import LoadingCharacter from '@components/atoms/LoadingCharacter';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@slices/appSlice';

const SplashPage = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch()

    useEffect(()=>{
        setTimeout(()=>{
            dispatch(setIsLoading(false))
        },5000)
    },[])


    return (
        <LinearGradient
            colors={[CustomColors.PRIMARY_BLUE, CustomColors.SECONDARY_BLUE_PURPLE]}
            style={styles.linearGradient}>
            <StatusBar backgroundColor={'transparent'} translucent />
            <SafeAreaView>
                <View style={styles.splashContainer}>
                    <View style={styles.logo}>
                        <LogoSvg fill={CustomColors.WHITE} />
                    </View>
                    <LoadingCharacter
                        text="ServiceFinder"
                        fontSize={CustomTypography.FONT_SIZE_30}
                        fontFamily={CustomTypography.FONT_FAMILY_MEDIUM}
                        animationDelayAfterEachLoop={1000}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default SplashPage;

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    splashContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
    },
    logo: {
        width: 80,
        height: 64,
        marginBottom: 10,
    },
});
