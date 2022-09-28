import {useState, useCallback} from 'react';
import {Image, StyleSheet, Text, SafeAreaView, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import rest from '../lib/rest';

export default function Greeting({ navigation }) {
    const [_err, setErr] = useState(null);
    
    useFocusEffect(useCallback(() => {
        const healthCheck = rest.HealthCheck().call();

        const standing = async () => {
            healthCheck.subscribe()
                .then(async (resp) => {
                    if (resp.status !== 204) {
                        setErr('APINOTRESPONDING')
                    }
                    await getAuth();
                }).catch((err) => {
                    console.error(err);
                    setErr('APINOTRESPONDING')
                });
        }
    
        const getAuth = async () => {
            await AsyncStorage.getItem('@authentification')
                .then(async (value) => {
                    if (value != null) {
                        navigation.navigate('Home')
                    } else {
                        const num = await AsyncStorage.getItem('@authentificationResidual');
                        if (num) {
                            await axios.get(REACT_APP_API_PATH + '/users', {params: {num}})
                                .then(async (resp) => {
                                    if (!resp.data) {
                                        await AsyncStorage.removeItem('@authentificationResidual')
                                        await AsyncStorage.removeItem('@phoneNumberResidual')
                                        navigation.navigate('First');
                                    } else {
                                        await AsyncStorage.setItem('@authentification', JSON.stringify(resp.data));
                                        navigation.navigate('Home');
                                    }
                                })
                        } else {
                            await AsyncStorage.removeItem('@authentificationResidual')
                            await AsyncStorage.removeItem('@phoneNumberResidual')
                            navigation.navigate('First')
                        }
                    }
                })
                .catch(() => setErr('STORAGEERROR'));
        }

        standing()

        return () => healthCheck.unsubscribe();
    }, [_err]));

    return (
        <SafeAreaView style={styles.greeting}>
            <Image style={styles.logo} source={require('../assets/icon.png')} />
            <Text style={styles.text}>MovieNight</Text>
            {!_err && (<ActivityIndicator size="large" />)}
            {_err && _err == 'STORAGEERROR' && (<Text style={styles.errorText}>Une erreur c'est produit au stockage</Text>)}
            {_err && _err == 'APINOTRESPONDING' && (<Text style={styles.errorText}>l'API ne répond pas</Text>)}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    greeting: {
        flex: 1,
        backgroundColor: '#262626',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 25
    },
    text: {
        color: '#fff',
        marginBottom: 25
    },
    errorText: {
        color: 'red',
        fontWeight: 'bold'
    }
})