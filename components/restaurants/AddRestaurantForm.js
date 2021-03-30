import React, {useState, useEffect} from 'react'
import { Alert, Dimensions,ScrollView, StyleSheet, Text, View } from 'react-native'
import { Input,Button, Icon, Avatar, Image} from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import { map, size, filter, isEmpty } from 'lodash'
import uuid from 'random-uuid-v4'

import { loadImageFromGallery,getCurrentLocation, validateEmail } from '../../utils/helpers'
import { addDocumentWithoutId, getCurrentUser, uploadImage } from '../../utils/actions'
import Modal from '../../components/Modal'
import MapView from 'react-native-maps'

//nos da el ancho de la pantalla
const widthScreen = Dimensions.get("window").width

export default function AddRestaurantForm({ toastRef, setLoading, navigation }) {

    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(false)


    //estados de imagenes
    const [imagesSelected, setImagesSelected] = useState([])

    
    const addRestaurant = async() => {
        if (!validForm()) {
            return
        }

        setLoading(true)
        const responseUploadImages = await uploadImages()
        const restaurant = {
            name: formData.name,
            address: formData.address,
            description: formData.description,
            callingCode: formData.callingCode,
            phone: formData.phone,
            location: locationRestaurant,
            email: formData.email,
            images: responseUploadImages,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: getCurrentUser().uid
        }

        const responseAddDocument = await addDocumentWithoutId("restaurants", restaurant)

        console.log(responseAddDocument)

        if(!responseAddDocument.statusResponse){
            toastRef.current.show("Error al grabar el restaurante porfavor intenta más tarde",3000)
            setLoading(false)
            return
        }

        navigation.navigate("restaurants")
        
        console.log("Fuck yeahh!!")
    }

    const uploadImages = async() => {
        const imagesUrl = []
        //como vamos a subir varias imagenes le decimos que espere todo
        await Promise.all(
            map(imagesSelected, async(image) => {
                //con el uuid() importamos un uuid unico por cada imagen subida
                const response = await uploadImage(image, "restaurants", uuid())
                if (response.statusResponse) {
                   imagesUrl.push(response.url)
                }
            })
        )
        return imagesUrl
    }

    const validForm = () => {
        clearErrors()
        let isValid = true

        if (isEmpty(formData.name)) {
            setErrorName("Debes ingresar el nombre del restaurante.")
            isValid = false
        }

        if (isEmpty(formData.address)) {
            setErrorAddress("Debes ingresar la dirección del restaurante.")
            isValid = false
        }

        if (!validateEmail(formData.email)) {
            setErrorEmail("Debes ingresar un email de restaurante válido.")
            isValid = false
        }

        if (size(formData.phone) < 10) {
            setErrorPhone("Debes ingresar un teléfono de restaurante válido.")
            isValid = false
        }

        if (isEmpty(formData.description)) {
            setErrorDescription("Debes ingresar una descripción del restaurante.")
            isValid = false
        }

        if (!locationRestaurant) {
            toastRef.current.show("Debes de localizar el restaurante en el mapa.", 3000)
            isValid = false
        } else if(size(imagesSelected) === 0) {
            toastRef.current.show("Debes de agregar al menos una imagen al restaurante.", 3000)
            isValid = false
        }

        return isValid
    }


    //limpiamos los errores.
    const clearErrors = () => {
        setErrorAddress(null)
        setErrorDescription(null)
        setErrorEmail(null)
        setErrorName(null)
        setErrorPhone(null)
    }


    return (
        //lo dejamos en scrollview por que muy probablemente nos quede muy grande la pantalla y no quepa entel pequeño
        <ScrollView styles={styles.viewContainer}>

            <ImageRestaurant
                imageRestaurant={imagesSelected[0]}
            />

            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorAddress={errorAddress}
                errorPhone={errorPhone}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />

            <UploadImage 
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />

            <Button 
                title="Crear Restaurante"
                //cuando la funcion tipo flecha no lleva parametros basta con solo llamar el metodo
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <MapRestaurant 
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function MapRestaurant({isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef}) {
 
    const [newRegion, setNewRegion] = useState(null)
        
    useEffect(() => {
        //async autollamado se abren dos parentesis
        (async() => {
            const response = await getCurrentLocation()
            if (response.status) {
                setNewRegion(response.location)
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(newRegion)
        toastRef.current.show("Localización guardada correctamente.", 3000)
        setIsVisibleMap(false)
    }

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {
                    newRegion && (
                       
                        <MapView
                            style={styles.mapStyle}
                            initialRegion={newRegion}
                            showsUserLocation={true}
                            onRegionChange={(region) => setNewRegion(region)}
                            >
                            <MapView.Marker
                                coordinate={{
                                    latitude: newRegion.latitude,
                                    longitude: newRegion.longitude
                                }}
                                draggable //puede cambiar la posición del marcador
                            />
                        </MapView>
                    )
                }
                <View style={styles.viewMapBtn}>
                    <Button 
                        title="Guardar ubicación"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button 
                        title="Cancelar ubicación"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

//Asi se crean los componente internos.
function ImageRestaurant({imageRestaurant}){
    return (
        <View style={styles.viewPhoto}>

        <Image 
            style={{width:widthScreen, height:200}}
            source={
                imageRestaurant ? {uri:imageRestaurant} 
                : require("../../assets/no-image.png") 
            }
        />

        </View>
    )
}


function UploadImage({toastRef,imagesSelected,setImagesSelected}){

    //funciton tipo flecha para llamar las imagenes desde el helper.
    const imageSelect = async() => {
        const response = await loadImageFromGallery([4,3])

        //si el usuario no selecciona ninguna imagen sale este mensaje
        if(!response.status){
            toastRef.current.show("no has seleccionado ninguna imagen", 3000)
            return
        }

        //Acá tomamos una copia del array y le añadimos el response.image que escogimos desde la galeria
        setImagesSelected([...imagesSelected, response.image])

    }

    //recibe como parametro la imagen que vamos a elminar
    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro que quieres eliminar la imagen?",
            [
                {
                    text:"No",
                    style:"cancelled"
                },
                {
                    text:"Sí",
                    onPress: () => {
                        setImagesSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            //Nos permite cerrar el cuadro de dialogo.
            {
                cancellable: true
            }
        )
    }

    return (
        <ScrollView
            horizontal
            style={styles.viewImages}
        >
        
        {
            // Solo vamos a pintar el icono si hay menos de 10 imagenes
            size(imagesSelected) < 10 && (
                <Icon 
                type="material-community"
                name="camera"
                color="#7a7a7a"
                containerStyle={styles.containerIcon}
                onPress={imageSelect}
                />
            ) 
        }

        {
            map(imagesSelected, (imageRestaurant,index) => (
                <Avatar 
                    key={index}
                    style={styles.miniatureStyle}
                    source={{uri: imageRestaurant}}
                    onPress={() => removeImage(imageRestaurant)}
                />
            ))
        }   
            
        </ScrollView>
    )
}

function FormAdd({
    formData,
    setFormData,
    errorName,
    errorDescription,
    errorEmail,
    errorAddress,
    errorPhone,
    setIsVisibleMap,
    locationRestaurant}){
    const [country, setCountry] = useState("CO")
    const [callingCode, setCallingCode] = useState("57")
    const [phone, setPhone] = useState("")

    //
      const onChange = (e, type) => {
        setFormData({ ...formData, [type] : e.nativeEvent.text })
    }

    return (
        <View style={styles.viewForm}>
            <Input 
                placeholder="Nombre del restaurante..."
                defaultValue={formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
            />
            <Input 
                placeholder="Dirección del restaurante..."
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                rightIcon={{
                    type:"material-community",
                    name:"google-maps",
                    color: locationRestaurant ? "#442484" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input 
                keyboardType="email-address"
                placeholder="Email del restaurante..."
                defaultValue={formData.email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errorEmail}
            />
            <View style={styles.phoneView}>
                <CountryPicker 
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStyle={styles.countryPicker}
                    countryCode={country}
                    onSelect={(country) => {
                        setFormData({...formData, "country":country.cca2, "callingCode":country.callingCode[0]})
                        setCountry(country.cca2)
                        setCallingCode(country.callingCode[0])
                    }}
                />

                <Input 
                    placeholder="WhatssApp del restaurante..."
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    defaultValue={formData.phone}
                    onChange={(e) => onChange(e, "phone")}
                    errorMessage={errorPhone}
                />
            </View>
            <Input 
                    placeholder="Descripción del restaurante..."
                    multiline //ocupa varios renglones
                    containerStyle={styles.textArea}
                    defaultValue={formData.errorDescription}
                    onChange={(e) => onChange(e, "description")}
                    errorMessage={errorDescription}
            />
        </View>
    )
}

//Variables por defecto para el formData
const defaultFormValues = () => {
    return {
        name:"",
        description:"",
        email:"",
        phone:"",
        address:"",
        country:"CO",
        callingCode:"57",
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%"
    },
    viewForm: {
        marginHorizontal: 10,
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    phoneView: {
        width: "80%",
        flexDirection: "row"
    },
    inputPhone: {
        width: "80%"
    },
    btnAddRestaurant: {
        margin: 20,
        backgroundColor: "#442484"
    },
    viewImages: {
        flexDirection:"row",
        marginHorizontal:20,
        marginTop:30 
    },
    containerIcon:{
        alignItems: "center",
        justifyContent:"center",
        marginRight:10,
        height:70,
        width:70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle:{
        width:70,
        height:70,
        marginRight:10,
    },
    viewPhoto:{
        alignItems: "center",
        height:200,
        marginBottom:20
    },
    mapStyle: {
        width:"100%",
        height:550,
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#a65273"
    },
    viewMapBtnSave: {
        backgroundColor: "#442484"
    }
})
