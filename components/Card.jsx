import {View, StyleSheet, Text} from 'react-native';

export default function Card({ movie, userId }) {
    console.log(movie, userId)

    const dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    return (
        <View style={styles.cardContainer}>
            <View>
                <Text>Par {movie?.by}</Text>
                <Text>Pour {movie.forDate.toLocaleDateString('fr-FR', dateFormatOptions)}</Text>
            </View>
            <View>
                <Text>Vous participez</Text>
                <Text>20 personnes participe</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        height: 30,
        backgroundColor: 'red'
    }
})
