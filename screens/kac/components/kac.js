import { StyleSheet, Text, View, Image,Dimensions,Linking } from "react-native";
import React from "react";
import images from "../../../assets/images/";
import { TouchableOpacity } from "react-native";
import { PRIMARY_COLOR } from "../../../assets/color";
import { FONT_BOLD, FONT_MULI_BOLD, FONT_PRIMARY, FONT_SEMI_BOLD } from "../../../assets/fonts";
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
const { height, width } = Dimensions.get('screen')

const kac = () => {

  return (
    <View style={styles.container}>
      
      <View style={styles.subContainer}>
        <Image source={images.online_store} style={styles.picture} />
        <Text style={styles.title}>Online Store</Text>
        <TouchableOpacity style={styles.button} onPress={() => { Linking.openURL('https://spatial.io/s/KAC-Online-Store-62e0f60d1c41e700012e6ea6?share=7827655417177137002') }}>
            <Text style={styles.buttonText}>Click Here</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.subContainer,{marginLeft:15}]}>
        <Image source={images.peace} style={styles.picture} />
        <Text style={styles.title}>Peace and Love</Text>
        <TouchableOpacity style={styles.button} onPress={() => { Linking.openURL('https://spatial.io/s/Peace-and-Love-Artworks-of-HH-Sheikha-Khawla-Bint-Ahmed-Al-Suwaidi-62e134f21c41e700012e6ffb?share=2977071221589419262') }}>
            <Text style={styles.buttonText}>Click Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

kac['navigationOptions'] = ({ navigation }) => {
    return {
        headerTitle: <Text style={styles.mainTitleText}>KAC in MetaVerse</Text>,
        headerTitleStyle: {
            flex: 1,
            alignSelf: 'center',
            textAlign: 'center',
            color: 'black',
            fontSize: 23,
            fontWeight: 'bold',
            fontFamily: FONT_PRIMARY,
        },

        headerRight: (
            <TouchableOpacity onPress={()=>navigation.navigate('Home')} style={{ paddingRight: 15, paddingLeft: 15 }}>
                <AntDesign name='closecircleo' size={20} color={'#000'} style={{}} />
            </TouchableOpacity>),
        headerLeft: (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ paddingRight: 15, paddingLeft: 15 }}>
                <IconMaterial name='sort' size={30} color='black' />
            </TouchableOpacity>
        )
    }
}

export default kac;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flexDirection:"row"
  },
  subContainer: {
    padding:20,
    width:width/2.2,
    alignItems:"center",
    justifyContent:"center",
    borderWidth:0.5,
    borderRadius:10,
    shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
  },
  picture: {
    height: height/5,
    width: width/2.5,
    borderRadius:10
  },
  button:{
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:PRIMARY_COLOR,
    padding:5,
    paddingHorizontal:15,
    borderRadius:20
  },
  buttonText:{
    color: '#fff',
        fontSize: 16,
        fontFamily: FONT_PRIMARY
  },
  title:{
    fontSize:16,
    marginVertical:10,
    color:PRIMARY_COLOR,
    fontFamily:FONT_BOLD
  },
  mainTitleText: {
    color: '#000',
    fontSize: 19,
    alignSelf: 'center',
    fontFamily: FONT_MULI_BOLD
},
});
