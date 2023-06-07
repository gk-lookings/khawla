
import { StyleSheet, Text, View,TouchableOpacity,Image,Dimensions,ScrollView ,SafeAreaView, TextInput,ActivityIndicator} from 'react-native'
import React, { useState,useEffect,useRef } from "react";
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Api from '../../../common/api'
import i18n from '../../../i18n'
import Modal from "react-native-modal"
import AntDesign from 'react-native-vector-icons/AntDesign'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_BOLD, FONT_MULI_EXTRABOLD, FONT_MEDIUM, FONT_MULI_REGULAR } from '../../../assets/fonts'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import {
    TextField,
    formatText,
    onSubmit,
    OutlinedTextField,
  } from "react-native-material-textfield";
const { height, width } = Dimensions.get('screen')
export default function hhWorkDetails({navigation}) {
    const { hhWorkDetails} = navigation.state.params;
   const [isVisiblePrice, setIsVisiblePrice]=useState(false)
   const [modelVisible, setModelVisible] = useState(false);
   const [validation, setValidate] = useState("");
   const [invalidEmail, setInvalidEmail] = useState(false);
   const [sendLoader, setSendLoader] = useState(false);
   const [success, setSuccess] = useState(false);
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [message, setMessage] = useState("");
   let nameRef = useRef();
   let emailRef = useRef();
   let phoneRef = useRef();
   let messageRef = useRef();
   const onSubmit = () => {
    
    setSendLoader(true);
    let formData = new FormData();
    formData.append("action", "contact");
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("feedback", message);
    formData.append('artworkId', hhWorkDetails.artId);
    Api("post", 'https://www.khawlafoundation.com/api/contact-priceRequest.php', formData).then((response) => {
      if (response.status === "success") {
        setSendLoader(false);
        setSuccess(true);
        nameRef.current.clear();
        emailRef.current.clear();
        phoneRef.current.clear();
        messageRef.current.clear();
        setInvalidEmail(false);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);

       
      } else {
        setSendLoader(false);
      }
    });
  };
  function validate(text, type) {
    let alph = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (type == "email") {
      if (alph.test(text)) {
      
        setInvalidEmail(false);
        setEmail(text);
      } else {
       
        setInvalidEmail(true);
        setEmail(text);
      }
    }
  }
  function onSucces() {
    onSubmit();
  }
  function isEmptyTextField() {
    if (name == "") {
      setValidate("Name cannot be empty");
      return 0;
    }
    if (email == "") {
      setValidate("Email cannot be empty");
      return 0;
    }
    if (phone == "") {
      setValidate("Phone number cannot be empty");
      return 0;
    }
    if (invalidEmail) {
      setValidate("Enter valid Email");
      return 0;
    }
    if (message == "") {
      setValidate("Message cannot be empty");
      return 0;
    } else {
      onSucces();
    }
  }

  const EnquiryForm = () => {
    return (
      <View style={styles.contactConatainer}>
        <TouchableOpacity onPress={() =>setModelVisible(false) }>
                                        <AntDesign name="closecircleo" size={20} color="#000" style={{ alignSelf: 'flex-end', marginTop: 5 }} />
                                    </TouchableOpacity>
                                    <Text style={styles.mainHeading}>{i18n.t('price_request')}</Text>
        <View style={{marginHorizontal:10}}>
          <TextField
            label={i18n.t("Name")}
            keyboardType="default"
            value={name}
            tintColor={PRIMARY_COLOR}
            containerStyle={styles.textInput}
            lineWidth={1}
            autoCapitalize="none"
            onFocus={() => setValidate("")}
            onChangeText={(text) => setName(text)}
            ref={nameRef}
          />
          <TextField
            label={i18n.t("Email")}
            keyboardType="default"
            formatText={formatText}
            onSubmitEditing={onSubmit}
            tintColor={PRIMARY_COLOR}
            lineWidth={1}
            autoCapitalize="none"
            onFocus={() => setValidate("")}
            onChangeText={(text) => validate(text, "email")}
            ref={emailRef}
          />

          {invalidEmail && (
            <Text
              style={{
                textAlign: "left",
                color: "red",
                // fontFamily: FONT_PRIMARY3,
                fontSize: 12,
              }}
            >
              Please enter a valid email
            </Text>
          )}
          <TextField
            label={i18n.t("Phone")}
            keyboardType="default"
            formatText={formatText}
            onSubmitEditing={onSubmit}
            tintColor={PRIMARY_COLOR}
            lineWidth={1}
            autoCapitalize="none"
            onFocus={() => setValidate("")}
            onChangeText={(text) => setPhone(text)}
            ref={phoneRef}
            value={phone}
            
          />
          {/* <TextField
            label={i18n.t("Message")}
            keyboardType="default"
            formatText={formatText}
            onSubmitEditing={onSubmit}
            tintColor={PRIMARY_COLOR}
            lineWidth={1}
            autoCapitalize="none"
            onFocus={() => setValidate("")}
            onChangeText={(text) => setMessage(text.trim())}
            ref={messageRef}
          /> */}
            <TextInput
                                            style={[{ height: height * .15, borderWidth: .8, borderColor: 'grey',marginVertical:10}]}
                                            placeholder="Feedback"
                                            multiline={true}
                                            onChangeText={(text) => setMessage(text.trim())}
                                            textAlignVertical='top'
                                            ref={messageRef}
                                        />
          {validation != "" && (
            <Text
              style={{
                textAlign: "left",
                color: "red",
                // fontFamily: FONT_PRIMARY3,
                fontSize: 12,
              }}
            >
              {validation}
            </Text>
          )}
             {/* <TouchableOpacity onPress={() => this.setState({ isSend: true }, () => this.onSend())} style={styles.send}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{i18n.t("Send")}</Text>
                                        {this.state.isSend && this.state.validate == null &&
                                            <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 5 }} />
                                        }
                                    </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.send}
            onPress={() => isEmptyTextField()}
          >
            <Text style={{color: '#fff', fontWeight: 'bold',textAlign:"center" }}>
            {i18n.t("Send")}
            </Text>
            {sendLoader &&
           
              <ActivityIndicator
                size="small"
                color="#fff" 
                style={{ marginLeft: 5 }}
              />
            }
          </TouchableOpacity>

          {success && (
            <Text style={{ color: "green" }}>
              {" "}
              Your message have been send successfully{" "}
            </Text>
          )}
        </View>
      </View>
    );
  };
    const transform = (data) => {
      if (data) {
        return data.replace(/<[^>]+>|\r\n\t|&idquo;|&nbsp;/g, "");
        
      }
      return data;
    };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <Image
                    source={{ uri: hhWorkDetails.artPicture }}
                    style={styles.imageItem1}
                />
                <Text style={styles.artTitle}>{hhWorkDetails.artTitle}</Text>
                <Text>{transform(hhWorkDetails.artDescription)}</Text>
                <View style={styles.qrContainer}>
                                    <Image style={styles.qrImage} source={{ uri: hhWorkDetails.qrPicture }} />
                                </View>
                </ScrollView>
                {hhWorkDetails?.isForSale==0?(
            // onPress={() => setModelVisible(true)}
        
           <TouchableOpacity  style={styles.priceContainer} onPress={() => setModelVisible(true)}>
                                <Text style={styles.priceText}>{i18n.t('price_request')}</Text>
                            </TouchableOpacity>):null}

          <View style={{ justifyContent: "center", alignItems: "center",backgroundColor:"green" }}>
          <Modal
            isVisible={modelVisible}
            hasBackdrop={true}
            backdropOpacity={0.7}
            hideModalContentWhileAnimating={true}
            animationIn="zoomIn"
            animationOut="zoomOut"
            useNativeDriver={true}
            onBackButtonPress={() => setModelVisible(false)}
            onBackdropPress={() => setModelVisible(false)}
            backdropTransitionOutTiming={0}
            style={styles.bottomModal1}
            backdropColor="#000"
          >
           
            {EnquiryForm()}
           
          </Modal>
        </View>               
                            
    </SafeAreaView>
  )
}
hhWorkDetails.navigationOptions = ({ navigation }) => ({
  title: null,
  headerTitleAlign: "center",

  headerRight: null,
  headerLeft: ()=>(
   
     <TouchableOpacity onPress={() => navigation.goBack(null)} style={{ paddingRight: 15, paddingLeft: 15 }}>
                    <IconMaterial name='keyboard-arrow-left' size={32} color={'#000'} />
                </TouchableOpacity>
   
  ),
});

const styles = StyleSheet.create({
  container:{
    flex:1,
    margin:10
  },
  imageItem1:{
    width:408,
    height:250,
    borderRadius:5
  },
  artTitle:{
    fontSize: 20,
        textAlign: 'left',
        
        color: '#ad6183',
        fontFamily: FONT_MULI_BOLD
  },
  artDescription:{
    textAlign:"justify"
  },

  priceText: {
    fontSize: 16,
    fontFamily: FONT_MULI_BOLD,
    color: '#fff'
},
priceContainer: {
    backgroundColor: 'green',
    width: width - 100,
    alignSelf: 'center',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    position: 'absolute',
    bottom: 20,
    shadowColor: '#000000',
    shadowOffset: {
        width: 2,
        height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
    marginBottom:50
},
contactConatainer: {
    backgroundColor: '#fff',
    margin: 8,
    shadowColor: '#000000',
    shadowOffset: {
        width: 2,
        height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
    
},
mainHeading: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 10,
    fontFamily: FONT_MULI_EXTRABOLD
},
send: {
    height: height * .05,
    width: '28%',
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 10,
    flexDirection: 'row'
},
qrContainer:{
    marginVertical: 30,
    alignSelf:'center',
    paddingBottom:100
  },
  qrImage:{
    width: width/1.2,
    height: width/1.2
  }
})