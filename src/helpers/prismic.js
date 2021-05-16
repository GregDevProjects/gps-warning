import Prismic from "@prismicio/client";
import Config from "react-native-config";

const accessToken = Config.PRISMIC_API_KEY;
const apiEndpoint = Config.PRISMIC_API_ENDPOINT;

const Client = Prismic.client(apiEndpoint, { accessToken });

const fetchData = async () => {
  const response = await Client.query(
    Prismic.Predicates.at("document.type", "point_of_interest")
  );

  if (response) {
    return response.results;
  }
};

const parseData = (pointsOfInterestPrismic) => {
  return pointsOfInterestPrismic.map((item) => {
    const dangerousLocationSlices = item.data.body.filter((item) => {
      return item.slice_type === "non_repeatabletest";
    });

    const dangerousLocationsParsed = dangerousLocationSlices.map((slice) => {
      return {
        key: slice.primary.name1, //TODO: GENERATE UNIQUE KEY
        name: slice.primary.name1,
        description: slice.primary.description1[0].text,
        radius: slice.primary.radius,
        latitude: slice.primary.geopoint.latitude,
        longitude: slice.primary.geopoint.longitude,
      };
    });

    return {
      key: item.id,
      image: item.data.image.url,
      name: item.data.name,
      description: item.data.description[0].text,
      geoPoint: item.data.location,
      dangerousLocations: dangerousLocationsParsed,
    };
  });
};

const getAllPointsOfInterest = async () => {
  const data = await fetchData();
  return parseData(data);
};

export { getAllPointsOfInterest };
