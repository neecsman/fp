import axios from "axios";

const headers = {
  "Content-Type": "application/json",
  // "X-DV-Auth-Token": "B079090000208244309D6414D01BFA9E6C652C96", //test
  "X-DV-Auth-Token": "B079090000208244309D6414D01BFA9E6C652C96", //test lisogorskiy
};

const baseQuery = axios.create({
  baseURL: "https://robotapitest.dostavista.ru/api/business/1.2",
  headers,
});

export const paymentsQuery = axios.create({
  baseURL: process.env.PAY_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default baseQuery;
