import { blogSchema, userSchema } from '../schemas';

describe('User Schema Validation', () => {
  describe('name validation', () => {
    it('should accept valid names', () => {
      const result = userSchema.name.safeParse('John Doe');
      expect(result.success).toBe(true);
    });

    it('should reject empty names', () => {
      const result = userSchema.name.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is required');
      }
    });

    it('should reject names longer than 100 characters', () => {
      const longName = 'a'.repeat(101);
      const result = userSchema.name.safeParse(longName);
      expect(result.success).toBe(false);
    });
  });

  describe('email validation', () => {
    it('should accept valid emails', () => {
      const result = userSchema.email.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('should reject invalid emails', () => {
      const result = userSchema.email.safeParse('invalid-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid Email');
      }
    });

    it('should reject empty emails', () => {
      const result = userSchema.email.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is required');
      }
    });
  });

  describe('password validation', () => {
    it('should accept valid passwords', () => {
      const result = userSchema.password.safeParse('StrongP@ss1');
      expect(result.success).toBe(true);
    });

    it('should reject passwords shorter than 8 characters', () => {
      const result = userSchema.password.safeParse('Sh0rt!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters long');
      }
    });

    it('should reject passwords without uppercase letters', () => {
      const result = userSchema.password.safeParse('noupperletter1!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter');
      }
    });

    it('should reject passwords without lowercase letters', () => {
      const result = userSchema.password.safeParse('NOLOWERLETTER1!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one lowercase letter');
      }
    });

    it('should reject passwords without numbers', () => {
      const result = userSchema.password.safeParse('NoNumbers!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one number');
      }
    });

    it('should reject passwords without special characters', () => {
      const result = userSchema.password.safeParse('NoSpecial123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one special character');
      }
    });
  });
});

describe('Blog Schema Validation', () => {
  it('should accept valid blog data', () => {
    const validBlog = {
      title: 'Test Blog',
      content: 'This is a valid blog post with enough content',
      published: true,
      image: 'https://example.com/image.jpg'
    };
    
    const result = blogSchema.safeParse(validBlog);
    expect(result.success).toBe(true);
  });

  it('should accept blog without optional fields', () => {
    const minimalBlog = {
      title: 'Test Blog',
      content: 'This is valid content'
    };
    
    const result = blogSchema.safeParse(minimalBlog);
    expect(result.success).toBe(true);
  });

  it('should reject blogs with short titles', () => {
    const invalidBlog = {
      title: 'AB', // Too short
      content: 'This is valid content'
    };
    
    const result = blogSchema.safeParse(invalidBlog);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title must be at least 3 characters');
    }
  });

  it('should reject blogs with short content', () => {
    const invalidBlog = {
      title: 'Valid Title',
      content: 'Too short' // Too short
    };
    
    const result = blogSchema.safeParse(invalidBlog);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Content must be at least 10 characters');
    }
  });

  it('should reject blogs with invalid image URLs', () => {
    const invalidBlog = {
      title: 'Valid Title',
      content: 'This is valid content',
      image: 'not-a-url'
    };
    
    const result = blogSchema.safeParse(invalidBlog);
    expect(result.success).toBe(false);
  });
});