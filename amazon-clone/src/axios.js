import axios from "axios"

const instance = axios.create({
  baseURL: "http://localhost:5001/clone-baafc/us-central1/api",
  'Access-Control-Allow-Origin': true
});

export default instance;