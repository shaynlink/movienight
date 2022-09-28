import { useState } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, Text, View, Pressable, ScrollView, SectionList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../components/Card';
import rest from '../lib/rest';

export default function Home({ navigation }) {
    const [user, setUser] = useState(null);
    const [movies] = useState([
        {
            _id: 'ddd',
            by: 'Rayane',
            forDate: new Date(2022, 9, 20),
            participes: ['001', '002', '003', '6329029de98b442e02f1f4d5']
        },
        {
            _id: 'dee',
            by: 'x',
            forDate: new Date(2022, 9, 21),
            participes: ['001', '6329029de98b442e02f1f4d5']
        }
    ]);
    
    function submit() {}

    useState(async () => {
        let savedUser = await AsyncStorage.getItem('@authentification');
        try {
            savedUser = JSON.parse(savedUser);
            if (!savedUser.num) {
                //await AsyncStorage.clear();
                //navigation.navigate('Greeting');
                return () => {}
            }
        } catch(err) {
            //await AsyncStorage.clear();
            //navigation.navigate('Greeting');
            return () => {}
        }
        const getUsers = rest.users.Get().call({
            params: { num: savedUser.num }
        })

        getUsers.subscribe()
            .then(async (resp) => {
                if (!resp.data) {
                    //await AsyncStorage.clear();
                    //navigation.navigate('Greeting');
                }
                await AsyncStorage.setItem('@authentification', JSON.stringify(resp.data));
                setUser(resp.data);
            })
            .catch(async (err) => {
                console.error(err);
                //await AsyncStorage.clear();
                //navigation.navigate('Greeting');
            })
        return () => getUsers.unsubscribe();
    }, [setUser])

    return (
        <SafeAreaView style={styles.home}>
            {!user && (
                <View style={styles.loadContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadText}>Chargement de l'utilisateur</Text>
                </View>
            )}
            {user && (
                <View style={styles.info}>
                    <Text style={styles.hey}>Salut {user.name}</Text>
                    <Text style={styles.ptotal}>x participations total</Text>
                    <Pressable style={styles.btn} onPress={submit}>
                        <Text style={styles.btnText}>Ajouter une soirée film</Text>
                    </Pressable>
                    <SectionList
                        sections={[
                            {title: 'Vos participations', data: movies.filter((movie) => movie.participes.includes(user._id))},
                        ]}
                        renderItem={({item}) => <Card movie={item} userId={user._id} />}
                        //renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                        keyExtractor={(movie, index) => movie._id}
                    />
                    <ScrollView>
                        <Text style={styles.ownPart}>Vos participations</Text>
                        {movies.forEach((movie, index) => {
                            return (
                                <>
                                    <Text>Helo</Text>
                                    <Card key={index} movie={movie} userId={user._id} />
                                </>
                            )
                        })}
                    </ScrollView>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    home: {
        height: '100%',
        width: '100%',
        backgroundColor: '#262626',
        flex: 1,
    },
    loadContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadText: {
        color: '#fff'
    },
    info: {
        padding: 30,
        flex: 1,
    },
    hey: {
        color: '#fff',
        width: '100%',
        fontWeight: 'bold',
        fontSize: '35px',
        paddingBottom: 20
    },
    ptotal: {
        color: '#fff',
        width: '100%',
        fontWeight: 'bold',
        fontSize: '20px'
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: '#1B5EC2',
        borderStyle: 'solid',
        borderWidth: '3px',
        width: '100%',
        height: 50,
        marginBottom: 20,
        marginTop: 50
    },
    btnText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 17,
    },
    ownPart: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 20,
        marginTop: 10
    }
})