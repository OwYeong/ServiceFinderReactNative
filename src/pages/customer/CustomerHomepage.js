import UserService from '@services/UserService';
import React from 'react';
import {Button, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import LinearGradient from 'react-native-linear-gradient';
import {CustomColors, CustomMixins, CustomTypography} from '@styles';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Searchbar} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

import CharacterSvg from '@assets/images/character.svg';
import Cloud1Svg from '@assets/images/cloud-1.svg';
import Cloud2Svg from '@assets/images/cloud-2.svg';

const moveCloud = {
    0: {
        translateX: 0,
    },
    0.5: {
        translateX: -20,
    },
    1: {
        translateX: 0,
    },
};

const moveCloudReverse = {
    0: {
        translateX: 0,
    },
    0.5: {
        translateX: 20,
    },
    1: {
        translateX: 0,
    },
};

const CustomerHomepage = () => {
    return (
        <LinearGradient
            colors={[CustomColors.PRIMARY_BLUE, CustomColors.SECONDARY_BLUE_PURPLE]}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 1}}
            style={styles.bigContainer}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.headerContainerGradient}>
                        <LinearGradient
                            colors={[CustomColors.PRIMARY_BLUE, CustomColors.SECONDARY_BLUE_PURPLE]}
                            start={{x: 0, y: 1}}
                            end={{x: 1, y: 1}}
                            style={styles.headerGradient}>
                            <View style={styles.locationWrapper}>
                                <Text style={styles.serviceAt}>
                                    SERVICE AT{'\n'}
                                    <Text style={styles.serviceLocation}>
                                        Home asdas <Icon name="caret-down" width={36} height={36} />
                                    </Text>
                                </Text>
                            </View>
                            <Text style={styles.slogan}>Book Service{'\n'}to your doorstep</Text>
                            <Searchbar
                                style={styles.searchBar}
                                icon={() => <FeatherIcon name="search" size={20} />}
                                clearIcon={() => <MaterialIcon name="cancel" size={20} />}
                                placeholder="Find your service"
                            />
                            <View style={styles.character}>
                                <CharacterSvg fill="#000000" />
                            </View>
                            <Animatable.View
                                style={styles.cloud1}
                                animation={moveCloudReverse}
                                duration={8000}
                                easing="ease-in-out"
                                iterationCount="infinite"
                                useNativeDriver={true}
                                direction="reverse">
                                <Cloud1Svg fill={CustomColors.WHITE} />
                            </Animatable.View>
                            <Animatable.View
                                style={styles.cloud2}
                                animation={moveCloud}
                                duration={6000}
                                iterationDelay={500}
                                useNativeDriver={true}
                                easing="ease-in-out"
                                iterationCount="infinite"
                                direction="reverse">
                                <Cloud2Svg fill={CustomColors.WHITE} />
                            </Animatable.View>
                        </LinearGradient>
                    </View>
                    <View style={styles.popularContainer}>
                        <View style={styles.headerContainerGradient}>
                            <LinearGradient
                                colors={[CustomColors.PRIMARY_BLUE, CustomColors.SECONDARY_BLUE_PURPLE]}
                                start={{x: 0, y: 1}}
                                end={{x: 1, y: 1}}
                                style={styles.headerGradientBottomPortion}>
                                <View style={styles.popularSectionHeader}>
                                    <Text style={styles.sectionTitle}>Popular This month</Text>
                                    <Text style={styles.viewAll}>View All</Text>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                    <View style={styles.bigContainer}>
                        <Button
                            onPress={() => {
                                UserService.logOut();
                            }}
                            title="LogOut"></Button>
                        <Text>I am the customer Home page</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default CustomerHomepage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainerGradient: {
        width: '100%',
        height: 330,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    headerGradient: {
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: 50,
        overflow: 'hidden',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    headerGradientBottomPortion: {
        width: '100%',
        height: 40,
    },
    popularSectionHeader: {
        width: '100%',
        height: 40,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopRightRadius: 50,
    },
    popularContainer: {
        width: '100%',
        height: 200,
    },
    sectionTitle: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_DARK,
    },
    viewAll: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.GRAY_DARK,
    },
    locationWrapper: {
        width: '100%',
    },
    serviceAt: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_12,
        color: CustomColors.WHITE,
    },
    serviceLocation: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.WHITE,
    },
    slogan: {
        fontFamily: CustomTypography.FONT_FAMILY_BOLD,
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.WHITE,
        marginTop: 16,
    },
    searchBar: {
        borderRadius: 8,
        marginTop: 16,
    },
    character: {
        width: 200,
        height: 200,
        position: 'absolute',
        bottom: -80,
        right: 10,
        zIndex: 20,
    },
    cloud1: {
        width: 120,
        height: 50,
        position: 'absolute',
        bottom: 10,
        right: 10,
    },

    cloud2: {
        width: 100,
        height: 60,
        position: 'absolute',
        bottom: 30,
        right: 100,
    },
});
