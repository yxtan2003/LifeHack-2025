import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { auth, db } from "../firebase"; // ✅ import auth

export default function Index() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Reference auth to initialize and prevent unregistered component error
    console.log("Current user:", auth.currentUser);

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "testData"));
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        🔥 Firestore Test Data
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2196f3" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 16,
                marginBottom: 10,
                backgroundColor: "#f1f1f1",
                borderRadius: 10,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{item.title || "Untitled"}</Text>
              <Text>{item.description || "No description available"}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
