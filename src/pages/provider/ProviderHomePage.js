import ProviderService from '@services/ProviderService';
import {CustomColors, CustomTypography} from '@styles';
import React, {useEffect, useState} from 'react';
import {
    Button,
    StyleSheet,
    Text,
    View,
    StatusBar,
    ScrollView,
    Dimensions,
    UIManager,
    LayoutAnimation,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Rect, Text as TextSVG, Svg} from 'react-native-svg';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import {Avatar, Surface, TouchableRipple} from 'react-native-paper';
import EarningIcon from '@assets/images/earning-icon';
import JobIcon from '@assets/images/job-icon';
import moment from 'moment';
import {useNavigation} from '@react-navigation/core';
import Ripple from 'react-native-material-ripple';

const ProviderHomePage = () => {
    let [tooltipPos, setTooltipPos] = useState({x: 0, y: 0, visible: false, value: 0});
    var hideTooltipTimeout = null;
    const navigation = useNavigation();
    const providerInfo = useSelector(state => state.loginState.providerInfo);
    const userInfo = useSelector(state => state.loginState.userInfo);

    const getDefaultNumberOfJobPast6Month = () => {
        var numberOfJobInPastSixMonth = [];
        for (let i = 5; i >= 1; i--) {
            numberOfJobInPastSixMonth.push({
                monthName: moment().subtract(i, 'months').format('MMM YY'),
                numberOfJob: 0,
            });
        }
        numberOfJobInPastSixMonth.push({
            monthName: moment().format('MMM YY'),
            numberOfJob: 0,
        });
        return numberOfJobInPastSixMonth;
    };

    const [numberOfJobPast6Month, setNumberOfJobPast6Month] = useState(getDefaultNumberOfJobPast6Month());

    useEffect(() => {
        ProviderService.fetchProviderDataToRedux();

        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
    }, []);

    useEffect(() => {
        var numberOfJobInPastSixMonth = [];
        for (let i = 5; i >= 1; i--) {
            if (!!providerInfo?.popularity[moment().subtract(i, 'months').format('MMM_YYYY').toUpperCase()]) {
                numberOfJobInPastSixMonth.push({
                    monthName: moment().subtract(i, 'months').format('MMM YY'),
                    numberOfJob:
                        providerInfo.popularity[moment().subtract(i, 'months').format('MMM_YYYY').toUpperCase()],
                });
            } else {
                numberOfJobInPastSixMonth.push({
                    monthName: moment().subtract(i, 'months').format('MMM YY'),
                    numberOfJob: 0,
                });
            }
        }
        numberOfJobInPastSixMonth.push({
            monthName: moment().format('MMM YY'),
            numberOfJob: providerInfo?.popularity[moment().format('MMM_YYYY').toUpperCase()] || 0,
        });

        setNumberOfJobPast6Month(numberOfJobInPastSixMonth);
    }, [providerInfo]);

    return (
        <View style={{backgroundColor: 'white'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeText}>Hi {providerInfo?.businessName || ''},</Text>
                            <TouchableRipple
                                style={{borderRadius: 24, overflow: 'visible'}}
                                borderless
                                rippleColor="rgba(0, 0, 0, .1)"
                                onPress={() => {
                                    navigation.navigate('ProviderProfilePage');
                                }}>
                                <Avatar.Image
                                    style={{elevation: 2}}
                                    size={48}
                                    source={
                                        providerInfo?.businessLogoUrl
                                            ? {
                                                  uri: providerInfo?.businessLogoUrl,
                                              }
                                            : require('@assets/images/default-profileImage.png')
                                    }
                                />
                            </TouchableRipple>
                        </View>
                        <View style={styles.chartContainer}>
                            <Text
                                style={{
                                    fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                    fontSize: CustomTypography.FONT_SIZE_20,
                                    color: CustomColors.GRAY_DARK,
                                }}>
                                Analytic Overview
                            </Text>
                            <Text style={styles.lineGraphHeader}>Number of Jobs</Text>
                            <Text
                                style={{
                                    fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                    fontSize: CustomTypography.FONT_SIZE_20,
                                }}>
                                {providerInfo?.popularity[moment().format('MMM_YYYY').toUpperCase()]}
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                <Ionicons
                                    name={
                                        numberOfJobPast6Month[numberOfJobPast6Month.length - 1].numberOfJob -
                                            numberOfJobPast6Month[numberOfJobPast6Month.length - 2].numberOfJob >=
                                        0
                                            ? 'md-trending-up'
                                            : 'md-trending-down'
                                    }
                                    size={26}
                                    color={
                                        numberOfJobPast6Month[numberOfJobPast6Month.length - 1].numberOfJob -
                                            numberOfJobPast6Month[numberOfJobPast6Month.length - 2].numberOfJob >=
                                        0
                                            ? CustomColors.SUCCESS
                                            : CustomColors.ALERT
                                    }
                                />
                                <Text
                                    style={{
                                        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                        fontSize: CustomTypography.FONT_SIZE_16,
                                        color:
                                            numberOfJobPast6Month[numberOfJobPast6Month.length - 1].numberOfJob -
                                                numberOfJobPast6Month[numberOfJobPast6Month.length - 2].numberOfJob >=
                                            0
                                                ? CustomColors.SUCCESS
                                                : CustomColors.ALERT,
                                    }}>
                                    {' '}
                                    {Math.abs(
                                        numberOfJobPast6Month[numberOfJobPast6Month.length - 1].numberOfJob -
                                            numberOfJobPast6Month[numberOfJobPast6Month.length - 2].numberOfJob,
                                    )}{' '}
                                    jobs{' '}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                        fontSize: CustomTypography.FONT_SIZE_16,
                                    }}>
                                    {numberOfJobPast6Month[numberOfJobPast6Month.length - 1].numberOfJob -
                                        numberOfJobPast6Month[numberOfJobPast6Month.length - 2].numberOfJob >=
                                    0
                                        ? 'increased'
                                        : 'decreased'}{' '}
                                    in this month
                                </Text>
                            </View>
                            <View style={{marginLeft: -36, marginTop: 36}}>
                                <LineChart
                                    data={{
                                        labels: numberOfJobPast6Month.map(month => month.monthName), //Array of labels [Jun 21,May 21,Apr 21,Mar 21,Feb 21,Jan 21]
                                        datasets: [
                                            {
                                                data: numberOfJobPast6Month.map(month => month.numberOfJob), //Array of values
                                                color: (opacity = 1) => `rgba(56, 179, 249, 1)`, // optional
                                                strokeWidth: 2, // optional
                                            },
                                        ],
                                    }}
                                    style={{
                                        padding: 0,
                                    }}
                                    width={Dimensions.get('window').width - 32 + 16 + 64}
                                    height={350}
                                    verticalLabelRotation={90}
                                    withInnerLines={false}
                                    withVerticalLines={false}
                                    withHorizontalLines={false}
                                    chartConfig={{
                                        backgroundGradientFrom: 0,
                                        backgroundGradientFromOpacity: 0,
                                        backgroundGradientTo: 0,
                                        backgroundGradientToOpacity: 0,
                                        fillShadowGradient: CustomColors.PRIMARY_LIGHT_BLUE,
                                        fillShadowGradientOpacity: 0.5,
                                        color: (opacity = 1) => `rgba(0, 0, 0, 0.5)`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, 0.5)`,
                                        backgroundColo0r: (opacity = 0) => `rgba(255, 255, 255, 0.5)`,
                                        strokeWidth: 2, // optional, default 3
                                        propsForHorizontalLabels: {fontFamily: CustomTypography.FONT_FAMILY_REGULAR},
                                        propsForVerticalLabels: {fontFamily: CustomTypography.FONT_FAMILY_REGULAR},
                                        decimalPlaces: 0,
                                    }}
                                    decorator={() => {
                                        return tooltipPos.visible ? (
                                            <View style={{opacity: 0.5}}>
                                                <Svg>
                                                    <Rect
                                                        rx={5}
                                                        x={tooltipPos.x - 15}
                                                        y={tooltipPos.y + 10}
                                                        width="40"
                                                        height="30"
                                                        fill="black"
                                                    />
                                                    <TextSVG
                                                        x={tooltipPos.x + 5}
                                                        y={tooltipPos.y + 30}
                                                        fill="white"
                                                        fontSize="16"
                                                        fontWeight="bold"
                                                        textAnchor="middle">
                                                        {tooltipPos.value}
                                                    </TextSVG>
                                                </Svg>
                                            </View>
                                        ) : null;
                                    }}
                                    onDataPointClick={
                                        data => {
                                            // check if we have clicked on the same point again
                                            let isSamePoint = tooltipPos.x === data.x && tooltipPos.y === data.y;

                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                            // if clicked on the same point again toggle visibility
                                            // else,render tooltip to new position and update its value
                                            isSamePoint
                                                ? setTooltipPos(previousState => {
                                                      return {
                                                          ...previousState,
                                                          value: data.value,
                                                          visible: !previousState.visible,
                                                      };
                                                  })
                                                : setTooltipPos({
                                                      x: data.x,
                                                      value: data.value,
                                                      y: data.y,
                                                      visible: true,
                                                  });

                                            clearTimeout(hideTooltipTimeout);

                                            hideTooltipTimeout = setTimeout(() => {
                                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                setTooltipPos(previousState => {
                                                    return {
                                                        ...previousState,
                                                        value: data.value,
                                                        visible: false,
                                                    };
                                                });
                                            }, 2000);
                                        } // end function
                                    }
                                    bezier
                                />
                            </View>
                        </View>
                        <View style={styles.overviewContainer}>
                            <Text
                                style={{
                                    fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                    fontSize: CustomTypography.FONT_SIZE_20,
                                    color: CustomColors.GRAY_DARK,
                                }}>
                                Lifetime Statistic
                            </Text>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                <View style={{width: '50%', paddingRight: 8, marginTop: 16}}>
                                    <Surface
                                        style={{
                                            width: '100%',
                                            padding: 16,
                                            borderRadius: 16,
                                            elevation: 2,
                                        }}>
                                        <View
                                            style={{
                                                width: 72,
                                                height: 72,
                                                padding: 16,
                                                backgroundColor: CustomColors.SUCCESS,
                                                borderRadius: 48,
                                                overflow: 'hidden',
                                            }}>
                                            <EarningIcon fill={'white'} />
                                        </View>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                fontSize: CustomTypography.FONT_SIZE_20,
                                                color: CustomColors.SUCCESS,
                                                marginTop: 16,
                                            }}>
                                            RM {providerInfo?.totalEarnings || '0'}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                fontSize: CustomTypography.FONT_SIZE_16,
                                                color: CustomColors.GRAY,
                                            }}>
                                            Total Earning
                                        </Text>
                                    </Surface>
                                </View>
                                <View style={{width: '50%', paddingLeft: 8, marginTop: 16}}>
                                    <Surface
                                        style={{
                                            width: '100%',
                                            padding: 16,
                                            borderRadius: 16,
                                            elevation: 2,
                                        }}>
                                        <View
                                            style={{
                                                width: 72,
                                                height: 72,
                                                padding: 16,
                                                backgroundColor: CustomColors.PRIMARY_BLUE,
                                                borderRadius: 48,
                                                overflow: 'hidden',
                                            }}>
                                            <JobIcon fill={'white'} />
                                        </View>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                fontSize: CustomTypography.FONT_SIZE_20,
                                                color: CustomColors.PRIMARY_BLUE,
                                                marginTop: 16,
                                            }}>
                                            {providerInfo?.jobsCompleted} jobs
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                fontSize: CustomTypography.FONT_SIZE_16,
                                                color: CustomColors.GRAY,
                                            }}>
                                            Job Completed
                                        </Text>
                                    </Surface>
                                </View>
                                <View style={{width: '50%', paddingRight: 8, marginTop: 16}}>
                                    <Surface
                                        style={{
                                            width: '100%',
                                            padding: 16,
                                            borderRadius: 16,
                                            elevation: 2,
                                        }}>
                                        <View
                                            style={{
                                                width: 72,
                                                height: 72,
                                                padding: 16,
                                                backgroundColor: CustomColors.SECONDARY_BLUE_PURPLE,
                                                borderRadius: 48,
                                                overflow: 'hidden',
                                            }}>
                                            <FeatherIcons name="calendar" size={40} color={'white'} />
                                        </View>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                fontSize: CustomTypography.FONT_SIZE_20,
                                                color: CustomColors.SECONDARY_BLUE_PURPLE,
                                                marginTop: 16,
                                            }}>
                                            {moment(new Date(userInfo.firstJoined)).format('DD MMM yyyy')}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                fontSize: CustomTypography.FONT_SIZE_16,
                                                color: CustomColors.GRAY,
                                            }}>
                                            First Joined
                                        </Text>
                                    </Surface>
                                </View>
                                <View style={{width: '50%', paddingLeft: 8, marginTop: 16}}>
                                    <Surface
                                        style={{
                                            width: '100%',
                                            padding: 16,
                                            borderRadius: 16,
                                            elevation: 2,
                                        }}>
                                        <View
                                            style={{
                                                width: 72,
                                                height: 72,
                                                padding: 16,
                                                backgroundColor: '#ffd30f',
                                                borderRadius: 48,
                                                overflow: 'hidden',
                                            }}>
                                            <AntDesignIcons name="staro" size={40} color={'white'} />
                                        </View>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                fontSize: CustomTypography.FONT_SIZE_20,
                                                color: '#ffd52b',
                                                marginTop: 16,
                                            }}>
                                            {providerInfo?.averageRatings} stars
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: CustomTypography.FONT_FAMILY_MEDIUM,
                                                fontSize: CustomTypography.FONT_SIZE_16,
                                                color: CustomColors.GRAY,
                                            }}>
                                            Average Rating
                                        </Text>
                                    </Surface>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ProviderHomePage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: CustomColors.GRAY_EXTRA_LIGHT,
    },
    welcomeText: {
        flex:1,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.GRAY_DARK,
    },
    lineGraphHeader: {
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        fontSize: CustomTypography.FONT_SIZE_20,
        color: CustomColors.GRAY,
        marginTop: 16,
    },
    welcomeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: CustomColors.WHITE,
        padding: 16,
    },
    chartContainer: {
        marginTop: 8,
        padding: 16,
        backgroundColor: CustomColors.WHITE,
    },
    overviewContainer: {
        marginTop: 8,
        padding: 16,
        backgroundColor: CustomColors.WHITE,
    },
});
