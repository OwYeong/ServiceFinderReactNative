// CustomInput.js
import {CustomColors, CustomTypography} from '@styles';
import React, { Fragment } from 'react';
import {StyleSheet} from 'react-native';
import {TextInput, HelperText, Button, IconButton} from 'react-native-paper';

const CustomFormikTextInput = props => {
    const {
        field: {name, onBlur, onChange, value},
        form: {errors, touched, setFieldTouched},
        ...inputProps
    } = props;

    const hasError = errors[name] && touched[name];

    return (
        <Fragment>
            <TextInput
                style={[{}, inputProps.style]}
                error={hasError}
                value={value}
                onChangeText={text => onChange(name)(text)}
                onBlur={() => {
                    setFieldTouched(name);
                    onBlur(name);
                }}
                {...inputProps}
            />
            {hasError ? (
                <HelperText type="error" style={styles.errorText} visible={hasError}>
                    {errors[name]}
                </HelperText>
            ) : null}
        </Fragment>
    );
};

const styles = StyleSheet.create({
    defaultTextStyle: {
        fontSize: CustomTypography.FONT_SIZE_14,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: CustomColors.GRAY_DARK
    },
    errorText: {
        fontSize: CustomTypography.FONT_SIZE_12,
        fontFamily: CustomTypography.FONT_FAMILY_REGULAR,
        color: 'red',
        margin: 0,
        padding: 0
    },
});

export default CustomFormikTextInput;
