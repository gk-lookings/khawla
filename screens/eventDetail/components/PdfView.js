import React from "react";
import { StyleSheet, Text, View, Dimensions,TouchableOpacity } from "react-native";
import Pdf from "react-native-pdf";
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
export default function PdfView ({ navigation }) {
  const { pdfData } = navigation.state?.params;
  const source = {
    uri: pdfData,
    cache: true,
  };
  return (
    <View style={styles.container}>
    {source &&
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        
        style={styles.pdf}
      />
      }
    </View>
  );
}
PdfView.navigationOptions = ({ navigation }) => ({
  title: "",
  headerTitleAlign: "center",

  headerLeft: () => (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack(null)}>
      <IconMaterial name='keyboard-arrow-left' size={32} color={'#000'} />
      </TouchableOpacity>
    </View>
  ),
  headerRightt: null,
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
