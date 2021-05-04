import React, { useState, useCallback, useRef, useEffect } from 'react'
import { View } from 'react-native'
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from 'react-native'
import { ListItem, Rating, Icon, Input, Button } from 'react-native-elements'
import { isEmpty, map } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'

import CarouselImages from '../../components/CarouselImages'
import Loading from '../../components/Loading'
import MapRestaurant from '../../components/restaurants/MapRestaurant'
import ListReviews from '../../components/restaurants/ListReviews'
import { 
    addDocumentWithoutId, 
    getCurrentUser, 
    getDocumentById, 
    getIsFavorite, 
    deleteFavorite, 
    sendPushNotification, 
    setNotificationMessage, 
    getUsersFavorite
} from '../../utils/actions'
import { callNumber, formatPhone, sendEmail, sendWhatsApp } from '../../utils/helpers'
import Modal from '../../components/Modal'

const widthScreen = Dimensions.get("window").width

export default function Restaurant({ navigation, route }) {
    const toastRef = useRef()

    const {id, name} = route.params
    const [restaurant, setRestaurant] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
        setCurrentUser(user)
    })

    useEffect(() => {
        (async() => {
            if (userLogged && restaurant) {
                const response = await getIsFavorite(restaurant.id)
                response.statusResponse && setIsFavorite(response.isFavorite)
            }
        })()
    /*NOTA
    Al pasar parametros por acá queremos decir que esto se debe ejcutar cuando carguen previamente el restaurante
    y el userLogued
    */
    }, [userLogged, restaurant])

    //Importante!
    //con esto decimos que no me recargue la página UNA SOLA VEZ si no CADA VEZ QUE NAVEGUEMOS A LA PAGINA
    useFocusEffect(
        useCallback(() => {
            //funcion asincrona autollamada
            (async()=> {
                const response =  await getDocumentById("restaurants", id)
                if(response.statusResponse){
                    setRestaurant(response.document)
                }else{
                    setRestaurant({})
                    Alert.alert("Ocurrio un problema cargando el restaurante. Intene más tarde.")
                }
            })()
        }, [])
    )

    const addFavorite = async() => {
        if (!userLogged) {
            toastRef.current.show("Para agregar el restaurante a favoritos debes estar logueado.", 3000)
            return
        }

        setLoading(true)
        //es addDocumentWithoutId por que no lo pasamos el id
        const response = await addDocumentWithoutId("favorites", {
            idUser: getCurrentUser().uid,
            idRestaurant: restaurant.id
        })
        setLoading(false)
        if (response.statusResponse) {
            setIsFavorite(true)
            toastRef.current.show("Restaurante añadido a favoritos.", 3000)
        } else {
            toastRef.current.show("No se pudo adicionar el restaurante a favoritos. Por favor intenta más tarde.", 3000)
        }
    }

    const removeFavorite = async() => {
        setLoading(true)
        const response = await deleteFavorite(restaurant.id)
        setLoading(false)

        if (response.statusResponse) {
            setIsFavorite(false)
            toastRef.current.show("Restaurante eliminado de favoritos.", 3000)
        } else {
            toastRef.current.show("No se pudo eliminar el restaurante de favoritos. Por favor intenta más tarde.", 3000)
        }
    }

    if(!restaurant){
        return <Loading isVisible={true} text="Cargando..." />
    }

    navigation.setOptions({title: name})

    return ( 
        <ScrollView style={styles.viewBody}>
            <CarouselImages 
                images={restaurant.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={ isFavorite ? "heart" : "heart-outline" }
                    onPress={ isFavorite ? removeFavorite : addFavorite }
                    color="#442484"
                    size={35}
                    underlayColor="tranparent"
                />
            </View>
            <TitleRestaurant 
                name={restaurant.name}
                description={restaurant.description}
                rating={restaurant.rating}
            />
            <RestaurantInfo 
                name={restaurant.name}
                location={restaurant.location}
                address={restaurant.address}
                email={restaurant.email}
                phone={formatPhone(restaurant.callingCode, restaurant.phone)}
                currentUser={currentUser}
                callingCode={restaurant.callingCode}
                phoneNoFormat={restaurant.phone}
            />
            <ListReviews 
                navigation={navigation}
                idRestaurant={restaurant.id}
            />
             <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </ScrollView>
    )
}

function RestaurantInfo({name, location, address, email, phone, currentUser,callingCode,phoneNoFormat}){
    const listInfo = [
        { type: "addres", text: address, iconLeft: "map-marker", iconRight: "message-text-outline" },
        { type: "phone", text: phone, iconLeft: "phone", iconRight: "whatsapp" },
        { type: "email", text: email, iconLeft: "at" },
    ]

    const actionLeft = (type) => {
        if (type == "phone") {
            callNumber(phone)
        } else if (type == "email") {
            if (currentUser) {
                sendEmail(email, "Interesado", `Soy ${currentUser.displayName}, estoy interesado en sus servicios`)
            } else {
                sendEmail(email, "Interesado", `Estoy interesado en sus servicios`)
            }
        }
    }

    const actionRight = (type) => {
        if (type == "phone") {
            if (currentUser) {
                sendWhatsApp(`${callingCode} ${phoneNoFormat}`, `Soy ${currentUser.displayName}, estoy interesado en sus servicios`)
            } else {
                sendWhatsApp(`${callingCode} ${phoneNoFormat}`, `Estoy interesado en sus servicios`)
            }
        } else if (type == "addres") {
            setModalNotification(true)
        }
    }

    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>
                Información sobre el restaurante
            </Text>
            <MapRestaurant
                location={location}
                name={name}
                height={150}
            />
            {
                map(listInfo, (item, index) => (
                    <ListItem
                        key={index}
                        style={styles.containerListItem}
                    >
                        <Icon
                            type="material-community"
                            name={item.iconLeft}
                            color="#442484"
                            onPress={() => actionLeft(item.type)}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                        {
                            item.iconRight && (
                                <Icon
                                    type="material-community"
                                    name={item.iconRight}
                                    color="#442484"
                                    onPress={() => actionRight(item.type)}
                                />
                            )
                        }
                    </ListItem>
                ))
            }
        </View>
    )
}

function TitleRestaurant({name,description,rating}){
    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={styles.viewRestaurantContainer}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating 
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestaurantTitle: {
        padding: 15,
    },
    viewRestaurantContainer: {
        flexDirection: "row"
    },
    descriptionRestaurant: {
        marginTop: 8,
        color: "gray",
        textAlign: "justify"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    nameRestaurant: {
        fontWeight: "bold"
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 25
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#a376c7",
        borderBottomWidth: 1
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
    },
    textArea: {
        height: 50,
        paddingHorizontal: 10
    },
    btnSend: {
        backgroundColor: "#442848"
    },
    btnSendContainer: {
        width: "95%"
    },
    textModal: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold"
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center"
    }
})
