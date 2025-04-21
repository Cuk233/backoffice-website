'use client';

import { useAuth } from '@/context/AuthContext';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Divider,
  useTheme,
  alpha,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArticleIcon from '@mui/icons-material/Article';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
          Welcome, {user.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is your dashboard where you can manage users and view your profile information.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(34, 146, 164, 0.05) 100%)',
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
              Your Profile
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mr: 2,
                  border: `2px solid ${theme.palette.primary.main}`,
                }}
              />
              <Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  {user.firstName} {user.lastName}
                </Typography>
                <Chip 
                  label={`@${user.username}`} 
                  size="small" 
                  sx={{ 
                    mt: 0.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                  }} 
                />
              </Box>
            </Box>
            
            <Stack spacing={2}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 1.5,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.background.paper, 0.7),
              }}>
                <PersonIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                <Typography variant="body1" color="text.primary">
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 1.5,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.background.paper, 0.7),
              }}>
                <EmailIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                <Typography variant="body1" color="text.primary">
                  {user.email}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <Grid container spacing={3} height="100%">
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(34, 146, 164, 0.05) 100%)',
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card 
                      sx={{ 
                        background: 'linear-gradient(135deg, #00345F 0%, #2292A4 100%)',
                        color: '#FFFFFF',
                        height: '100%',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PeopleAltIcon sx={{ mr: 1 }} />
                          <Typography variant="h6" fontWeight="bold">User Management</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                          View and manage all users in the system
                        </Typography>
                        <Button 
                          component={Link}
                          href="/dashboard/users"
                          variant="contained" 
                          color="inherit" 
                          sx={{ 
                            color: theme.palette.primary.main,
                            bgcolor: '#FFFFFF',
                            '&:hover': {
                              bgcolor: alpha('#FFFFFF', 0.9),
                            },
                            alignSelf: 'flex-start',
                            fontWeight: 600,
                          }}
                          endIcon={<ArrowForwardIcon />}
                        >
                          View Users
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Card 
                      sx={{ 
                        background: 'linear-gradient(135deg, #2292A4 0%, #44BBA4 100%)',
                        color: '#FFFFFF',
                        height: '100%',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <ShoppingBasketIcon sx={{ mr: 1 }} />
                          <Typography variant="h6" fontWeight="bold">Product Catalog</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                          Browse, search, and filter products from our catalog
                        </Typography>
                        <Button 
                          component={Link}
                          href="/dashboard/products"
                          variant="contained" 
                          color="inherit" 
                          sx={{ 
                            color: theme.palette.primary.main,
                            bgcolor: '#FFFFFF',
                            '&:hover': {
                              bgcolor: alpha('#FFFFFF', 0.9),
                            },
                            alignSelf: 'flex-start',
                            fontWeight: 600,
                          }}
                          endIcon={<ArrowForwardIcon />}
                        >
                          View Products
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Card 
                      sx={{ 
                        border: `1px solid ${theme.palette.divider}`,
                        height: '100%',
                        transition: 'transform 0.2s',
                        background: 'linear-gradient(135deg, rgba(0, 52, 95, 0.05) 0%, rgba(34, 146, 164, 0.1) 100%)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <ArticleIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="bold" color="text.primary">Documentation</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                          This project uses DummyJSON API for authentication and user data
                        </Typography>
                        <a 
                          href="https://dummyjson.com/docs" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ textDecoration: 'none' }}
                        >
                          <Button 
                            variant="outlined" 
                            color="primary"
                            sx={{ 
                              alignSelf: 'flex-start',
                              fontWeight: 600,
                            }}
                            endIcon={<ArrowForwardIcon />}
                          >
                            View Docs
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(34, 146, 164, 0.05) 0%, rgba(68, 187, 164, 0.1) 100%)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
                      About This Project
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This is a portfolio project showcasing a user portal with login features and user management using DummyJSON API, Next.js, TypeScript, and Material UI.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
} 