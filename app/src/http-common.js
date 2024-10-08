import axios from "axios";

export const examenInstance = axios.create({
  baseURL: "https://localhost:3080/api",
  headers: {
    "Content-type": "application/json",
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',   
  }
});


