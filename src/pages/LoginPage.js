import React, {Fragment} from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const LoginPage = () => {
    console.log('im called');
    return (
        <Fragment>
        
            <SafeAreaView style={{flex: 1, backgroundColor: 'gray'}}>
                <StatusBar  backgroundColor={'transparent'} translucent/>
                <View>
                    <Text>
                        Welcome to servicefinder asjdfsadjkf hahaha
                        asgsdgsjkdhgjksdhgjksdhgsjdkgskdghjkaksjdkas
                    </Text>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default LoginPage;

const styles = StyleSheet.create({
    text: {
        color: 'blue',
    },
});
