import {firebaseApp} from './firebase'
import * as firebase from 'firebase'
import 'firebase/firestore'
import { FireSQL } from 'firesql'
import * as Notifications from 'expo-notifications' //notificaciones con expo notifications.
import Constants from 'expo-constants' //nos sirve para saber si lo estamos ejecutando en un dispositivo fisico o no (emulador o no emulador)

import { fileToBlob } from './helpers'
import { map } from 'lodash'

const db = firebase.firestore(firebaseApp)
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" })

export const isUserLogged = () => {
    let isLogged = false
    
    //nos informa cuando el usuario cambio de estar logueado a no estar logueado.
    firebase.auth().onAuthStateChanged((user) => {
        user !== null && (isLogged = true)
    })
    return isLogged
}

export const getCurrentUser = () => {
    return firebase.auth().currentUser
}

export const closeSession = () => {
    return firebase.auth().signOut()
}

export const registerUser = async(email,password) => {
    const result = {statusRepsonse:true, error:null}
    try {
        await firebase.auth().createUserWithEmailAndPassword(email,password)
    } catch (error) {
        result.statusRepsonse = false
        result.error = "Este correo ya ha sido registrado"
    }
    return result
}

export const loginWithEmailAndPassword = async(email,password) => {
    const result = {statusRepsonse:true, error:null}
    try {
        await firebase.auth().signInWithEmailAndPassword(email,password)
    } catch (error) {
        result.statusRepsonse = false
        result.error = "Usuario o contraseña no válidos"
    }
    return result
}

export const uploadImage = async(image,path, name) => {
    const result = {  statusResponse:false , error:null, url:null }
    const ref = firebase.storage().ref(path).child(name)
    const blob = await fileToBlob(image)

    try {   
        //subimos laimagen
        await ref.put(blob)
        //estamos obteniendo la ruta de como nos quedo la imagen
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL()
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }

    return result
}

export const updateProfile = async(data) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateProfile(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const reauthenticate = async(password) => {
    const result = { statusResponse: true, error: null }
    const user = getCurrentUser()
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password)

    try {
        await user.reauthenticateWithCredential(credentials)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const updateEmail = async(email) => {
    const result = { statusResponse: true, error: null }
    try {
        //el valida que el usuario se haya reautenticado anteiroemtne
        await firebase.auth().currentUser.updateEmail(email)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const updatePassword = async(password) => {
    const result = { statusResponse: true, error: null }
    try {
        //el valida que el usuario se haya reautenticado anteiroemtne
        await firebase.auth().currentUser.updatePassword(password)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

/*Agregar un nuevo restaurante (se denominan docuemntos por que en fireabse se pueden crear n
colecciones y esas colecciones tienen documentos)*/
export const addDocumentWithoutId = async(collection, data) => {
    const result = { statusResponse: true, error: null }
    try {
        //el valida que el usuario se haya reautenticado anteiroemtne
        await db.collection(collection).add(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
        console.log(result)
    }
    return result     
}


//Obtener lista de restaurantes
export const getRestaurants = async(limitRestaurants) => {
    const result = { statusResponse: true, error: null, restaurants: [], startRestaurant: null }
    try {
        const response = await db
            .collection("restaurants")
            .orderBy("createAt", "desc")
            .limit(limitRestaurants)
            .get()
        if (response.docs.length > 0) {
              //Guardamos el ultimo restaurante desde el cual vamos a comenzar a buscar los nuevos restaurantes
            result.startRestaurant = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const restaurant = doc.data()
            //lo hacemos así por que el id viene por separado
            restaurant.id = doc.id
            //guardamos en el objeto que creamos
            result.restaurants.push(restaurant)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

//obtener mas restaurantes de los mostrados en la pantalla
export const getMoreRestaurants = async(limitRestaurants, startRestaurant) => {
    const result = { statusResponse: true, error: null, restaurants: [], startRestaurant: null }
    try {
        const response = await db
            .collection("restaurants")
            .orderBy("createAt", "desc")
            .startAfter(startRestaurant.data().createAt) //para decirle que va a empezar desde starRestaurant a traerlos.
            .limit(limitRestaurants)
            .get()
        if (response.docs.length > 0) {
              //Guardamos el ultimo restaurante desde el cual vamos a comenzar a buscar los nuevos restaurantes
            result.startRestaurant = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const restaurant = doc.data()
            //lo hacemos así por que el id viene por separado
            restaurant.id = doc.id
            //guardamos en el objeto que creamos
            result.restaurants.push(restaurant)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

//Metodo generico que nos sirve para obetener cualquier documento de cualquier coleccion
export const getDocumentById = async(collection, id) => {
    const result = { statusResponse: true, error: null, document: null }
    try {
        const response = await db.collection(collection).doc(id).get()
        result.document = response.data()
        result.document.id = response.id
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

//Actualiza un documento de una coleccion especifica
export const updateDocument = async(collection, id, data) => {
    const result = { statusResponse: true, error: null, document: null }
    try {
        await db.collection(collection).doc(id).update(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

//obtener los comentario sde un restaurante
export const getRestaurantReviews = async(id) => {
    const result = { statusResponse: true, error: null, reviews: [] }
    try {
        const response = await db
            .collection("reviews")
            .where("idRestaurant", "==", id)
            .get()
        response.forEach((doc) => {
            const review = doc.data()
            //lo hacemos así por que el id viene por separado
            review.id = doc.id
             //guardamos en el objeto que creamos
            result.reviews.push(review)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}


export const getIsFavorite = async(idRestaurant) => {
    const result = { statusResponse: true, error: null, isFavorite: false }
    try {
        const response = await db
            .collection("favorites")
            .where("idRestaurant", "==", idRestaurant)
            .where("idUser", "==", getCurrentUser().uid)
            .get()
            //si es mayor a cero es por que si es favorito, de lo contrario es por que no
        result.isFavorite = response.docs.length > 0
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const deleteFavorite = async(idRestaurant) => {
    const result = { statusResponse: true, error: null }
    try {
        const response = await db
            .collection("favorites")
            .where("idRestaurant", "==", idRestaurant)
            .where("idUser", "==", getCurrentUser().uid)
            .get()
        //por seguridad es mejor hacerlo con foreach ya que puede existr mas de uno (no es casual)
        response.forEach(async(doc) => {
            const favoriteId = doc.id
            await db.collection("favorites").doc(favoriteId).delete()
        })    
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

//devuelve los restaurantes favoritos de un usuario logueado.
export const getFavorites = async() => {
    const result = { statusResponse: true, error: null, favorites: [] }
    try {
        const response = await db
            .collection("favorites")
            .where("idUser", "==", getCurrentUser().uid)
            .get()
        await Promise.all(
            map(response.docs, async(doc) => {
                const favorite = doc.data()
                const restaurant = await getDocumentById("restaurants", favorite.idRestaurant)
                if (restaurant.statusResponse) {
                    result.favorites.push(restaurant.document)
                }
            })
        )
    } catch (error) {
        console.log("error")
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getTopRestaurants = async(limit) => {
    const result = { statusResponse: true, error: null, restaurants: [] }
    try {
        const response = await db
            .collection("restaurants")
            .orderBy("rating", "desc")
            .limit(limit)
            .get()
        response.forEach((doc) => {
            const restaurant = doc.data()
            restaurant.id = doc.id
            result.restaurants.push(restaurant)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const searchRestaurants = async(criteria) => {
    const result = { statusResponse: true, error: null, restaurants: [] }
    try {
        result.restaurants = await fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${criteria}%'`)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}