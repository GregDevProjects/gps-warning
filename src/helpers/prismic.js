import Prismic from "@prismicio/client";
import Config from "react-native-config";

const accessToken = Config.PRISMIC_API_KEY;
const apiEndpoint = Config.PRISMIC_API_ENDPOINT;

const Client = Prismic.client(apiEndpoint, { accessToken });

const fetchAllPointsOfInterest = async () => {
  const response = await Client.query(
    Prismic.Predicates.at("document.type", "point_of_interest")
  );

  if (response) {
    return response.results;
  }
  return [];
};

const fetchPointOfInterestsByFilter = async (type) => {
  const response = await Client.query(
    Prismic.Predicates.any("my.point_of_interest.type", [type])
  );

  // at(document.point_of_interest.type, "Hiking");

  if (response) {
    return response.results;
  }
  return [];
};

const fetchAllFilters = async () => {
  const response = await Client.query(
    Prismic.Predicates.at("document.type", "filtertype")
  );

  if (response) {
    return response.results;
  }
  return [];
};

const parseAllFilters = async (data) => {
  return data.map((item) => {
    // console.log({ name: item.data.filter_name, id: item.id });
    return { name: item.data.filter_name, id: item.id };
  });
};

const parseAllPointsOfInterest = (pointsOfInterestPrismic) => {
  return pointsOfInterestPrismic.map((item) => {
    const dangerousLocationSlices = item.data.body.filter((item) => {
      return item.slice_type === "non_repeatabletest";
    });

    const filtersParsed = item.data.body1.map((item) => {
      return { name: item.primary.filter.slug, id: item.primary.filter.id };
    });

    const dangerousLocationsParsed = dangerousLocationSlices.map((slice) => {
      return {
        key: slice.primary.name1, //TODO: GENERATE UNIQUE KEY
        name: slice.primary.name1,
        description: slice.primary.description1[0].text,
        radius: slice.primary.radius,
        latitude: slice.primary.geopoint.latitude,
        longitude: slice.primary.geopoint.longitude,
        image: slice.primary.dangerous_image.url,
      };
    });

    return {
      key: item.id,
      image: item.data.image.url,
      name: item.data.name,
      description: item.data.description[0].text,
      geoPoint: item.data.geopoint,
      dangerousLocations: dangerousLocationsParsed,
      filters: filtersParsed,
    };
  });
};

const getAllPointsOfInterest = async () => {
  const data = await fetchAllPointsOfInterest();
  return parseAllPointsOfInterest(data);
};

const getPointsOfInterestByFilter = async (filterId) => {
  const data = await fetchPointOfInterestsByFilter(filterId);
  // console.log(data);
  return parseAllPointsOfInterest(data);
};

const getAllFilters = async () => {
  const data = await fetchAllFilters();
  return parseAllFilters(data);
};

export { getAllPointsOfInterest, getAllFilters, getPointsOfInterestByFilter };
