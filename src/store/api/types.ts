export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  avatar?: string;
  uploads?: number;
  _count?: {
    followers: number;
    following: number;
    images: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageCount: number;
  coverImage?: string;
  isPublic: boolean;
  authorId?: string;
}

export interface ImageModel {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  categoryId: number;
  authorAvatar: string | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  uploadedById: number;
  uploadedBy?: {
    id: number;
    name: string;
    avatar: string | null;
  };
  width: number;
  height: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectReason?: string;
}

export interface CommentModel {
  id: number;
  content: string;
  userId: number;
  imageId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

export interface FollowStatusResponse {
  isFollowing: boolean;
}

// Responses
export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    images: T[];
    pagination: {
      totalItems: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

// Requests
export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
  coverImage?: File | null;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
  coverImage?: File | null;
}

export interface UploadImageRequest {
  image: File;
  title: string;
  description?: string;
  categoryId: string;
  isPublic?: boolean;
}

export interface RejectImageRequest {
  rejectReason: string;
}

// Queries
export interface GetPublicImagesQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
}

export interface AdminGetImagesQuery {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  uploadedById?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: File | null;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}

