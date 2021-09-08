import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CompleteYourProfileIllustration from '@assets/images/vendor-complete-profile-illustration';
import {CustomColors, CustomTypography} from '@styles';
import {Button} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const SetupBusinessProfileWalkthrough = () => {
    const promptForBusinessProfileSetupComponent = () => (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <View
                            style={{
                                height: 300,
                                justifyContent: 'center',
                                marginTop: 100,
                                paddingHorizontal: 24,
                            }}>
                            <CompleteYourProfileIllustration width="100%" height="100%" fill="#ffffff" />
                        </View>
                        <Text style={styles.title}>Setup Your Business Profile</Text>
                        <Text style={styles.desc}>
                            Welcome to ServiceFinder's Vendor Portal, as this is your first-login, please complete your
                            business profile. You may start selling service after completing the business profile.
                        </Text>
                        <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', padding: 24}}>
                            <Button
                                style={styles.button}
                                mode="contained"
                                contentStyle={{height: 50}}
                                dark
                                color={CustomColors.PRIMARY_BLUE}
                                onPress={() => {}}>
                                Setup Business Profile
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
    return (
        <Stack.Navigator>
            <Stack.Screen name="PromptForBusinessProfileSetup" component={promptForBusinessProfileSetupComponent} options={{headerShown: false}} />
        </Stack.Navigator>
    );
};

export default SetupBusinessProfileWalkthrough;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
        fontSize: 26,
        color: CustomColors.GRAY_DARK,
        textAlign: 'center',
        marginTop: 16,
        paddingHorizontal: 16,
    },
    desc: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_DARK,
        textAlign: 'justify',
        paddingHorizontal: 24,
        marginTop: 12,
        lineHeight: 30,
    },
    button: {
        marginTop: 24,
        width: '100%',
        borderRadius: 8,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        justifyContent: 'center',
    },
});
