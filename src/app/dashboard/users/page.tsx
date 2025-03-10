'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/services/api';
import { User, UsersResponse } from '@/types';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Card,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const theme = useTheme();

  const fetchUsers = async (limit: number, skip: number, query: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let response: UsersResponse;
      
      if (query.trim()) {
        response = await userService.searchUsers(query);
      } else {
        response = await userService.getAllUsers(limit, skip);
      }
      
      setUsers(response.users);
      setTotal(response.total);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(rowsPerPage, page * rowsPerPage);
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setPage(0);
      fetchUsers(rowsPerPage, 0, searchQuery);
    }, 500);
    
    setSearchTimeout(timeout);
    
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchQuery]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all users in the system.
        </Typography>
      </Box>

      <Card 
        elevation={0} 
        sx={{ 
          mb: 4, 
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(34, 146, 164, 0.05) 100%)',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users by name, email, or username..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              backgroundColor: alpha('#FFFFFF', 0.8),
            },
          }}
        />
      </Card>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 1,
          }}
        >
          {error}
        </Alert>
      )}

      <Paper 
        elevation={0} 
        sx={{ 
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(34, 146, 164, 0.02) 100%)',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(90deg, rgba(0, 52, 95, 0.1) 0%, rgba(34, 146, 164, 0.1) 100%)',
              }}>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Age</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && page === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1">No users found</Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      Try adjusting your search criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow 
                    key={user.id} 
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.light, 0.05),
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={user.image} 
                          alt={user.firstName}
                          sx={{ 
                            mr: 2,
                            width: 40,
                            height: 40,
                            border: `1px solid ${theme.palette.divider}`,
                          }} 
                        />
                        <Box>
                          <Typography fontWeight={500} color="text.primary">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.primary">
                        @{user.username}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.primary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.primary">
                        {user.age}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.gender}
                        size="small"
                        sx={{
                          bgcolor: user.gender === 'male' 
                            ? alpha(theme.palette.primary.main, 0.15)
                            : alpha(theme.palette.secondary.light, 0.15),
                          color: user.gender === 'male'
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                          fontWeight: 500,
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send Email">
                          <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                            <MailOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Call">
                          <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                            <PhoneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(34, 146, 164, 0.05) 100%)',
          }}
        />
      </Paper>
    </Box>
  );
} 