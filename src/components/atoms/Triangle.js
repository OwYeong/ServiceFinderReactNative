import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Triangle = ({style}) => {
    return <View style={[styles.triangle, style]} />;
};

export default Triangle;

const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 50,
        borderRightWidth: 50,
        borderBottomWidth: 100,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'red',
    },
});
