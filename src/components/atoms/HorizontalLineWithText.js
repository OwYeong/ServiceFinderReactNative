import { CustomColors, CustomTypography } from '@styles';
import React from 'react';
import {View, Text} from 'react-native';

const HorizontalLineWithText = ({
    textName,
    textColor = CustomColors.GRAY_DARK,
    lineStrokeWidth = 1,
    lineColor = CustomColors.GRAY_DARK,
    fontSize = CustomTypography.FONT_SIZE_12,
    fontFamily = CustomTypography.FONT_FAMILY_REGULAR,
}) => {

    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: lineStrokeWidth, backgroundColor: lineColor}} />
            <View>
                <Text style={{ textAlign: 'center', color: textColor, paddingLeft: 8, paddingRight: 8, fontSize: fontSize, fontFamily: fontFamily}}>{textName}</Text>
            </View>
            <View style={{flex: 1, height: lineStrokeWidth, backgroundColor: lineColor}} />
        </View>
    );
};

export default HorizontalLineWithText;
