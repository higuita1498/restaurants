import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import firebase from 'firebase/app'
import { Button } from 'react-native-elements'

export default function ListReviews({navigation, idRestaurant}) {

    const [userLogged, setuserLogged] = useState(false)

    //para saber si hay un usuario logueado.
    firebase.auth().onAuthStateChanged((user) => {
        user ? setuserLogged(true) : setuserLogged(false)
    })

    return (
        <View>
            {
                userLogged ? (
                    <Button
                        buttonStyle={styles.btnAddReview}
                        titleStyle={styles.btnTitelAddReview}
                        onPress={() => navigation.navigate("add-review-restaurant", { idRestaurant: idRestaurant})}
                        title="Escribe una opinión"
                        icon={{
                            type: "material-community",
                            name: "square-edit-outline",
                            color: "#a376c7"
                        }}
                    />
                ) : (
                    <Text 
                        style={styles.mustLoginText}
                        onPress={() => navigation.navigate("login")}
                    >
                        Para escribir una opinión es necesario estar logueado.{" "}
                        <Text style={styles.loginText}>
                            Pusla AQUÍ para iniciar sesión.
                        </Text>
                    </Text>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent"
    },
    btnTitelAddReview: {
        color: "#a376c7"
    },
    mustLoginText: {
        textAlign: "center",
        color: "#a376c7",
        padding: 20,
    },
    loginText: {
        fontWeight: "bold"
    },
})
