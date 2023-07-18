import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


export default function HomeScreen() {
  const [newsData, setNewsData] = useState([]);
  const [currentPageArr, setCurrentPageArr] = useState([]); // Array to hold current page state for each item
  const headerHeight = 0; // Set the height of your header component

  const insets = useSafeAreaInsets();
  const headerHeight1 = insets.top;
  console.log("headerHeight1",headerHeight1)


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:5000/news")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNewsData(sortedData);
        setCurrentPageArr(new Array(sortedData.length).fill(0)); // Initialize the currentPageArr with 0 for each item
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const descriptionRefs = useRef([]); // Ref array to hold refs for each description ScrollView
  const pageWidth = Dimensions.get("window").width;
  const pageHeight = Dimensions.get("window").height;
  console.log(" pageHeight=" + pageHeight)
  const pageSize = 800;

  const { height } = Dimensions.get("window");
  console.log(" height===" + hp(100))

  const styles = StyleSheet.create({
    newsContainer: {
      height: hp(100) -27- headerHeight1 ,
      flex: 1,
      backgroundColor: "#fff",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: height / 3,
      resizeMode: "cover",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      paddingHorizontal: 10,
    },
    descriptionContainer: {
      flexGrow: 1,
      paddingHorizontal: 10, // Add horizontal padding to align description with title
    },
    description: {
      fontSize: 16,
      textAlign: "justify",
      marginTop: 10, // Add margin top to create space between description and dots
    },
    dotContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: "black",
    },
    inactiveDot: {
      backgroundColor: "lightgray",
    },
    tagContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginLeft:20,
      alignSelf: "flex-start", // Align the container to the left
      marginTop: 10, // Add margin bottom to create space between tag and image
    },
    tag: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#F4BB41",
      marginRight: 4,
      marginBottom: 4, // Add margin bottom to create space between tag and title
    },
    date: {
      fontSize: 14,
      color: "gray",
    },
  });

  const handleScroll = (event, index) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / pageWidth);
    setCurrentPageArr((prevState) => {
      const newState = [...prevState];
      newState[index] = page; // Update the currentPage state for the corresponding item
      return newState;
    });
  };

  return (
    <ScrollView pagingEnabled>
      {newsData.map((item, index) => {
        const pages = Math.ceil(item.description.length / pageSize);
        const textArray = Array.from({ length: pages }, (_, pageIndex) =>
          item.description.slice(
            pageIndex * pageSize,
            (pageIndex + 1) * pageSize
          )
        );

        const formattedDate = formatNewsDate(item.createdAt);

        return (
          <View key={index} style={styles.newsContainer}>
            <View style={[styles.container, { marginTop: headerHeight }]}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.tagContainer}>
                <Text style={styles.tag}>
                  {item.tag}
                  {" | "}
                </Text>
                <Text style={styles.date}>{formattedDate}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <View style={{ flex: 1 }}>
                <ScrollView
                  ref={(ref) => (descriptionRefs.current[index] = ref)}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={(event) => handleScroll(event, index)} // Pass the index to handleScroll
                  scrollEventThrottle={16}
                >
                  {textArray.map((text, textIndex) => (
                    <View
                      key={textIndex}
                      style={{
                        width: pageWidth,
                        height: pageHeight,
                        paddingHorizontal: 20,
                        paddingVertical: 20,
                      }}
                    >
                      <Text style={{ fontSize: 16, textAlign: "justify" }}>
                        {text}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  {Array.from({ length: pages }, (_, pageIndex) => (
                    <View
                      key={pageIndex}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 5,
                        backgroundColor:
                          pageIndex === currentPageArr[index]
                            ? "#F4BB41"
                            : "black",
                      }}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const formatNewsDate = (date) => {
  const currentDate = new Date();
  const newsDate = new Date(date);
  const formattedDateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  if (isNaN(newsDate.getTime())) {
    return "";
  }

  if (isSameDay(currentDate, newsDate)) {
    return "Today";
  } else if (isSameDay(currentDate, subtractDays(newsDate, 1))) {
    return "Yesterday";
  } else {
    return newsDate.toLocaleDateString(undefined, formattedDateOptions);
  }
};

const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const subtractDays = (date, days) => {
  const result = new Date(date);
  result.setDate(date.getDate() - days);
  return result;
};





