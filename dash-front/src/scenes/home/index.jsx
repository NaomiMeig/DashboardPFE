import { Box, Button, Typography, Grid, Paper, Drawer, CssBaseline, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import Sidebar from "../global/Sidebar";
import { 
  ShowChart as LineChartIcon, 
  FilterAlt as FilterIcon, 
  Percent as PercentIcon, 
  Download as DownloadIcon 
} from "@mui/icons-material";

import { tokens } from "../../theme";

const Home = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const sidebarWidth = 180;
  
  return (
    <Box sx={{ display: 'flex', bgcolor: colors.primary[400], minHeight: '100vh' }} >
      <CssBaseline />
      
      {/* Sidebar - Fixed position */}
      <Box
        component="nav"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              width: 180,
              boxSizing: 'border-box',
              position: 'relative',
              height: '100vh',
              borderRight: 'none',
              boxShadow: 3,
              backgroundColor: colors.primary[400],
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: 0,
          ml: { md: '180px' },
          width: { md: `calc(100% - 180px)` },
          backgroundColor: colors.primary[400],
        }}
      >
        {/* Hero Section */}
        <Box sx={{ p: 3 }}>
        <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
          <Grid item xs={12} md={5}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              height: '100%'
            }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: colors.grey[100],
                mb: 3
              }}
            >
              Analysez vos données.
              <br />
              Prenez les bonnes décisions.
            </Typography>
            <Typography 
              variant="h5" 
              paragraph
              sx={{
                color: colors.grey[300],
                mb: 3
              }}
            >
              Découvrez notre tableau de bord interactif pour analyser et visualiser vos données en temps réel.
            </Typography>
            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              size="large"
              sx={{ 
                alignSelf: 'flex-start',
                backgroundColor: colors.blueAccent[500],
                '&:hover': {
                  backgroundColor: colors.blueAccent[400]
                }
              }}
            >
              Accéder au tableau de bord
            </Button>
          </Box>
          </Grid>
         <Grid item xs={12} md={7}>
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.primary[500],
                    height: '100%',
                    minHeight: 400
                }}
            >
            <Box sx={{ width: '100%', height: 300, position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
                {/* Axes */}
                <line x1="40" y1="260" x2="40" y2="40" stroke="#D1D5DB" strokeWidth="2" />
                <line x1="40" y1="260" x2="360" y2="260" stroke="#D1D5DB" strokeWidth="2" />

                {/* Ligne du graphique */}
                <polyline
                points="40,220 100,200 160,230 220,150 280,180 340,80"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="3"
                />

                {/* Flèche de tendance */}
                <line x1="340" y1="80" x2="380" y2="60" stroke="#9CA3AF" strokeWidth="2" />
                <polygon points="380,60 370,55 370,65" fill="#9CA3AF" />

                {/* Graphique circulaire */}
                <g transform="translate(300, 160)">
                <circle cx="0" cy="0" r="40" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                <path d="M 0 0 L 0 -40 A 40 40 0 0 1 34.64 20 Z" fill="#E5E7EB" />
                <path
                    d="M 0 0 L 34.64 20 A 40 40 0 0 1 -34.64 20 Z"
                    fill="white"
                    stroke="#D1D5DB"
                    strokeWidth="0.5"
                />
                <path
                    d="M 0 0 L -34.64 20 A 40 40 0 0 1 0 -40 Z"
                    fill="#F3F4F6"
                    stroke="#D1D5DB"
                    strokeWidth="0.5"
                />
                </g>
            </svg>

            {/* Barres en bas */}
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1,
                alignItems: 'flex-end'
            }}>
                <Box sx={{ width: 24, height: 32, bgcolor: '#D1D5DB' }} />
                <Box sx={{ width: 24, height: 48, bgcolor: '#D1D5DB' }} />
                <Box sx={{ width: 24, height: 24, bgcolor: '#D1D5DB' }} />
            </Box>
            </Box>
        </Paper>
        </Grid>
        </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: colors.grey[100]
            }}
          >
            Fonctionnalités principales
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: <LineChartIcon fontSize="large" color="secondary" />, title: "Graphiques interactifs" },
              { icon: <FilterIcon fontSize="large" color="secondary" />, title: "Filtres personnalisés" },
              { icon: <PercentIcon fontSize="large" color="secondary" />, title: "Indicateurs de performance" },
              { icon: <DownloadIcon fontSize="large" color="secondary" />, title: "Exportation de rapports" }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    textAlign: 'center',
                    backgroundColor: theme.palette.mode === 'dark' 
                     ? colors.blueAccent[400]  // Fond bleu nuit en dark mode
                     : colors.grey[900],      // Fond gris clair en light mode
                    '&:hover': {
                      boxShadow: theme.shadows[6],
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography 
                    variant="h6" 
                    component="h3"
                    sx={{ color: colors.grey[700] }}
                  >
                    {feature.title}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Footer Links */}
        <Box sx={{ 
          borderTop: `1px solid ${colors.grey[700]}`, 
          pt: 4, 
          display: 'flex', 
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center'
        }}>
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Button 
              component={Link} 
              to="/mentions-legales" 
              size="small"
              sx={{ color: colors.grey[100] }}
            >
              Mentions légales
            </Button>
            <Button 
              component={Link} 
              to="/politique-de-confidentialite" 
              size="small" 
              sx={{ 
                ml: 2,
                color: colors.grey[100]
              }}
            >
              Politique de confidentialité
            </Button>
          </Box>
          <Button 
            component={Link} 
            to="/contact" 
            size="small"
            sx={{ color: colors.grey[100] }}
          >
            Contact
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;