import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import UserService from '@services/UserService';

const CustomerProfilePage = () => {
    return (
        <View>
            <Text>I am the CustomerProfilePage</Text>

            <Button
                onPress={async () => {
                    UserService.logOut();
                }}
                title="LogOut"></Button>
            <Text>I am the customer Home page</Text>
        </View>
    );
};

export default CustomerProfilePage;

const styles = StyleSheet.create({});
