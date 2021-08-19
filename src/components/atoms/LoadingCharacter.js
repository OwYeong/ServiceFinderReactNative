import {CustomTypography} from '@styles';
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Animated, Easing, Text, View} from 'react-native';

/**
 * Jumping text animation
 * Modified from https://github.com/alexvcasillas/react-native-loading-dots
 *
 */

function LoadingCharacter({
    text = 'ServiceFinder',
    textColor = 'white',
    fontSize = CustomTypography.FONT_SIZE_24,
    fontFamily = CustomTypography.FONT_FAMILY_BOLD,
    bounceHeight = 5,
    animationDelayAfterEachLoop = 2000,
}) {
    const [animations, setAnimations] = useState([]);

    const opacity = useRef(new Animated.Value(0)).current;
    var appearAnimationRef = null;
    var charAnimationRef = null;

    useEffect(() => {
        const charAnimations = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < text.length; i++) {
            charAnimations.push(new Animated.Value(0));
        }
        setAnimations(charAnimations);

        return () => {
            appearAnimationRef.stop();
            charAnimationRef.stop();
        };
    }, []);

    useEffect(() => {
        if (animations.length === 0) return;
        loadingAnimation(animations);
        appearAnimation();
    }, [animations]);

    function appearAnimation() {
        appearAnimationRef = Animated.timing(opacity, {
            toValue: 1,
            easing: Easing.ease,
            useNativeDriver: true,
        });

        appearAnimationRef.start();
    }

    function floatAnimation(node, delay) {
        const floatSequence = Animated.sequence([
            Animated.timing(node, {
                toValue: -bounceHeight,
                easing: Easing.bezier(0.41, -0.15, 0.56, 1.21),
                delay,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(node, {
                toValue: 0,
                delay: 20,
                duration: 300,
                useNativeDriver: true,
            }),
        ]);
        return floatSequence;
    }

    function loadingAnimation(nodes) {
        charAnimationRef = Animated.parallel(nodes.map((node, index) => floatAnimation(node, index * 15, index)));

        charAnimationRef.start(() => {
            setTimeout(() => {
                loadingAnimation(animations); // call the animation again when its end, keep infinite loop
            }, animationDelayAfterEachLoop);
        });
    }

    return (
        <Animated.View style={[styles.loading, {opacity}]}>
            {animations.map((animation, index) => (
                <Animated.View
                    // eslint-disable-next-line react/no-array-index-key
                    key={`loading-anim-${index}`}
                    style={[{transform: [{translateY: animation}]}]}>
                    <View>
                        <Text
                            style={{
                                fontSize: fontSize,
                                color: textColor,
                                fontFamily: fontFamily,
                                margin: 1.2,
                            }}>
                            {text[index]}
                        </Text>
                    </View>
                </Animated.View>
            ))}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    loading: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default LoadingCharacter;
