import axios from "axios";

export const createUser = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    const res = await axios.post(`/api/user`, data);
    return res;
  };