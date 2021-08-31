import UserService from '@services/UserService';
import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

const ProviderProfilePage = () => {
    
    return (
        <View>
            <Text>I am the ProviderProfilePage</Text>
            <Button
                onPress={async () => {
                    UserService.logOut();
                }}
                title="LogOut"></Button>
        </View>
    )
}

export default ProviderProfilePage

const styles = StyleSheet.create({})
