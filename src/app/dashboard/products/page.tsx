'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { 
  fetchProducts, 
  fetchProductCategories, 
  fetchProductsByCategory,
  searchProducts,
  setSelectedCategory,
  resetProducts,
  sortProductsByPrice,
  sortProductsByRating
} from '@/redux/slices/productSlice';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip,
  Rating,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Button,
  Divider,
  useTheme,
  alpha,
  SelectChangeEvent,
  IconButton,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';

// Helper function to safely format category strings
const formatCategory = (category: string | null | undefined): string => {
  const categoryStr = String(category || '');
  return categoryStr.replace(/-/g, ' ');
};

export default function ProductsPage() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { 
    items, 
    filteredItems, 
    categories, 
    selectedCategory, 
    status, 
    error, 
    totalProducts, 
    limit 
  } = useAppSelector((state) => state.products);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState('');
  
  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / limit);
  
  // Fetch products and categories on initial load
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts({}));
    }
    
    if (categories.length === 0) {
      dispatch(fetchProductCategories());
    }
  }, [dispatch, items.length, categories.length]);
  
  // Handle category selection
  const handleCategoryChange = (event: SelectChangeEvent) => {
    const category = event.target.value;
    if (category) {
      dispatch(setSelectedCategory(category));
      dispatch(fetchProductsByCategory(category));
    } else {
      dispatch(resetProducts());
    }
  };
  
  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchProducts(searchQuery));
    } else {
      dispatch(resetProducts());
    }
  };
  
  // Handle sort
  const handleSortChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSortOption(value);
    
    if (value === 'price_asc') {
      dispatch(sortProductsByPrice('asc'));
    } else if (value === 'price_desc') {
      dispatch(sortProductsByPrice('desc'));
    } else if (value === 'rating_asc') {
      dispatch(sortProductsByRating('asc'));
    } else if (value === 'rating_desc') {
      dispatch(sortProductsByRating('desc'));
    }
  };
  
  // Handle pagination
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    dispatch(fetchProducts({ skip: (value - 1) * limit, limit }));
  };
  
  // Handle reset filters
  const handleReset = () => {
    setSearchQuery('');
    setSortOption('');
    setPage(1);
    dispatch(resetProducts());
    dispatch(fetchProducts({}));
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
          Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and search products from our catalog
        </Typography>
      </Box>
      
      {/* Filters and Search */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(34, 146, 164, 0.05) 100%)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortOption}
                label="Sort By"
                onChange={handleSortChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>Default</em>
                </MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="rating_asc">Rating: Low to High</MenuItem>
                <MenuItem value="rating_desc">Rating: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleReset}
              startIcon={<RefreshIcon />}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Status Messages */}
      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {status === 'failed' && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'An error occurred while fetching products'}
        </Alert>
      )}
      
      {/* Products Grid */}
      {status === 'succeeded' && (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredItems.length} products
              {selectedCategory && ` in ${formatCategory(selectedCategory)}`}
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {filteredItems.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.thumbnail}
                    alt={product.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 1 }}>
                      <Chip 
                        label={formatCategory(product.category)} 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                          mb: 1,
                        }} 
                      />
                    </Box>
                    <Typography variant="h6" component="div" gutterBottom noWrap>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden' }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.rating})
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        {product.discountPercentage > 0 && (
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                          </Typography>
                        )}
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                          ${product.price}
                        </Typography>
                      </Box>
                      <Chip 
                        label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
                        color={product.stock > 0 ? 'success' : 'error'} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                shape="rounded" 
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
} 