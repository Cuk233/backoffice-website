'use client';

import { ReactNode } from 'react';
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Create a theme instance with the teal/blue gradient color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#00345F', // Deep blue
      light: '#2292A4', // Teal blue
      dark: '#00171F', // Dark navy
    },
    secondary: {
      main: '#2292A4', // Teal blue
      light: '#44BBA4', // Mint green
      dark: '#00345F', // Deep blue
    },
    error: {
      main: '#E63946',
    },
    warning: {
      main: '#F4A261',
    },
    info: {
      main: '#2292A4',
    },
    success: {
      main: '#44BBA4',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#00171F', // Dark navy for primary text
      secondary: '#00345F', // Deep blue for secondary text
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #00345F 0%, #2292A4 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #00171F 0%, #00345F 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          borderRadius: '0.75rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#00171F', // Ensure table text is dark enough
        },
        head: {
          fontWeight: 600,
          color: '#00171F', // Darker text for table headers
          background: 'linear-gradient(90deg, rgba(0, 52, 95, 0.05) 0%, rgba(34, 146, 164, 0.05) 100%)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #FFFFFF 30%, rgba(34, 146, 164, 0.05) 100%)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(34, 146, 164, 0.05) 100%)',
        },
      },
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
} 