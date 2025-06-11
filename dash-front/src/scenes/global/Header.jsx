import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, InputBase, Badge, useTheme 
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

import { AuthContext } from "../../contexts/AuthContext";  // Import du contexte

const Header = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  // Récupération des infos d'authentification depuis le contexte
  const { isLoggedIn, userRole, userName, logout } = useContext(AuthContext);

  // Fonction de déconnexion qui appelle logout du contexte + redirection
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: colors.primary[900],
        boxShadow: "none",
        borderBottom: `1px solid ${colors.grey[700]}`,
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        left: 0,
        right: 0
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: { xs: "0 8px", sm: "0 16px" } }}>
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 3 } }}>
          <Typography variant="h6" noWrap>
            <Button 
              color="inherit" 
              component={Link} 
              to="/" 
              sx={{ fontWeight: 700, fontSize: "1.2rem", textTransform: "none" }}
            >
              MyApp
            </Button>
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <Button color="inherit" component={Link} to="/" sx={{ minWidth: "auto" }}>
              Accueil
            </Button>
            <Button color="inherit" component={Link} to="/apropos" sx={{ minWidth: "auto" }}>
              À propos
            </Button>
            {isLoggedIn && userRole === "admin" && (
              <Button color="inherit" component={Link} to="/admin" sx={{ minWidth: "auto" }}>
                Admin
              </Button>
            )}
          </Box>
        </Box>

        {/* Middle Section - Search */}
        <Box
          sx={{ 
            display: { xs: "none", sm: "flex" },
            flex: 1,
            maxWidth: 600,
            mx: 3,
            backgroundColor: colors.primary[400],
            borderRadius: "4px",
            overflow: "hidden"
          }}
        >
          <InputBase
            placeholder="Rechercher..."
            sx={{ ml: 2, flex: 1, color: colors.grey[100], '&::placeholder': { color: colors.grey[300], opacity: 1 } }}
          />
          <IconButton
            type="button"
            sx={{ p: 1, color: colors.grey[300], '&:hover': { backgroundColor: colors.primary[500] } }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
          <IconButton onClick={colorMode.toggleColorMode} size="medium" sx={{ color: colors.grey[100] }}>
            {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>

          <IconButton size="medium" sx={{ color: colors.grey[100] }}>
            <Badge badgeContent={4} color="secondary">
              <NotificationsOutlinedIcon />
            </Badge>
          </IconButton>

          <IconButton size="medium" sx={{ color: colors.grey[100], display: { xs: "none", sm: "inline-flex" } }}>
            <SettingsOutlinedIcon />
          </IconButton>

          {isLoggedIn ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton size="medium" sx={{ color: colors.grey[100] }}>
                  <PersonOutlinedIcon />
                </IconButton>
                <Typography variant="body2" sx={{ color: colors.grey[100], fontWeight: 500 }}>
                  {userName}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  ml: 1,
                  color: colors.redAccent[400],
                  borderColor: colors.redAccent[400],
                  '&:hover': { borderColor: colors.redAccent[300] }
                }}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              component={Link}
              to="/login"
              sx={{
                ml: 1,
                backgroundColor: colors.blueAccent[500],
                '&:hover': { backgroundColor: colors.blueAccent[400] }
              }}
            >
              Connexion
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

