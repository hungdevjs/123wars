import api from "./api";

export const getMe = () => api.get("/api/v1/users/me");

export const validatePhoneNumber = () => api.put("/api/v1/users/me/phone");

export const validateTransaction = ({ transactionHash }) =>
  api.put("/api/v1/users/me/transaction", { transactionHash });

validateTransaction({
  transactionHash:
    "0x35c3bf2af88983cd47f79ef32413152ab70a19e3a36f07f7688958b137b69f27",
}).catch((err) => console.error(err));
