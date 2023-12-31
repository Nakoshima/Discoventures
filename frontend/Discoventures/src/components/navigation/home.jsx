import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import colors from "../../style/colors";
import DeleteRoutes from "../../views/admin/routes/DeleteRoutes";
import ProfileStack from "./ProfileStack";
import DecouvertesStack from "./DecouvertesStack";
import GenerateParcoursStack from "./GenerateParcoursStack";

const Tab = createBottomTabNavigator();

// Page principale de l'application et qui permet de différencier un admin d'un utilisateur
// Met en place les flots de navigation de React Navigation
// Affiche la bottom bar
export default function Home() {
  const isAdmin = useSelector((state) => state.user.isAdmin);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Génération") {
            iconName = focused ? "refresh" : "refresh";
          } else if (route.name === "Découvertes") {
            iconName = focused ? "apple-safari" : "apple-safari";
          } else if (route.name === "Profile") {
            iconName = focused ? "account-circle" : "account-circle";
          } else if (route.name === "Parcours") {
            iconName = focused ? "map" : "map";
          }

          // You can return any component that you like here!
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: colors.colorPrimary500.color,
        tabBarInactiveTintColor: colors.colorNeutral400.color,
      })}
    >
      {isAdmin == false ? (
        <>
          <Tab.Screen name="Génération" component={GenerateParcoursStack} />
          <Tab.Screen
            name="Découvertes"
            component={DecouvertesStack}
            options={{ tabBarTestID: "tabDecouvertes" }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStack}
            options={{ tabBarTestID: "tabProfile" }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Parcours"
            component={DeleteRoutes}
            options={{ tabBarTestID: "tabAdminParcours" }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
