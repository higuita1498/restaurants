import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { isEmpty, size } from 'lodash'

import { reauthenticate, updatePassword, updateProfile } from '../../utils/actions'
import { validateEmail } from '../../utils/helpers'

export default function ChangePasswordForm({email,setShowModal,toastRef,setReloadUser}) {

    //nuevo nombre del usuario
    const [newPassword, setNewPassword] = useState(null)
    const [currentPassword, setCurrentPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [errorNewPassword, setErrorNewPassword] = useState(null)
    const [errorCurrentPassword, setErrorCurrentPassword] = useState(null)
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async() => {
        if(!validateForm()){
            return
        }

        setLoading(true)
        //Reautenticamos el usuario que está logueado para cambiar la contraseña.
        const resultReauthenticate = await reauthenticate(currentPassword)

        //Si no hay un usuario reautenticado
        if(!resultReauthenticate.statusResponse){
            setLoading(false)
            setErrorCurrentPassword("Contraseña incorrecta")
            return
        }

        const resultUpdatePassword = await updatePassword(newPassword)
        setLoading(false)

        if(!resultUpdatePassword.statusResponse){
            setLoading(false)
            setErrorNewPassword("Hubo un problema cambiando la contraseña, porfavor intente más tarde")
            return
        }
        
        toastRef.current.show("Se ha actualizado la contraseña",3000)
        setShowModal(false)

    }

    //Metodo para validar los errores en el formulario
    const validateForm = () => {
        setErrorNewPassword(null)
        setErrorCurrentPassword(null)
        setErrorConfirmPassword(null)
        let isValid = true

        if(isEmpty(currentPassword)){
            setErrorCurrentPassword("Debes ingresar tu contraseña actual")
            isValid = false;
        }

        if(size(newPassword) < 6){
            setErrorNewPassword("Debes ingresar una nueva contraseña de al menos 6 carácteres")
            isValid = false;
        }

        if(size(confirmPassword) < 6){
            setErrorConfirmPassword("Debes ingresar una confirmacioón de tu contraseña de al menos 6 carácteres")
            isValid = false;
        }

        if(newPassword !== confirmPassword){
            setErrorConfirmPassword("La nueva contraseña  y la confirmación no son iguales")
            setErrorNewPassword("La nueva contraseña  y la confirmación no son iguales")
            isValid = false;
        }

        if(newPassword === currentPassword){
            setErrorNewPassword("Debes ingresar una contraseña diferente a la actual")
            setErrorCurrentPassword("Debes ingresar una contraseña diferente a la actual")
            setErrorNewPassword("Debes ingresar una contraseña diferente a la actual")
            isValid = false;
        }

        return isValid

    }

    return (
        <View style={styles.view}>
    
            <Input 
                placeholder="Ingresa tu contraseña actual"
                containerStyle={styles.input}
                defaultValue={currentPassword}
                onChange={(e)=> setCurrentPassword(e.nativeEvent.text)}
                errorMessage={errorCurrentPassword}
                password
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={{color:"#c2c2c2"}}
                        onPress = {() => setShowPassword(!showPassword)}
                    />
                }
            />

            <Input 
                placeholder="Ingresa tu nueva contraseña"
                containerStyle={styles.input}
                defaultValue={newPassword}
                onChange={(e)=> setNewPassword(e.nativeEvent.text)}
                errorMessage={errorNewPassword}
                password
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={{color:"#c2c2c2"}}
                        onPress = {() => setShowPassword(!showPassword)}
                    />
                }
            />

            <Input 
                placeholder="Ingresa tu confirmacion de tu nueva contraseña"
                containerStyle={styles.input}
                defaultValue={confirmPassword}
                onChange={(e)=> setConfirmPassword(e.nativeEvent.text)}
                errorMessage={errorConfirmPassword}
                password
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={{color:"#c2c2c2"}}
                        onPress = {() => setShowPassword(!showPassword)}
                    />
                }
            />

            
            <Button
                title="Cambiar Contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={loading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view:{
        alignItems: "center",
        paddingVertical: 10,
    },
    input:{
        marginBottom:10,
    },
    btnContainer:{
        width:"95%"
    },
    btn:{
        backgroundColor:"#442484"
    }
})
