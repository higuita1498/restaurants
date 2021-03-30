import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements'

export default function Loading({ isVisible, text }) {
    return (
      <Overlay 
        isVisible={isVisible}
        wondowBackgroundColor="rgba(0,0,0,0.5)"
        overlayBackgroundColor="transparent"
        overlayStyle={styles.overlay}
      >
          <View  style={styles.view}>
              <ActivityIndicator 
                size="large"
                color="#442484"
              />
              {
                  text &&  <Text style={styles.text}>{text}</Text>
              }
          </View>
     </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay : {
        height:100,
        width: "50%",
        backgroundColor: "#FFFFFF" ,
        borderColor: "#442484",
        borderWidth:2,
        borderRadius:10
    },
    view : {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        color: "#442484",
        marginTop: 10
    }
})
