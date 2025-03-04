import axios from "axios";

export const createUser = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
      const res = await axios.post(`/api/user`, data);
      return res
};

export const createPost = async (data: {
  title: string;
  content: string;
  tags?: string[];
  published?: boolean;
  image?: string;
  authorId?: string
}) => {
  const res = await axios.post(`/api/posts`, data);
  return res;
};


export const getPosts = async (page: number = 1, limit: number = 10) => {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await axios.get(`/api/posts?${queryParams.toString()}`);
  return res.data;
};

export const getPost = async (id: string) => {
  const res = await axios.get(`/api/posts/${id}`);
  return res.data;
};

export const deletePost = async (id: string) => {
  const res = await axios.delete(`/api/posts/${id}`);
  return res.data;
};




