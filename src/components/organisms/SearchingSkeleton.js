import {CustomColors, CustomTypography} from '@styles';
import CommonFunction from '@utils/CommonFunction';
import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {Avatar, Surface, Button} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SearchingSkeleton = ({style}) => {
    return (
        <View style={[{width: '100%', flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16}, style]}>
            <View>
                <SkeletonPlaceholder>
                    <View style={{width: 108, height: 108, borderRadius: 8, overflow: 'hidden'}}></View>
                </SkeletonPlaceholder>
            </View>
            <View style={{marginLeft: 8}}>
                <SkeletonPlaceholder>
                    <View style={{width: 200, height: 12, borderRadius: 8, overflow: 'hidden'}}></View>
                    <View style={{width: 180, height: 12, borderRadius: 8, marginTop: 12, overflow: 'hidden'}}></View>
                    <View style={{width: 210, height: 12, borderRadius: 8, marginTop: 12, overflow: 'hidden'}}></View>
                    <View style={{width: 220, height: 12, borderRadius: 8, marginTop: 12, overflow: 'hidden'}}></View>
                    <View style={{width: 180, height: 12, borderRadius: 8, marginTop: 12, overflow: 'hidden'}}></View>
                </SkeletonPlaceholder>
            </View>
        </View>
    );
};

export default SearchingSkeleton;

const styles = StyleSheet.create({});
