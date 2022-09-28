import { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Pressable, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_API_PATH } from '@env';

export default function Name({ navigation }) {
    const [name, setName] = useState();
    const [enableBtn, setEnableBtn] = useState(false);

    function handleChangeText(text) {
        if (!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(text)) {
            if (enableBtn) {
                setEnableBtn(false)
            }
        } else if (!enableBtn) {
            setEnableBtn(true)
        }
        setName(text)
    }

    function getErrorCode(code) {
        let msg = '';
        switch(code) {
            case 'PHONENUMNOTVALID':
                msg = 'phone number not valid'
                break;
            case 'USEREX':
                msg = 'behavioral error, please retry later';
                break;
            case 'INSERR':
                msg = 'Service error, please retry later';
                break;
            default:
                msg = 'Please retry later';
        }

        return msg
    }

    async function submit() {
        if (enableBtn) {
            const phoneNumber = await AsyncStorage.getItem('@phoneNumberResidual');
            axios.post(REACT_APP_API_PATH + '/users', {}, {
                params: { num: phoneNumber, name }
            })
                .then(async (resp) => {
                    if (resp.status != 202 || resp.data?.error) {
                        Alert.alert(
                            'API error result',
                            getErrorCode(resp.data?.error?.code),
                            [ { text: 'OK' } ]
                        )
                    } else {
                        await AsyncStorage.setItem('@authentificationResidual', phoneNumber);
                        navigation.navigate('Greeting');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    Alert.alert(
                        'API error',
                        getErrorCode(err.response?.data?.error.code),
                        [ { text: 'OK' } ]
                    )
                })
        }
    }            

    return (
        <SafeAreaView style={styles.name}>
            <View style={styles.para}>
                <Text style={styles.welcome}>Qui es tu ? (x2)</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={handleChangeText}
                    value={name}
                    placeholder='Entrée votre prénom / pseudo'
                    keyboardType="default"
                    autoComplete='name'
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
                <Text style={styles.mdr}>j'adore les paul 👀</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    name: {
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