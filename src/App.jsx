import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import Header from "./components/Header";
import List from "./components/List";
import Map from "./components/Map";
import { getPlacesData } from "./services/index";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(
    () => {
      if (bounds.sw && bounds.ne) {
        setIsLoading(true);
        getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
          setPlaces(
            data?.filter((place) => place.name && place.num_reviews > 0)
          );
          setFilteredPlaces([]);
          setIsLoading(false);
          setRating("");
        });
      }
    },
    [type, bounds]
    // [coordinates, bounds]
  );

  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) >= rating);

    console.log(filtered);
    setFilteredPlaces(filtered);
  }, [rating]);

  return (
    <>
      <CssBaseline>
        <Header setCoordinates={setCoordinates} />
        <Grid container spacing={3} style={{ width: "100%" }}>
          <Grid item xs={12} md={4}>
            <List
              places={filteredPlaces.length ? filteredPlaces : places}
              childClicked={childClicked}
              isLoading={isLoading}
              type={type}
              setType={setType}
              rating={rating}
              setRating={setRating}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Map
              setBounds={setBounds}
              setCoordinates={setCoordinates}
              coordinates={coordinates}
              places={filteredPlaces.length ? filteredPlaces : places}
              setChildClicked={setChildClicked}
            />
          </Grid>
        </Grid>
      </CssBaseline>
    </>
  );
};

export default App;
