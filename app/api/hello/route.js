import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const zipCode = searchParams.get("zipCode");
  return await axios
    .get(
      `https://www.zipcodeapi.com/rest/H1jGqL02BlSBVdCmm8EM6Dbr5CgOyQGyvvI56vfiM8lZis8kcsMO3wm70qDLXNNd/info.json/${zipCode}/degrees`
    )
    .then((res) => {
      let dataToSend = {
        city:res.data.city,
        state:res.data.state
      }
      const response = new Response(JSON.stringify(dataToSend), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response;
    })
    .catch((err) => console.log(err));
}
