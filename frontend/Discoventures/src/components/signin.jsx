import { StyleSheet, View, Text} from 'react-native';
import {useState} from 'react';
import {TextInput} from "@react-native-material/core";
import Button from './Button';

import colors from '../style/colors'
import fonts from '../style/fonts'

const BACKEND = "http://localhost:3000"

export default function Signin({ onConnect }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [errormsg, setErrormsg] = useState('');

    function onConnect(email, password){
        console.log(`${BACKEND}/login`);
        fetch(`${BACKEND}/login`,{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                setToken(data.token)
            } else {
                setErrormsg(data.message)
            }})
        .catch(error => alert("Server error"))
    }

  return (
    <View style={styles.container}>
      {/* <MyHeader label1={"Discoventures"} label2={"Connexion"} style={styles.header}></MyHeader> */}
      <Text style={[styles.baseText, fonts.text4xl]}>
      Connexion à mon compte
      </Text>
      <TextInput
        nativeID='emailInput'
        label="E-mail"
        variant="outlined"
        style={[styles.input]} 
        onChangeText={setEmail} 
        value={email} 
        color="grey"
      />
       <TextInput
        nativeID='passwordInput'
        label="Mot de passe"
        variant="outlined"
        style={styles.input} 
        secureTextEntry={true} 
        onChangeText={setPassword} 
        value={password}
        color="grey"
      />
        <Button
          nativeID='btnConnect'
          label='Se connecter'
          style={styles.button}
          onPress={()=>onConnect(email,password)}
        />
      <Text 
        style={styles.errorMsg}
        nativeID='errorMsg'
      >
        {errormsg}
      </Text>
      <Text>
      Pas encore de compte ? 
        <Text style={styles.innerText}> S'inscrire</Text>
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    padding:20,
    justifyContent:'center'
  },
  innerText: {
    color: colors.colorPrimary500.color
  },
  input : {
    height:40,
    marginTop: 12,
    marginBottom: 12
  },
  errorMsg:{
    color: "red"
  }
})
