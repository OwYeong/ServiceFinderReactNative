import {CustomColors, CustomTypography} from '@styles';
import CommonFunction from '@utils/CommonFunction';
import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {Avatar, Surface, Button} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const PopularServiceDisplaySkeleton = ({style}) => {
    return (
        <SkeletonPlaceholder>
            <View style={[styles.container, style]}>
            </View>
        </SkeletonPlaceholder>
    );
};

export default PopularServiceDisplaySkeleton;

const styles = StyleSheet.create({
    container: {
        width: 300,
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
    },
    
});
