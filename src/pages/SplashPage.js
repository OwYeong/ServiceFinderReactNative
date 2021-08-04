import {CustomColors, CustomTypography} from '@styles';
import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import { SvgCss, SvgXml } from 'react-native-svg';
import LogoSvg from '@assets/images/logo.svg';
import LoadingCharacter from '@components/atoms/LoadingCharacter';

const SplashPage = () => {
    console.log(LogoSvg)
    console.log(LogoSvg)
    return (
        <LinearGradient
            colors={[
                CustomColors.PRIMARY_BLUE,
                CustomColors.SECONDARY_BLUE_PURPLE,
            ]}
            style={styles.linearGradient}>
            <StatusBar backgroundColor={'transparent'} translucent/>
            <SafeAreaView>
                <View style={styles.splashContainer}>
                    {/* <SvgCss width="200" height="200" xml={LogoSvg} />   */}
                    <View style={styles.logo}> 
                        <LogoSvg />
                    </View>
                    <LoadingCharacter text="ServiceFinder" fontSize={30} fontFamily={CustomTypography.FONT_FAMILY_MEDIUM}/>
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
    splashContainer:{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40
    },
    logo: {
        width: 80, 
        height: 64,
        marginBottom: 10
    },
});
