// src/api/post.js
import { APIClient } from ".";

export const createPostAPI = async (data) => {
    return await APIClient.post("/posts", data);
};

export const getAllPostsAPI = async () => {
    return await APIClient.get("/posts");
};

export const getPostById = async (id) => {
    return await APIClient.get(`/posts/${id}`);
};

export const deletePostAPI = async (id) => {
    return await APIClient.delete(`/posts/${id}`);
};

export const updatePostAPI = async (id, data) => {
    return await APIClient.put(`/posts/${id}`, data);
};

