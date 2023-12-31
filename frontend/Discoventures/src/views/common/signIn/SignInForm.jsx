import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { TextInput } from "@react-native-material/core";

import Button from "../../../components/uikit/Button";
import colors from "../../../style/colors";
import fonts from "../../../style/fonts";

import { useDispatch } from "react-redux";
import {
  setUserToken,
  setUserId,
  setIsAdmin,
  setUserEmail,
  setUsername,
} from "../../../app/slices/userSlice";
import jwt_decode from "jwt-decode";

const BACKEND = "https://discoventures.osc-fr1.scalingo.io";

// Page de connexion
export default function Signin(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errormsg, setErrormsg] = React.useState("");

  const dispatch = useDispatch();

  function onConnect(email, password) {
    fetch(`${BACKEND}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          setErrormsg("");

          const userData = jwt_decode(data.token);

          dispatch(setUserToken(data.token));
          dispatch(setUserId(userData.id));
          dispatch(setIsAdmin(userData.isadmin));

          fetch(`${BACKEND}/users/${userData.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": data.token,
            },
          })
            .then((response) => response.json())
            .then((userData) => {
              dispatch(setUserEmail(userData.data.email));
              dispatch(setUsername(userData.data.username));
            })
            .catch((error) => alert("Server error" + error));

          props.navigation.navigate("Home");
        } else {
          setErrormsg(data.message);
        }
      })
      .catch((error) => alert("Server error" + error));
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.baseText, fonts.text4xl]}>
        Connexion à mon compte
      </Text>
      <TextInput
        nativeID="emailInputSignIn"
        label="E-mail"
        variant="outlined"
        style={[styles.input]}
        onChangeText={setEmail}
        value={email}
        color="grey"
      />
      <TextInput
        nativeID="passwordInputSignIn"
        label="Mot de passe"
        variant="outlined"
        style={styles.input}
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
        color="grey"
      />
      <Button
        nativeID="btnConnectSignIn"
        label="Se connecter"
        style={styles.button}
        onPress={() => onConnect(email, password)}
      />
      <Text style={styles.errorMsg} nativeID="errorMsgSignIn">
        {errormsg}
      </Text>
      <Text>
        Pas encore de compte ?
        <Text
          style={styles.innerText}
          onPress={() => props.navigation.navigate("SignUp")}
          nativeID="signUpLink"
        >
          {" "}
          S'inscrire
        </Text>
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
    justifyContent: "center",
  },
  innerText: {
    color: colors.colorPrimary500.color,
  },
  input: {
    height: 40,
    marginTop: 12,
    marginBottom: 12,
  },
  errorMsg: {
    color: "red",
  },
});
