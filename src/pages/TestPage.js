import React, {useState, useRef, useCallback} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomSheet from 'react-native-bottomsheet-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TestPage = () => {
    const actionSheetRef = useRef(null);

    return (
        <View style={{backgroundColor: 'yellow'}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View style={styles.bigContainer}>
                        <Button onPress={()=>{
                            actionSheetRef.current.snapTo(1);
                        }}> Testing</Button>
                        
                    </View>
                </ScrollView>
            </SafeAreaView>

            <BottomSheet
                ref={actionSheetRef}
                bottomSheerColor="#FFFFFF"
                initialPosition={0}
                snapPoints={[0, 160]}
                isBackDrop={true}
                isBackDropDismissByPress={true}
                isRoundBorderWithTipHeader={true}
                body={
                    <View style={{paddingVertical: 16}}>
                        <TouchableOpacity
                            onPress={() => {
                                actionSheetRef.current.snapTo(0);
                            }}>
                            <View style={styles.actionButton}>
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                    }}>
                                    <MaterialIcons name="mode-edit" size={24} color={'gray'} />
                                </View>
                                <Text style={styles.actionButtonLabel}>action 1</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                actionSheetRef.current.snapTo(0);
                            }}>
                            <View style={styles.actionButton}>
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                    }}>
                                    <MaterialIcons name="delete" size={24} color={'gray'} />
                                </View>
                                <Text style={styles.actionButtonLabel}>action 2</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
};

export default TestPage;

const styles = StyleSheet.create({
    bigContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'yellow',
        padding: 16,
    },    
    actionButton: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    actionButtonLabel: {
        fontSize: 14,
        color: 'black',
        marginHorizontal: 16,
    },
});
