import {firebaseApp} from './firebase'
import * as firebase from 'firebase'
import 'firebase/firestore'

import { fileToBlob } from './helpers'

const db = firebase.firestore(firebaseApp)

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