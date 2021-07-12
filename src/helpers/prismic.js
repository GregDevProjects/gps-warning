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

    const dangerousLocationsParsed = dangerousLocationSlices.map((slice) => {
      let polygon = null;
      if (slice.primary.dangerous_location_polygon[0]) {
        const rawText = slice.primary.dangerous_location_polygon[0].text;

        if (rawText) {
          const parsed = JSON.parse(rawText.replace(`\\`, "").trim());

          polygon = parsed.map((item) => {
            return {
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
            };
          });
        }
      }

      return {
        key: slice.primary.name1, //TODO: GENERATE UNIQUE KEY

        name: slice.primary.name1,
        description: slice.primary.description1[0].text,
        radius: slice.primary.radius,
        image: slice.primary.dangerous_image.url,
        polygon: polygon,
        notified: false,
      };
    });

    return {
      key: item.id,
      image: item.data.image.url,
      name: item.data.name,
      description: item.data.description[0].text,
      geoPoint: item.data.geopoint,
      phone: item.data.phone,
      website: item.data.website.url,
      dangerousLocations: dangerousLocationsParsed,
      filterId: item.data.type.id,
    };
  });
};

const getAllPointsOfInterest = async () => {
  const data = await fetchAllPointsOfInterest();

  // console.log(data[3].data.type);

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
