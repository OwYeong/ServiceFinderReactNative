import {useFocusEffect, useNavigation} from '@react-navigation/core';
import ProviderService from '@services/ProviderService';
import UserService from '@services/UserService';
import {CustomColors, CustomTypography} from '@styles';
import React, {useState, useRef, useCallback} from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
    TextInput,
} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {showMessage} from 'react-native-flash-message';
import BottomSheet from 'react-native-bottomsheet-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LocationPicker = () => {
    const navigation = useNavigation();
    const [searchbarInput, setSearchbarInput] = useState('');

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <View style={styles.bigContainer}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 16,
                        }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: -16}}>
                            <IconButton
                                icon="arrow-back"
                                color={CustomColors.GRAY_DARK}
                                size={CustomTypography.ICON_SMALL}
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                    fontSize: CustomTypography.FONT_SIZE_16,
                                }}>
                                Select Your Location
                            </Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16}}>
                        <Ionicons
                            name="md-location-sharp"
                            style={{marginBottom: 6}}
                            size={30}
                            color={CustomColors.ALERT}
                        />
                        <TextInput
                            style={styles.searchInput}
                            onChangeText={text => {
                                setSearchbarInput(text);
                            }}
                            value={searchbarInput}
                            placeholder="Enter your address"
                        />
                        <IconButton icon="cancel" size={18} color={CustomColors.GRAY} onPress={() => {}} />
                    </View>
                    <View
                        style={{
                            width: '100%',
                            height: 12,
                            backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                            marginBottom: 24,
                        }}></View>
                    <View>
                        
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default LocationPicker;

const styles = StyleSheet.create({
    searchInput: {
        flex: 1,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        color: CustomColors.GRAY_DARK,
        paddingHorizontal: 16,
    },
});
