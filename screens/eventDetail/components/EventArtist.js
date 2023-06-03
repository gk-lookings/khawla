
const ARTISTS = "https://www.khawlafoundation.com/api/json_event_artists?eventId=17";
import { StyleSheet, Text, TouchableOpacity, View,Image,Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Api from "../../../common/api";
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { FlatList } from "react-navigation";
import ArtistDetail from "../../artistDetail";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const EventArtist = ({ navigation }) => {
  const { Id } = navigation.state.params;
  const lng = useSelector((state) => state.programmes.lang);
  const [artist, setArtist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ isLastPage, setIsLastPage ] = useState(false);
  const [pageNumber, setPage] = useState(1);
 
  

  useEffect(() => {
      setIsLoading(true);
      workDetails();
  }, [lng]);

  const onEndCall = () => {
      
      if ( !isLoading && !isLastPage ){
          
          workDetails();
      }
  }

  const  workDetails = () => {
    var language = lng == "ar" ? 1 : 2;
    const eventId = Id;
    console.log("event id",eventId )
    // Api(
    //   "get",ARTISTS +
    //   `&eventId=${eventId}`+
    //   `&language=${language}`
    // )
    Api('get', `https://www.khawlafoundation.com/api/json_event_artists?+eventId=${eventId}&language=${language}&page=${pageNumber}`)
    .then((response) => {
      if (response) {
        if (response.items.length != 0) {
            setArtist((prev) => [...prev, ...response.items]);
            setPage(pageNumber + 1);
            setIsLastPage(response.isLastPage);
            setIsLoading(false);
            
        } else {
          setIsLoading(false);
          setIsLastPage(true);
        }
      }
    })
    .catch((err) => setIsLoading(false));
    // Api('get', `https://www.khawlafoundation.com/api/json_event_artists?+eventId=${eventId}&language=${language}`)
    // .then((response) => {
    //     if (response.items.length > 0 && !response.isLastPage) {
    //         setArtist(response.items);
    //         setIsLastPage(response.isLastPage);
    //         setIsLoading(false);
    //         console.log("response artist",response)
    //     } else {
    //         setIsLoading(false);
    //     }
        
    // });
  }

  return (
    <View>
     <FlatList
     showsVerticalScrollIndicator={false}
     data={artist}
     numColumns={2}
     renderItem={({ item, index }) => {
       
       return (
         <View style={{flex:1,marginVertical:10}}>
           <View style={{alignItems:"center",justifyContent:"center"}}>
           <TouchableOpacity  style={{alignItems:"center"}} onPress={()=>navigation.navigate("ArtistDetail", {artistId: item.artistId})}>
           <Image
                 source={{ uri: item.picture }}
                 style={styles.imageItem1}
             />
             <View style={{width:200,alignItems:"center"}}>
             <Text>
               {item.artistTitle}
             </Text>
             </View>
           </TouchableOpacity>
           </View>
         </View>
       );
     }}
     onEndReachedThreshold={0.5}
     onEndReached={onEndCall}
     keyExtractor={(item, index) => index.toString()}
   />
        
         
            </View>
   
   
  );
};
EventArtist.navigationOptions = ({ navigation }) => ({
  title: null,
  headerTitleAlign: "center",

  headerRight: null,
  headerLeft: ()=>(
   
     <TouchableOpacity onPress={() => navigation.goBack(null)} style={{ paddingRight: 15, paddingLeft: 15 }}>
                    <IconMaterial name='keyboard-arrow-left' size={32} color={'#000'} />
                </TouchableOpacity>
   
  ),
});
export default EventArtist;

const styles = StyleSheet.create({
  imageItem1: {
    height: 120,
    width: 185,
    borderRadius: 10,
    marginHorizontal:5,
    width: windowWidth*0.45,
},
artTitle:{
  
}
});
