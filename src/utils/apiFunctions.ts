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

export const updatePost = async (data: {
  title: string;
  content: string;
  tags?: string[];
  published?: boolean;
  image?: string;
}, id: string) => {
  const res = await axios.put(`/api/posts/${id}`, data);
  return res;
};


export const getPosts = async (
  page: number = 1,
  limit: number = 10,
  isPublished?: boolean,
  all?: boolean
) => {
  const queryParams = new URLSearchParams();

  if (all) {
    queryParams.append("all", "true");
  } else {
    queryParams.append("page", String(page));
    queryParams.append("limit", String(limit));
  }

  if (isPublished !== undefined) {
    queryParams.append("isPublished", String(isPublished));
  }

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




