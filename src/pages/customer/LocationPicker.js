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
    Alert,
} from 'react-native';
import {Button, IconButton, TouchableRipple} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {showMessage} from 'react-native-flash-message';
import BottomSheet from 'react-native-bottomsheet-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import MapService from '@services/MapService';
import _, {debounce} from 'lodash';
import {getBoundsOfDistance, isPointInPolygon} from 'geolib';
import GeoLocationUtils from '@utils/GeoLocationUtils';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from 'react-native-geolocation-service';
import {useSelector} from 'react-redux';

const LocationPicker = () => {
    const navigation = useNavigation();
    const userInfo = useSelector(state => state.loginState.userInfo);

    const [addressInput, setAddressInput] = useState({
        addressCoor: userInfo?.serviceAddress?.addressCoor || null,
        addressFullName: userInfo?.serviceAddress?.addressFullName || '',
    });
    const [addressQuery, setAddressQuery] = useState(userInfo?.serviceAddress?.addressFullName || '');
    const [addressQueryResult, setAddressQueryResult] = useState([]);
    const [showClearIcon, setShowClearIcon] = useState(addressQuery.length > 0);

    const mapViewRef = useRef();

    const searchAddress = async query => {
        try {
            const res = await MapService.searchAddress(query);
            console.log(res);
            const queryResult = res.results.map(result => {
                return {
                    addressCoor: {
                        lat: result.position.lat,
                        lon: result.position.lon,
                    },
                    addressFullName: result.address.freeformAddress,
                    id: result.id,
                };
            });

            setAddressQueryResult(queryResult);
        } catch (err) {
            console.log('search address error');
            console.log(err);
        }
    };

    const searchAddressCallback = useCallback(debounce(searchAddress, 1000), []);

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
                                    fontSize: CustomTypography.FONT_SIZE_14,
                                }}>
                                {_.truncate(addressInput.addressFullName, {length: 40}) || 'Select Your Location'}
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
                                setShowClearIcon(text.length > 0);
                                setAddressQuery(text);

                                if (!!text) {
                                    searchAddressCallback(addressQuery);
                                }
                            }}
                            value={addressQuery}
                            placeholder="Enter your address"
                        />
                        {showClearIcon ? (
                            <IconButton
                                icon="cancel"
                                size={18}
                                color={CustomColors.GRAY}
                                onPress={() => {
                                    setAddressQuery('');
                                    setAddressQueryResult([]);
                                    setShowClearIcon(false);
                                }}
                            />
                        ) : (
                            <View style={{width: 18, height: 18}}></View>
                        )}
                    </View>
                    <View
                        style={{
                            width: '100%',
                            height: 8,
                            backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                        }}></View>
                    <View style={{width: '100%', flex: 1}}>
                        {addressQueryResult.length > 0 ? (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 1000,
                                    backgroundColor: 'white',
                                }}>
                                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                                    <View style={{width: '100%', flex: 1}}>
                                        {addressQueryResult.map(addr => (
                                            <TouchableRipple
                                                key={addr.id}
                                                rippleColor="rgba(0, 0, 0, .32)"
                                                onPress={() => {
                                                    setAddressInput({
                                                        ...addressInput,
                                                        addressCoor: {
                                                            latitude: addr.addressCoor.lat,
                                                            longitude: addr.addressCoor.lon,
                                                        },
                                                        addressFullName: addr.addressFullName,
                                                    });
                                                    setAddressQuery(addr.addressFullName);
                                                    setAddressQueryResult([]);

                                                    const radiusBoundaries = getBoundsOfDistance(
                                                        {
                                                            latitude: addr.addressCoor.lat,
                                                            longitude: addr.addressCoor.lon,
                                                        },
                                                        300,
                                                    );
                                                    mapViewRef.current.fitToCoordinates(radiusBoundaries, {
                                                        edgePadding: {
                                                            top: 20,
                                                            right: 20,
                                                            bottom: 20,
                                                            left: 20,
                                                        },
                                                    });
                                                }}>
                                                <View
                                                    style={{
                                                        width: '100%',
                                                        padding: 16,
                                                        paddingVertical: 16,
                                                        backgroundColor: 'transparent',
                                                    }}>
                                                    <Text style={styles.addressSearchResult}>
                                                        {addr.addressFullName}
                                                    </Text>
                                                </View>
                                            </TouchableRipple>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        ) : null}

                        <TouchableRipple
                            onPress={() => {
                                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                                    interval: 10000,
                                    fastInterval: 5000,
                                })
                                    .then(data => {
                                        // The user has accepted to enable the location services
                                        // data can be :
                                        //  - "already-enabled" if the location services has been already enabled
                                        //  - "enabled" if user has clicked on OK button in the popup
                                        if (!GeoLocationUtils.hasLocationPermission()) {
                                            return;
                                        }

                                        Geolocation.getCurrentPosition(
                                            position => {
                                                setAddressInput({
                                                    ...addressInput,
                                                    addressCoor: {
                                                        latitude: position.coords.latitude,
                                                        longitude: position.coords.longitude,
                                                    },
                                                });

                                                const radiusBoundaries = getBoundsOfDistance(
                                                    {
                                                        latitude: position.coords.latitude,
                                                        longitude: position.coords.longitude,
                                                    },
                                                    300,
                                                );
                                                mapViewRef.current.fitToCoordinates(radiusBoundaries, {
                                                    edgePadding: {
                                                        top: 20,
                                                        right: 20,
                                                        bottom: 20,
                                                        left: 20,
                                                    },
                                                });
                                            },
                                            error => {
                                                Alert.alert(
                                                    `Unstable Location Service`,
                                                    'Unable to Locate your location at the moment. Please try again later.',
                                                );
                                                console.log(error);
                                            },
                                            {
                                                timeout: 15000,
                                                maximumAge: 10000,
                                                distanceFilter: 0,
                                                forceRequestLocation: true,
                                                forceLocationManager: true,
                                                showLocationDialog: true,
                                            },
                                        );
                                    })
                                    .catch(err => {
                                        // The user has not accepted to enable the location services or something went wrong during the process
                                        // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
                                        // codes :
                                        //  - ERR00 : The user has clicked on Cancel button in the popup
                                        //  - ERR01 : If the Settings change are unavailable
                                        //  - ERR02 : If the popup has failed to open
                                        //  - ERR03 : Internal error
                                    });
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: 20,
                                    paddingVertical: 16,
                                }}>
                                <MaterialIcons name="my-location" size={24} color={CustomColors.GRAY_DARK} />
                                <Text
                                    style={{
                                        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
                                        fontSize: CustomTypography.FONT_SIZE_16,
                                        color: CustomColors.GRAY_DARK,
                                        marginLeft: 22,
                                    }}>
                                    Use my current location
                                </Text>
                            </View>
                        </TouchableRipple>
                        <View
                            style={{
                                width: '100%',
                                height: 8,
                                backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
                            }}></View>
                        <View style={styles.mapContainer}>
                            <MapView
                                ref={mapViewRef}
                                showsUserLocation={false}
                                rotateEnabled={false}
                                showsMyLocationButton={false}
                                onRegionChangeComplete={(region, {isGesture}) => {
                                    console.log(region);
                                    // setUserInput({
                                    //     ...userInput,
                                    //     serviceCoverage: {
                                    //         addressCoor: {
                                    //             latitude: region.latitude,
                                    //             longitude: region.longitude,
                                    //         },
                                    //     },
                                    // });
                                    if (!addressInput?.addressCoor) {
                                        return;
                                    }
                                    console.log('searching');
                                    console.log(!!addressInput.addressCoor);

                                    MapService.findAddressByGeoCode(`${region.latitude},${region.longitude}`)
                                        .then(response => {
                                            setAddressInput({
                                                ...addressInput,
                                                addressCoor: {
                                                    latitude: region.latitude,
                                                    longitude: region.longitude,
                                                },
                                                addressFullName: response.addresses[0].address.freeformAddress,
                                            });
                                            setAddressQuery(response.addresses[0].address.freeformAddress);

                                            // addressSearchBarRef.current.setNativeProps({ selection:{ start:0 } })
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                }}
                                initialCamera={{
                                    altitude: 15000,
                                    center: {
                                        latitude: userInfo?.serviceAddress?.addressCoor?.latitude || 3.0671123333851362,
                                        longitude:
                                            userInfo?.serviceAddress?.addressCoor?.longitude || 101.60356068473712,
                                    },
                                    heading: 0,
                                    pitch: 0,
                                    zoom: 17,
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 20,
                                    overflow: 'hidden',
                                }}></MapView>

                            {!!addressInput.addressCoor ? (
                                <View
                                    style={{
                                        left: '50%',
                                        marginLeft: -24,
                                        marginTop: -34,
                                        position: 'absolute',
                                        top: '50%',
                                    }}>
                                    <MaterialIcons name="location-on" size={48} color={'red'} />
                                </View>
                            ) : null}
                            <View style={styles.actionBtnContainer}>
                                <Button
                                    style={styles.actionBtn}
                                    mode="contained"
                                    contentStyle={{height: 50}}
                                    color={CustomColors.PRIMARY_BLUE}
                                    dark
                                    onPress={() => {
                                        if (!!addressInput?.addressCoor && !!addressInput?.addressFullName) {
                                            UserService.updateServiceAddress(addressInput)
                                                .then(data => {
                                                    //success
                                                    navigation.reset({
                                                        index: 0,
                                                        routes: [{name: 'Customer'}],
                                                    });
                                                })
                                                .catch(err => {
                                                    //failed
                                                    console.log(err);
                                                    showMessage({
                                                        message: 'Some error occurs please try again later',
                                                        type: 'info',
                                                        position: 'center',
                                                        titleStyle: {marginTop: 5},
                                                        backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                                        color: 'white', // text color
                                                        hideOnPress: true,
                                                        autoHide: true,
                                                        duration: 1000,
                                                    });
                                                });
                                        } else {
                                            showMessage({
                                                message: 'Please select your address first.',
                                                type: 'info',
                                                position: 'center',
                                                titleStyle: {marginTop: 5},
                                                backgroundColor: 'rgba(0,0,0,0.6)', // background color
                                                color: 'white', // text color
                                                hideOnPress: true,
                                                autoHide: true,
                                                duration: 1000,
                                            });
                                        }
                                    }}>
                                    Confirm Location
                                </Button>
                            </View>
                        </View>
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
    mapContainer: {
        width: '100%',
        flex: 1,
    },
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.WHITE,
    },
    actionBtnContainer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    actionBtn: {
        marginTop: 40,
        width: '100%',
        borderRadius: 8,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_16,
        justifyContent: 'center',
    },
    addressSearchResult: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_14,
        color: CustomColors.GRAY_DARK,
    },
});
