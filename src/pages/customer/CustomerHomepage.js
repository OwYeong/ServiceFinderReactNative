import UserService from '@services/UserService'
import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

const CustomerHomepage = () => {
    
    return (
        <View>
            <Button onPress={()=>{UserService.logOut()}} title='LogOut'></Button>
            <Text>I am the customer Home page</Text>
        </View>
    )
}

export default CustomerHomepage

const styles = StyleSheet.create({})
