
const {fetchHotelsFromSerpAPI} = require('../services/serpApi')
const {getHotelRecommendations} = require('../services/gemini')



const dateDifference = (start, end) => {
  const checkInDate = new Date(start);
  const checkOutDate = new Date(end);
  return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;
};


exports.fetchControl = async (req,res)=>{
    try{
        const {search,checkIn,checkOut,price,numAdults,preferences}= req.body;
        const diff = dateDifference(checkIn,checkOut);
        const budget = price/diff;

        const hotels = await fetchHotelsFromSerpAPI(search,checkIn,checkOut,numAdults,budget);
        const topHotels = await getHotelRecommendations(hotels,budget,preferences);

        res.status(200).json({
            success:true,
            msg:topHotels
        })


    }catch(error){

        console.log(error);
    }


}