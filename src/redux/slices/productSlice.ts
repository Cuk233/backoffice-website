import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  categories: string[];
  selectedCategory: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalProducts: number;
  skip: number;
  limit: number;
}

// Initial state
const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  categories: [],
  selectedCategory: null,
  status: 'idle',
  error: null,
  totalProducts: 0,
  skip: 0,
  limit: 10,
};

// API base URL
const API_URL = 'https://dummyjson.com';

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ limit = 10, skip = 0, select = '' }: { limit?: number; skip?: number; select?: string }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit.toString());
      if (skip) queryParams.append('skip', skip.toString());
      if (select) queryParams.append('select', select);
      
      const response = await axios.get(`${API_URL}/products?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const fetchProductCategories = createAsyncThunk(
  'products/fetchProductCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/categories`);
      // Ensure all categories are strings
      const categories = Array.isArray(response.data) 
        ? response.data.map((category: string | number) => String(category))
        : [];
      console.log('Processed categories:', categories);
      return categories;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/category/${category}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Create the slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    resetProducts: (state) => {
      state.filteredItems = state.items;
      state.selectedCategory = null;
    },
    sortProductsByPrice: (state, action: PayloadAction<'asc' | 'desc'>) => {
      const direction = action.payload;
      state.filteredItems.sort((a, b) => {
        return direction === 'asc' ? a.price - b.price : b.price - a.price;
      });
    },
    sortProductsByRating: (state, action: PayloadAction<'asc' | 'desc'>) => {
      const direction = action.payload;
      state.filteredItems.sort((a, b) => {
        return direction === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.filteredItems = action.payload.products;
        state.totalProducts = action.payload.total;
        state.skip = action.payload.skip;
        state.limit = action.payload.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Handle fetchProductCategories
      .addCase(fetchProductCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('Categories from API:', action.payload);
        state.categories = action.payload;
      })
      .addCase(fetchProductCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Handle fetchProductsByCategory
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.filteredItems = action.payload.products;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Handle searchProducts
      .addCase(searchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.filteredItems = action.payload.products;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { 
  setSelectedCategory, 
  resetProducts, 
  sortProductsByPrice, 
  sortProductsByRating 
} = productSlice.actions;

export default productSlice.reducer; 