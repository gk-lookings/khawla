const ARTWORKS = "https://www.khawlafoundation.com/api/json_event_artworks.php";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Api from "../../../common/api";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import { FlatList } from "react-navigation";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const EventArtWorks = ({ navigation }) => {
  const { Id } = navigation.state.params;
  const lng = useSelector((state) => state.programmes.lang);
  const [artWorks, setArtWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [pageNumber, setPage] = useState(1);

  // useEffect(() => {
  //   setArtWorks([])
  // }, [lng]);
  useEffect(() => {
    setIsLoading(true);
    workDetails();
  }, [lng]);

  const onEndCall = () => {
    // if (true) return;
    if (!isLoading && !isLastPage) {
      workDetails();
    }
  };

  const workDetails = () => {
    console.log("page number", pageNumber);
    const eventId = Id;
    let language = lng == "ar" ? 1 : 2;

    Api(
      "get",
      ARTWORKS +
        "?eventId=" +
        eventId +
        `&language=${language}` +
        `&page=${pageNumber}`
    )
      .then((response) => {
        if (response) {
          if (response.items.length != 0) {
            setArtWorks((prev) => [...prev, ...response.items]);
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
  };

  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={artWorks}
        numColumns={2}
        renderItem={({ item, index }) => {
          return (
            <View style={{ flex: 1, marginVertical: 10 }}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EventArtWorkDetails", {
                      artWorkDetails: item,
                    })
                  }
                  style={{ alignItems: "center" }}
                >
                  <Image
                    source={{ uri: item.artPicture }}
                    style={styles.imageItem1}
                  />
                  <View
                    style={{
                      width: 200,
                      alignItems: "center",
                      // marginBottom: 10,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{ width: windowWidth * 0.43, textAlign: "center" }}
                    >
                      {item.artTitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={onEndCall}
      />
    </View>
  );
};
EventArtWorks.navigationOptions = ({ navigation }) => ({
  title: null,
  headerTitleAlign: "center",

  headerRight: null,
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => navigation.goBack(null)}
      style={{ paddingRight: 15, paddingLeft: 15 }}
    >
      <IconMaterial name="keyboard-arrow-left" size={32} color={"#000"} />
    </TouchableOpacity>
  ),
});
export default EventArtWorks;

const styles = StyleSheet.create({
  imageItem1: {
    height: 120,
    width: windowWidth * 0.45,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  artTitle: {},
});
