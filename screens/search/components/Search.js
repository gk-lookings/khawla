import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import {
  COLOR_SECONDARY,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from "../../../assets/color";
import {
  FONT_PRIMARY,
  FONT_MULI_REGULAR,
  FONT_MULI_BOLD,
} from "../../../assets/fonts";
import Api from "../../../common/api";
import { COLLECTION, SEARCH } from "../../../common/endpoints";
import i18n from "../../../i18n";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AutoHeightWebView from "react-native-autoheight-webview";
import Highlighter from "react-native-highlight-words";

const { height, width } = Dimensions.get("screen");
class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isList: true,
      searchResult: [],
      searchKeyword: "",
      isSearchLoading: false,
      page: 1,
      isLastPage: true,
    };
    this.renderSearch = this.renderSearch.bind(this);
    this.getData = this.getData.bind(this);
    this.footerView = this.footerView.bind(this);
    this.searchItemPage = this.searchItemPage.bind(this);
    console.log("state...page---------- :", this.state.page);
  }

  componentDidMount() {
    setTimeout(() => {
      this.textInputRef.focus();
    }, 100);
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang != this.props.lang) {
      this.getData();
    }
  }

  getData() {}

  searchItem(keyword) {
    console.log("keywwword", keyword);
    this.setState({ isSearchLoading: true, searchResult: [], page: 1 });
    var language = this.props.lang == "ar" ? 1 : 2;
    let data = new FormData();
    data.append("searchText", keyword);
    data.append("language", language);
    Api("post", SEARCH, data).then((response) => {
      console.log("response search", response);
      if (response) {
        this.setState({
          searchResult: response?.items,
          isSearchLoading: false,
          searchKeyword: keyword,
        });
      } else {
        this.setState({
          isSearchLoading: false,
          searchKeyword: keyword,
          searchResult: [],
        });
      }
    });
  }

  searchItemPage() {
    console.log("anterd!!!!!!!!!!!");
    var language = this.props.lang == "ar" ? 1 : 2;
    let page = this.state.page + 1;
    let data = new FormData();
    data.append("searchText", this.state.searchKeyword);
    data.append("language", language);
    data.append("page", page);
    Api("post", SEARCH, data).then((response) => {
      if (response) {
        let res = response.items;
        this.setState({
          searchResult: this.state?.searchResult?.concat(res),
          isSearchLoading: false,
          page: this.state.page + 1,
          isLastPage: response.isLastPage ? true : false,
        });
      } else {
        this.setState({
          isSearchLoading: false,
          searchResult: [],
        });
      }
    });
  }

  footerView() {
    if (!this.state.isLastPage) {
      return (
        <View style={{ margin: 20 }}>
          <ActivityIndicator size="small" color={PRIMARY_COLOR} />
        </View>
      );
    } else return null;
  }

  pageNav(item) {
    if (item.type == "article") {
      this.props.navigation.navigate("ArticleDetail", {
        item: item,
        searchKeyword: this.state.searchKeyword,
      });
    } else if (item.type == "course") {
      this.props.navigation.navigate("OnlineSection", {
        courses: item,
        searchKeyword: this.state.searchKeyword,
      });
    } else if (item.type == "lession") {
      this.props.navigation.navigate("OnlineDetail", {
        onlineData: item,
        searchKeyword: this.state.searchKeyword,
      });
    } else {
      this.props.navigation.navigate("ArtistDetail", {
        artists: item,
        searchKeyword: this.state.searchKeyword,
      });
    }
  }

  renderSearch({ item }) {
    return (
      <TouchableOpacity
        onPress={() => this.pageNav(item)}
        style={[
          styles.itemContainer,
          this.props.lang == "en" && { flexDirection: "row-reverse" },
        ]}
      >
        <View style={styles.itemView}>
          <Highlighter
            highlightStyle={{ backgroundColor: "yellow" }}
            style={[
              styles.eventTitle,
              this.props.lang == "en" && { textAlign: "left" },
            ]}
            searchWords={[this.state?.searchKeyword]}
            textToHighlight={item?.articleTitle}
            numberOfLines={1}
            autoEscape={true}
          />

          <Highlighter
            highlightStyle={{ backgroundColor: "yellow" }}
            style={[
              styles.subItem,
              this.props.lang == "en" && { textAlign: "left" },
            ]}
            searchWords={[this?.state?.searchKeyword]}
            textToHighlight={item?.shortDescription}
            numberOfLines={1}
            autoEscape={true}
          />
        </View>
        <Image
          source={{ uri: item.articlePicture }}
          style={styles.imageStyle}
        />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.searchBox}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Home")}
            style={styles.backButton}
          >
            <IconMaterial name="keyboard-arrow-left" size={32} color={"#000"} />
          </TouchableOpacity>
          <View style={styles.searchTextContainer}>
            <TextInput
              ref={(ref) => (this.textInputRef = ref)}
              autoFocus={true}
              style={styles.textInput}
              placeholder={i18n.t("search")}
              placeholderTextColor={SECONDARY_COLOR}
              keyboardType="web-search"
              onChangeText={(text) => this.searchItem(text)}
            />
          </View>
          <View style={styles.searchIcon}>
            <AntDesign name="search1" size={25} color="grey" />
          </View>
        </View>
        {this.state.isSearchLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={PRIMARY_COLOR} size="large" />
          </View>
        ) : (
          <View>
            {this.state.searchKeyword == "" ||
            this.state.searchResult.length == 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No Records Found!</Text>
              </View>
            ) : (
              <FlatList
                data={this.state.searchResult}
                renderItem={this.renderSearch}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 10 }}
                ListFooterComponent={this.footerView}
                onEndReached={this.searchItemPage}
                contentContainerStyle={{ paddingBottom: 50 }}
              />
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => ({
  lang: state.programmes.lang,
});
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  itemContainer: {
    height: 75,
    flexDirection: "row",
    width: width * 0.95,
    alignItems: "center",
    backgroundColor: "#fff",
    alignSelf: "center",
    marginBottom: 15,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
    borderRadius: 5,
  },
  arrow: {
    height: "100%",
    width: width * 0.08,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "right",
    fontFamily: FONT_MULI_BOLD,
  },
  subItem: {
    fontSize: 12,
    fontFamily: FONT_MULI_REGULAR,
    textAlign: "right",
    color: COLOR_SECONDARY,
    lineHeight: 20,
  },
  imageStyle: {
    height: 60,
    width: 60,
    borderRadius: 10,
    paddingRight: 20,
    paddingLeft: 20,
  },
  itemView: {
    height: "100%",
    width: "82%",
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  mainTitleText: {
    color: "#000",
    fontSize: 19,
    alignSelf: "center",
    fontFamily: FONT_MULI_BOLD,
  },
  header: {
    height: 40,
    flexDirection: "row",
  },
  showItem: {
    width: "80%",
    justifyContent: "center",
  },
  gridView: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  showingText: {
    fontFamily: FONT_MULI_BOLD,
    fontSize: 14,
    marginLeft: 15,
  },
  itemContainerGrid: {
    height: 185,
    width: width * 0.45,
    alignItems: "center",
    backgroundColor: "#fff",
    alignSelf: "center",
    marginLeft: width * 0.033,
    marginBottom: 30,
  },
  imageStyleGridView: {
    height: 150,
    width: "100%",
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  itemViewGrid: {
    height: 55,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyleGrid: {
    height: 150,
    width: "100%",
    alignSelf: "center",
    borderRadius: 15,
  },
  eventTitleGrid: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: FONT_MULI_BOLD,
    paddingLeft: 5,
    paddingRight: 5,
  },
  subItemGrid: {
    fontSize: 11,
    fontFamily: FONT_MULI_REGULAR,
    textAlign: "center",
    color: COLOR_SECONDARY,
    lineHeight: 16,
  },
  WebView: {
    width: "95%",
    marginTop: 20,
    backgroundColor: "#fff",
    margin: 10,
    alignSelf: "center",
  },
  searchBox: {
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingVertical: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  searchIcon: {
    backgroundColor: "#f5f5f5",
    width: "9%",
    justifyContent: "center",
    alignItems: "center",
    height: 35,
  },
  backButton: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
    height: 35,
  },
  searchTextContainer: {
    width: "78%",
    backgroundColor: "#f5f5f5",
    height: 35,
    justifyContent: "center",
  },
  textInput: {
    width: "100%",
    height: 35,
    paddingHorizontal: 10,
    fontFamily: FONT_MULI_REGULAR,
    paddingVertical: 0,
  },
  empty: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontFamily: FONT_MULI_REGULAR,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default connect(mapStateToProps)(App);
