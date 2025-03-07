import axios from 'axios';
import {
    createPost,
    createUser,
    deletePost,
    getPost,
    getPosts,
    updatePost
} from '../apiFunctions';

// Mock axios
jest.mock('axios');

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    };

    it('should call axios.post with correct parameters', async () => {
      // Type assertion in a way that works with Jest
      (axios.post as jest.Mock).mockResolvedValueOnce({ data: { id: '123', ...userData } });
      
      await createUser(userData);
      
      expect(axios.post).toHaveBeenCalledWith('/api/user', userData);
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it('should return the response from axios', async () => {
      const expectedResponse = { data: { id: '123', ...userData } };
      (axios.post as jest.Mock).mockResolvedValueOnce(expectedResponse);
      
      const result = await createUser(userData);
      
      expect(result).toEqual(expectedResponse);
    });

    it('should propagate errors from axios', async () => {
      const error = new Error('Network error');
      (axios.post as jest.Mock).mockRejectedValueOnce(error);
      
      await expect(createUser(userData)).rejects.toThrow('Network error');
    });
  });

  describe('createPost', () => {
    const postData = {
      title: 'Test Post',
      content: 'This is test content',
      tags: ['test'],
      published: true
    };

    it('should call axios.post with correct parameters', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({ data: { id: '123', ...postData } });
      
      await createPost(postData);
      
      expect(axios.post).toHaveBeenCalledWith('/api/posts', postData);
    });
  });

  describe('updatePost', () => {
    const postData = {
      title: 'Updated Post',
      content: 'This is updated content',
      published: true
    };
    const postId = '123';

    it('should call axios.put with correct parameters', async () => {
      (axios.put as jest.Mock).mockResolvedValueOnce({ data: { id: postId, ...postData } });
      
      await updatePost(postData, postId);
      
      expect(axios.put).toHaveBeenCalledWith(`/api/posts/${postId}`, postData);
    });
  });

  describe('getPosts', () => {
    it('should call axios.get with default parameters', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });
      
      await getPosts(1, 10, true);
      
      expect(axios.get).toHaveBeenCalledWith('/api/posts?page=1&limit=10&isPublished=true');
    });

    it('should call axios.get with custom parameters', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });
      
      await getPosts(2, 20, false);
      
      expect(axios.get).toHaveBeenCalledWith('/api/posts?page=2&limit=20&isPublished=false');
    });

    it('should return the data property from the response', async () => {
      const mockPosts = [{ id: '1', title: 'Post 1' }, { id: '2', title: 'Post 2' }];
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockPosts });
      
      const result = await getPosts(1, 10, true);
      
      expect(result).toEqual(mockPosts);
    });
  });

  describe('getPost', () => {
    it('should call axios.get with the correct id', async () => {
      const postId = '123';
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: { id: postId } });
      
      await getPost(postId);
      
      expect(axios.get).toHaveBeenCalledWith(`/api/posts/${postId}`);
    });
  });

  describe('deletePost', () => {
    it('should call axios.delete with the correct id', async () => {
      const postId = '123';
      (axios.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      
      await deletePost(postId);
      
      expect(axios.delete).toHaveBeenCalledWith(`/api/posts/${postId}`);
    });
  });
});