
const { getJson } = require("serpapi");
require('dotenv').config();

const fetchHotelsFromSerpAPI = async (search, checkIn, checkOut, numAdults, budget) => {
  const location = search || "Mumbai";
  const budgetMin = Math.floor(budget * 0.7);
  const budgetMax = Math.floor(budget * 1.2);

  try {
    const json = await getJson({
      engine: "google_hotels",
      q: location,
      check_in_date: checkIn,
      check_out_date: checkOut,
      adults: numAdults.toString(),
      // children:childrens,
      // children_ages:childAges,
      currency: "INR",
      price_min: budgetMin,
      price_max: budgetMax,
      gl: "in",
      hl: "en",
      api_key: process.env.SERP_API_KEY,
    });

    if (json && json.properties) {
      return json.properties;
    } else {
      console.error("SerpAPI returned no hotels:", json.properties);
      throw new Error("No hotels found in SerpAPI response");
    }
  } catch (err) {
    console.error("Error fetching hotels from SerpAPI:", err);
    throw err;
  }
};

module.exports = { fetchHotelsFromSerpAPI };
