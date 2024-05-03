import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    // Kullanıcıları Firestore'dan al
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firestore().collection("users").get();
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.log("Kullanıcıları alma hatası: ", error);
      }
    };

    // Mevcut kullanıcının adını Firestore'dan al
    const fetchUserName = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
            const userDocument = await firestore()
            .collection("users")
            .doc(currentUser.uid)
            .get();
          setUserName(userDocument.data()?.name || "");
        }
      } catch (error) {
        console.log("Kullanıcı adını alma hatası: ", error);
      }
    };

    // Ekrana odaklandığında kullanıcıları ve kullanıcı adını al
    if (isFocused) {
      fetchUsers();
      fetchUserName();
    }
  }, [isFocused]);

  const navigateToChat = (userId, userName) => {
    // Seçilen kullanıcının ID'si ve adı ile Sohbet ekranına git
    navigation.navigate("ChatScreen", {
      userId,
      userName,
    });
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      // Çıkış yapıldıktan sonra Giriş ekranına git
      navigation.navigate("Login");
    } catch (error) {
      console.log("Çıkış yapma hatası: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ana Sayfa</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Hoşgeldiniz, {userName}!</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutButton}>Çıkış</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.userList}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToChat(item.id, item.name)}
              style={styles.userItem}
            >
              <LinearGradient
                colors={["rgba(0,0,0,1)", "rgba(128,128,128,0)"]}
                style={styles.userItemGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.userNameText}>{item.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    position: "relative",
  },
  header: {
    flex: 1,
    backgroundColor: "#000",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "20%",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    color: "#fff",
  },
  logoutButton: {
    fontSize: 24,
    color: "#43A047",
    fontWeight: "bold",
  },
  userList: {
    flex: 1,
    backgroundColor: "#ADD8E6",
    padding: 5,
    borderTopRightRadius: 100,
    position: "absolute",
    top: "20%",
    left: 0,
    right: 0,
    bottom: 0,
  },
  userItem: {
    marginBottom: 5,
    borderRadius: 5,
    overflow: "hidden",
  },
  userItemGradient: {
    padding: 15,
    borderRadius: 30,
  },
  userNameText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
