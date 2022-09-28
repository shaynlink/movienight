import { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Pressable, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_API_PATH } from '@env';

export default function Number({ navigation }) {
    const [number, setNumber] = useState();
    const [enableBtn, setEnableBtn] = useState(false);

    function handleChangeText(text) {
        if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gmi.test(text)) {
            if (enableBtn) {
                setEnableBtn(false)
            }
        } else if (!enableBtn) {
            setEnableBtn(true)
        }
        setNumber(text)
    }

    function submit() {
        if (enableBtn) {
            axios.get(REACT_APP_API_PATH + '/users', {
                params: { num: number }
            })
                .then(async (resp) => {
                    if (resp.status != 202 || resp.data?.error) {
                        Alert.alert(
                            'API error',
                            resp.data?.error?.code == 'PHONENUMNOTVALID'
                                ? 'phone number not valid'
                                : 'please retry later',
                            [ { text: 'OK' } ]
                        )
                    } else {
                        if (resp.data == null) {
                            await AsyncStorage.setItem('@phoneNumberResidual', number);
                            navigation.navigate('Name')
                        } else {
                            await AsyncStorage.setItem('@authentificationResidual', number);
                            navigation.navigate('Greeting')
                        }
                    }
                })
                .catch((err) => {
                    if (err.response?.data?.error.code == 'PHONENUMNOTVALID') {
                        Alert.alert(
                            'API error',
                            'phone number not valid',
                            [ { text: 'OK' } ]
                        )
                    } else {
                        Alert.alert(
                            'API error',
                            'Please retry later',
                            [ { text: 'OK' } ]
                        )
                    }
                })
        }
    }            

    return (
        <SafeAreaView style={styles.number}>
            <View style={styles.para}>
                <Text style={styles.welcome}>Qui es tu ?</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={handleChangeText}
                    value={number}
                    placeholder='Entrée votre numéro de téléphone'
                    keyboardType="numeric"
                    autoComplete='tel-device'
                    autoFocus={true}
                    returnKeyType='done'
                    contextMenuHidden={false}
                    enablesReturnKeyAutomatically={true}
                />
            </View>

            <View style={styles.next}>
                <Pressable style={enableBtn ? styles.btn : styles.btnDisable} onPress={submit}>
                    <Text style={styles.btnText}>suivant</Text>
                </Pressable>
                <Text style={styles.mdr}>Pense baleine</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
     number: {
        height: '100%',
        width: '100%',
        backgroundColor: '#262626',
        flex: 1,
        alignItems: 'center'
    },
    para: {
        flex: 1,
        alignItems: 'center',
        marginTop: 40
    },
    welcome: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: '30',
        marginBottom: 20
    },
    text: {
        color: '#fff',
        textAlign: 'center'
    },
    next: {
        flex: 1,
        alignItems: 'center', 
        height: '100%',
        width: '80%',
        justifyContent: 'flex-end'
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#404040',
        width: '100%',
        height: 50,
        marginBottom: 20
    },
    btnDisable: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderColor: '#404040',
        borderStyle: 'solid',
        borderWidth: '1px',
        width: '100%',
        height: 50,
        marginBottom: 20
    },
    btnText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: '17',
    },
    mdr: {
        color: '#fff',
    },
    input: {
        color: '#fff'
    }
})