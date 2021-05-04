import React, {useState, useCallback } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import firebase from 'firebase/app'
import { Avatar, Button, Rating  } from 'react-native-elements'
import moment from 'moment/min/moment-with-locales'
import { useFocusEffect } from '@react-navigation/native'

import { getRestaurantReviews } from '../../utils/actions'
import { map, size } from 'lodash'

//el nombre de los meses y de los dias me los maneje en español.
moment.locale("es")

export default function ListReviews({navigation, idRestaurant}) {

    const [userLogged, setuserLogged] = useState(false)
    const [reviews, setReviews] = useState([])

    useFocusEffect(
        useCallback(() => {
            (async() => {
                const response = await getRestaurantReviews(idRestaurant)
                if (response.statusResponse) {
                    setReviews(response.reviews)
                }
            })()
        }, [])
    )

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
             {
                size(reviews) > 0 && (
                    map(reviews, reviewDocument => (
                        <Review reviewDocument={reviewDocument}/>
                    ))
                )
            }
        </View>
    )
}

function Review({ reviewDocument }) {
    const { title, review, createAt, avatarUser, rating } = reviewDocument 
    const createReview = new Date(createAt.seconds * 1000)

    return (
        <View style={styles.viewReview}>
            <View style={styles.imageAvatar}>
                <Avatar
                    renderPlaceholderContent={<ActivityIndicator color="#fff"/>}
                    size="large"
                    rounded
                    containerStyle={styles.imageAvatarUser}
                    source={
                        avatarUser
                            ? { uri: avatarUser}
                            : require("../../assets/avatar-default.jpg")
                    }
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating
                    imageSize={15}
                    startingValue={rating}
                    readonly
                />
                <Text style={styles.reviewDate}>{moment(createReview).format("LLL")}</Text>
            </View>
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
    viewReview: {
        flexDirection: "row",
        padding: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    imageAvatar: {
        marginRight: 15
    },
    imageAvatarUser: {
        width: 50,
        height: 50
    },
    viewInfo: {
        flex: 1,
        alignItems: "flex-start"
    },
    reviewTitle: {
        fontWeight: "bold"
    },
    reviewText: {
        paddingTop: 2,
        color: "gray",
        marginBottom: 5
    },
    reviewDate: {
        marginTop: 5,
        color: "gray",
        fontSize: 12,
        position: "absolute",
        right: 0,
        bottom: 0
    }
})
