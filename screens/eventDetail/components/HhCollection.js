// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// export default function HhCollection() {
//   return (
//     <View>
//       <Text>HhCollection</Text>
//     </View>
//   )
// }

// const styles = StyleSheet.create({})

const ARTISTS = "https://www.khawlafoundation.com/api/json_event_artists?eventId=17";
import { StyleSheet, Text, TouchableOpacity, View,Image ,Dimensions} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Api from "../../../common/api";
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { FlatList } from "react-navigation";
import ArtistDetail from "../../artistDetail";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const HhCollection = ({ navigation }) => {
  const { hhwork } = navigation.state.params;
  const lng = useSelector((state) => state.programmes.lang);
  const [artist, setArtist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ isLastPage, setIsLastPage ] = useState(false);


  

  

  return (
    <View>
     
     
    <FlatList
   showsVerticalScrollIndicator={false}
      data={hhwork}
      numColumns={2}
      renderItem={({ item, index }) => {
        

        return (
          <View style={{flex:1,marginVertical:10}}>
            <View style={{alignItems:"center",justifyContent:"center"}}>
            <TouchableOpacity onPress={()=>navigation.navigate("hhWorkDetails",{hhWorkDetails:item})}  style={{ alignItems: "center" }}>
            <Image
                  source={{ uri: item.artPicture }}
                  style={styles.imageItem1}
              />
              <View style={{width:200,alignItems:"center",marginBottom:10}}>
              <Text numberOfLines={1}
                      style={{ width: windowWidth * 0.43, textAlign: "center" }}>
                {item.artTitle}
              </Text>
              </View>
            </TouchableOpacity>
            </View>
          </View>
        );
      }}
    
      keyExtractor={(item, index) => index.toString()}
    />
  </View>
   
   
  );
};
HhCollection.navigationOptions = ({ navigation }) => ({
  title: null,
  headerTitleAlign: "center",

  headerRight: null,
  headerLeft: ()=>(
   
     <TouchableOpacity onPress={() => navigation.goBack(null)} style={{ paddingRight: 15, paddingLeft: 15 }}>
                    <IconMaterial name='keyboard-arrow-left' size={32} color={'#000'} />
                </TouchableOpacity>
   
  ),
});
export default HhCollection;

const styles = StyleSheet.create({
  imageItem1: {
    height: 120,
    width: windowWidth * 0.45,
    borderRadius: 10,
    marginHorizontal:5
},
artTitle:{
  
}
});
