// lib/redux/productsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export interface IProduct {
  id: number;
  uuid: string;
  image: string;
  imagePath?: string;
  name: string;
  price?: number;
  oldPrice?: number;
  author?: string;
  location?: string;
  whatsapp?: string;
  description?: string;
  category?: string;
}

interface ProductsState {
  productData: IProduct[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

const initialState: ProductsState = {
  productData: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalProducts: 0,
};

// Helper function pour gérer les erreurs de manière type-safe
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

// Option 1: Si votre API retourne un tableau simple (sans pagination)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products = await response.json();

      return {
        products: Array.isArray(products) ? products.map((product: IProduct) => ({
          ...product,
          image: product.imagePath || product.image || '/images/default-image.jpg'
        })) : [],
        totalPages: 1,
        currentPage: 1,
        totalProducts: Array.isArray(products) ? products.length : 0
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Option 2: Si vous voulez implémenter la pagination côté API
export const fetchProductsPaginated = createAsyncThunk(
  'products/fetchProductsPaginated',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products?page=${page}&limit=15`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      return {
        products: Array.isArray(data.products) ? data.products.map((product: IProduct) => ({
          ...product,
          image: product.imagePath || product.image || '/images/default-image.jpg'
        })) : [],
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || page,
        totalProducts: data.totalProducts || 0
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addProductAsync = createAsyncThunk(
  'products/addProduct',
  async (productData: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: productData,
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const product = await response.json();
      return {
        ...product,
        image: product.imagePath || product.image || '/images/default-image.jpg'
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateProductAsync = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteProductAsync = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.productData = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productData = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch paginated products
      .addCase(fetchProductsPaginated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.productData = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProductsPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add product
      .addCase(addProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.productData.push(action.payload);
        state.totalProducts += 1;
      })
      .addCase(addProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update product
      .addCase(updateProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.productData.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.productData[index] = action.payload;
        }
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete product
      .addCase(deleteProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.productData = state.productData.filter(
          (product) => product.id !== action.payload
        );
        state.totalProducts = Math.max(0, state.totalProducts - 1);
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProducts, clearError, setPage } = productsSlice.actions;

// Configuration de persistance
const persistConfig = {
  key: 'products',
  storage,
  whitelist: ['productData', 'currentPage', 'totalPages', 'totalProducts'],
};

export default persistReducer(persistConfig, productsSlice.reducer);