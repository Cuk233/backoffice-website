'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/api';
import { User } from '@/types';
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
  TableSortLabel,
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Stack,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserDetailDialog from './components/UserDetailDialog';
import UserFormDialog from './components/UserFormDialog';

// Define sort and filter types
type SortField = 'firstName' | 'lastName' | 'email' | 'age' | 'username';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('firstName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const theme = useTheme();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers({
        limit: rowsPerPage,
        skip: page * rowsPerPage,
        sortBy: sortField,
        order: sortOrder,
      });
      setUsers(response.users);
      setTotalUsers(response.total);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, sortField, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        fetchUsers();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, fetchUsers]);

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

  const handleSortRequest = (field: SortField) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setUserFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserFormOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailDialog(true);
  };

  const confirmDeleteUser = async () => {
    if (selectedUser) {
      try {
        await userService.deleteUser(selectedUser.id);
        setSnackbarMessage('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setSnackbarMessage('Failed to delete user');
      }
    }
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUserFormSubmit = async (userData: Partial<User>) => {
    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, userData);
        setSnackbarMessage('User updated successfully');
      } else {
        await userService.addUser(userData);
        setSnackbarMessage('User created successfully');
      }
      fetchUsers();
      setUserFormOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      setSnackbarMessage('Failed to save user');
    }
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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
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
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddUser}
              >
                Add User
              </Button>
            </Stack>
          </Grid>
        </Grid>
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
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={sortField === 'username'}
                    direction={sortField === 'username' ? sortOrder : 'asc'}
                    onClick={() => handleSortRequest('username')}
                  >
                    Username
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={sortField === 'email'}
                    direction={sortField === 'email' ? sortOrder : 'asc'}
                    onClick={() => handleSortRequest('email')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={sortField === 'age'}
                    direction={sortField === 'age' ? sortOrder : 'asc'}
                    onClick={() => handleSortRequest('age')}
                  >
                    Age
                  </TableSortLabel>
                </TableCell>
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
                          <IconButton 
                            size="small" 
                            sx={{ color: theme.palette.primary.main }}
                            onClick={() => handleViewDetails(user)}
                          >
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton 
                            size="small" 
                            sx={{ color: theme.palette.primary.main }}
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton 
                            size="small" 
                            sx={{ color: theme.palette.error.main }}
                            onClick={() => handleDeleteUser(user)}
                          >
                            <DeleteIcon fontSize="small" />
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalUsers}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Detail Dialog */}
      {selectedUser && (
        <UserDetailDialog
          open={showDetailDialog}
          user={selectedUser}
          onClose={() => setShowDetailDialog(false)}
        />
      )}

      {/* User Form Dialog */}
      <UserFormDialog
        open={userFormOpen}
        user={selectedUser}
        isEditMode={!!selectedUser}
        onClose={() => setUserFormOpen(false)}
        onSubmit={handleUserFormSubmit}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </Box>
  );
} 