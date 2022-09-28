import {SafeAreaView, Text, StyleSheet, View, Pressable} from 'react-native';

export default function First({ navigation }) {
    return (
        <SafeAreaView style={styles.first}>
            <View style={styles.para}>
                <Text style={styles.welcome}>Bienvenue</Text>
                <Text style={styles.text}>Cette application est réservé à notre groupe de pote  ou personne autorisé à l'utiliser</Text>
            </View>

            <View style={styles.next}>
                <Pressable style={styles.btn} onPress={() => navigation.push('Number')}>
                    <Text style={styles.btnText}>suivant</Text>
                </Pressable>
                <Text style={styles.notForNotUs}>Nous nous reservons le droit d'empêcher une personne à utiliser l'application</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    first: {
        height: '100%',
        width: '100%',
        backgroundColor: '#262626',
        flex: 1,
        alignItems: 'center'
    },
    para: {
        flex: 1,
        alignItems: 'center',
        width: '70%',
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
    btnText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: '17',
    },
    notForNotUs: {
        color: '#fff',
    }
})