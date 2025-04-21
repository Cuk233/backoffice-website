'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { userService } from '@/services/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Avatar,
  Box,
  Divider,
  Chip,
  Paper,
  CircularProgress,
  useTheme,
  alpha,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';

interface UserDetailDialogProps {
  open: boolean;
  user: User;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  todo: string;
}

interface CartProduct {
  id: number;
  productId: number;
  quantity: number;
  title?: string;
  price?: number;
  total?: number;
}

interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
  totalProducts: number;
  totalQuantity: number;
  total: number;
}

export default function UserDetailDialog({ open, user, onClose }: UserDetailDialogProps) {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [userCarts, setUserCarts] = useState<Cart[]>([]);
  const theme = useTheme();

  useEffect(() => {
    if (open && user) {
      // Reset tab to first tab when dialog opens
      setTabValue(0);
    }
  }, [open, user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    // Fetch data based on selected tab
    if (newValue === 1 && userPosts.length === 0) {
      fetchUserPosts();
    } else if (newValue === 2 && userTodos.length === 0) {
      fetchUserTodos();
    } else if (newValue === 3 && userCarts.length === 0) {
      fetchUserCarts();
    }
  };

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserPosts(user.id);
      setUserPosts(response.posts || []);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTodos = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserTodos(user.id);
      setUserTodos(response.todos || []);
    } catch (err) {
      console.error('Error fetching user todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCarts = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserCarts(user.id);
      setUserCarts(response.carts || []);
    } catch (err) {
      console.error('Error fetching user carts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
        pb: 1
      }}>
        User Details
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
          }
        }}
      >
        <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
        <Tab label="Posts" icon={<ArticleIcon />} iconPosition="start" />
        <Tab label="Todos" icon={<ListAltIcon />} iconPosition="start" />
        <Tab label="Carts" icon={<ShoppingCartIcon />} iconPosition="start" />
      </Tabs>
      
      <DialogContent dividers sx={{ p: 0 }}>
        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    mb: 2,
                    border: `3px solid ${theme.palette.primary.main}`,
                  }}
                />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  @{user.username}
                </Typography>
                <Chip 
                  label={user.gender} 
                  color={user.gender === 'male' ? 'primary' : 'secondary'}
                  sx={{ textTransform: 'capitalize', mt: 1 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <EmailIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <PhoneIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body2">
                        {user.phone}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <CakeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Birth Date
                      </Typography>
                      <Typography variant="body2">
                        {user.birthDate} (Age: {user.age})
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <SchoolIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        University
                      </Typography>
                      <Typography variant="body2">
                        {user.university || 'N/A'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                Address
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {user.address && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <HomeIcon sx={{ mr: 1, mt: 0.5, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="body2">
                      {user.address.address}
                    </Typography>
                    <Typography variant="body2">
                      {user.address.city}, {user.address.state} {user.address.postalCode}
                    </Typography>
                  </Box>
                </Paper>
              )}
              
              {user.company && (
                <>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                    Company
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WorkIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="body1" fontWeight="medium">
                        {user.company.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {user.company.title} - {user.company.department}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {user.company.address.address}, {user.company.address.city}, {user.company.address.state}
                    </Typography>
                  </Paper>
                </>
              )}
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Posts Tab */}
        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : userPosts.length > 0 ? (
            <Grid container spacing={2}>
              {userPosts.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.body}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      {post.tags.map((tag: string) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              No posts found for this user.
            </Typography>
          )}
        </TabPanel>
        
        {/* Todos Tab */}
        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : userTodos.length > 0 ? (
            <Grid container spacing={2}>
              {userTodos.map((todo) => (
                <Grid item xs={12} sm={6} md={4} key={todo.id}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: todo.completed ? alpha(theme.palette.success.main, 0.1) : 'inherit',
                    }}
                  >
                    <Typography variant="body1" gutterBottom>
                      {todo.todo}
                    </Typography>
                    <Chip 
                      label={todo.completed ? 'Completed' : 'Pending'} 
                      color={todo.completed ? 'success' : 'warning'}
                      size="small"
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              No todos found for this user.
            </Typography>
          )}
        </TabPanel>
        
        {/* Carts Tab */}
        <TabPanel value={tabValue} index={3}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : userCarts.length > 0 ? (
            <Grid container spacing={3}>
              {userCarts.map((cart) => (
                <Grid item xs={12} key={cart.id}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Cart #{cart.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Products: {cart.totalProducts} | Total Quantity: {cart.totalQuantity}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Total: ${cart.total}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Products:
                    </Typography>
                    <Grid container spacing={1}>
                      {cart.products.map((product: CartProduct) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 1.5, 
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                            }}
                          >
                            <Typography variant="body2" noWrap>
                              {product.title}
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Price: ${product.price} | Qty: {product.quantity}
                            </Typography>
                            <Typography variant="caption" fontWeight="bold">
                              Total: ${product.total}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              No carts found for this user.
            </Typography>
          )}
        </TabPanel>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
} 