import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { Constants } from "expo";
import { Ionicons } from "@expo/vector-icons";
import MovieItem from "./components/MovieItem";

const isFavorite = (myFavorites, item) =>
  myFavorites.filter(({ id }) => id === item.id).length >= 1;

const filterFavorites = (myFavorites, movies) =>
  movies.filter(movie => {
    return isFavorite(myFavorites, movie);
  });

export default class App extends React.Component {
  state = {
    movies: [],
    myFavorites: [],
    showOnlyFavorites: false
  };

  componentDidMount() {
    this.fetchMovies();
  }

  fetchMovies = async () => {
    const currentYear = new Date().getFullYear();
    const url = `https://api.themoviedb.org/3/discover/movie?primary_release_year=${currentYear}&page=1&include_video=false&include_adult=false&sort_by=popularity.desc&language=pt-BR&api_key=95af1e4cfe2cfa63a452d0a8545ff5a2`;
    const movieCall = await fetch(url);
    const response = await movieCall.json();

    const movies = response.results;

    const myFavoritesData = await AsyncStorage.getItem("@MovieApp:myFavorites");

    this.setState({
      movies,
      showOnlyFavorites: false,
      myFavorites: JSON.parse(myFavoritesData) || []
    });
  };

  handleShowAllMovies = () => {
    this.fetchMovies();
  };

  handleMyFavorites = () => {
    this.setState(currentState => {
      return {
        movies: filterFavorites(currentState.myFavorites, currentState.movies),
        showOnlyFavorites: true
      };
    });
  };

  handleToggleFavorite = item => {
    this.setState(
      currentState => {
        if (isFavorite(currentState.myFavorites, item)) {
          const myFavorites = currentState.myFavorites.filter(
            ({ id }) => id !== item.id
          );

          if (currentState.showOnlyFavorites) {
            return {
              myFavorites,
              movies: filterFavorites(myFavorites, currentState.movies)
            };
          }

          return {
            myFavorites
          };
        }
        return {
          myFavorites: currentState.myFavorites.concat([{ id: item.id }])
        };
      },
      () => {
        AsyncStorage.setItem(
          "@MovieApp:myFavorites",
          JSON.stringify(this.state.myFavorites)
        );
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this.handleShowAllMovies}>
            <Text style={styles.headerTitle}>Filmes do Ano</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handleMyFavorites}
            style={styles.myFavoriteButton}
          >
            <Text style={styles.myFavoriteButtonText}>Meus Favoritos</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.movies}
          numColumns={3}
          renderItem={({ item }) => {
            return (
              <MovieItem
                item={item}
                isFavorite={isFavorite(this.state.myFavorites, item)}
                onToggleFavorite={this.handleToggleFavorite}
              />
            );
          }}
          keyExtractor={item => item.id}
          extraData={this.state.myFavorites}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight + 5,
    paddingHorizontal: 6,
    paddingBottom: 10,
    backgroundColor: "#eee"
  },
  headerTitle: {
    fontFamily: "Avenir",
    fontSize: 18
  },
  myFavoriteButton: {},
  myFavoriteButtonText: {}
});
