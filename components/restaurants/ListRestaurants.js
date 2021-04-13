import { size } from 'lodash'
import React from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity,ActivityIndicator } from 'react-native'
import { Image } from 'react-native-elements'

export default function ListRestaurants({restaurants, navigation, handleLoadMore }) {

    return (
        <View>
            <FlatList 
                data={restaurants}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5} //cuando el usuario haya hecho un scroll hacia abajo al menos del 50%
                onEndReached={handleLoadMore} //vamos a llamar el handleLoadMore que me refresca la FlatList
                renderItem={(restaurant) => (
                    <Restaurant  restaurant={restaurant} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Restaurant({restaurant, navigation, handleLoadMore}){
    //Destructuring de un objeto
    const { id, images, name, address, description, phone, callingCode } = restaurant.item
    const imageRestaurant = images[0]

    const goRestaurant = () => {
        navigation.navigate("restaurant", { id, name })
    } 

    return (
        <TouchableOpacity
            onPress={goRestaurant}
        >
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}> 
                    <Image 
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff" />}
                        source={{uri:imageRestaurant}}
                        style={styles.imagesRestaurant}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantInformation}>{address}</Text>
                    <Text style={styles.restaurantInformation}>+{callingCode} {phone}</Text>
                    <Text style={styles.restaurantDescription}>
                        {
                            size(description) > 0 ? `${description.substr(0,60)}...` : description
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewRestaurant: {
        flexDirection: "row",
        margin: 10
    },
    viewRestaurantImage: {
        marginRight: 15
    },
    imagesRestaurant: {
        width: 90,
        height: 90
    },
    restaurantTitle: {
        fontWeight: "bold"
    },
    restaurantInformation: {
        paddingTop: 2,
        color: "grey"
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: "75%"
    }
})
