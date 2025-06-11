import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";

// Icons
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      icon={icon}
      onClick={() => setSelected(title)}
    >
      <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
        <Typography>{title}</Typography>
      </Link>
    </MenuItem>
  );
};

const Sidebardash = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const location = useLocation();
  const importedData = location.state?.initialData || [];
  const userRole = localStorage.getItem("userRole"); // "admin" ou "user"

  return (
    <Box
      sx={{
        "& .pro-sidebar": {
          width: isCollapsed ? "80px" : "200px", // Ajuste ici la largeur
          minWidth: isCollapsed ? "80px" : "200px",
          transition: "all 0.3s ease-in-out",
        },
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* Logo & menu toggle */}
          <MenuItem
            icon={<MenuOutlinedIcon />}
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ margin: "10px 0 20px 0", color: colors.grey[100] }}
          >
            {!isCollapsed && (
              <Box 
               display="flex" 
               justifyContent="space-between" 
               alignItems="center" 
               ml="15px"
               sx={{
                  transition: "opacity 0.3s ease-in-out",
                  opacity: isCollapsed ? 0 : 1,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
               >
                <Typography variant="h3" color={colors.grey[100]}>
                  Tableau
                </Typography>
               
              </Box>
            )}
          </MenuItem>

          {/* Menu commun à tous */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Graphiques"
              to="/charts"
              state={{ initialData: location.state?.initialData }} // Ajoutez cette ligne
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Rapports"
              to="/reports"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Carte"
              to="/map"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>

          {/* Partie admin uniquement */}
          {userRole === "admin" && (
            <>
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Admin
              </Typography>
              <Item
                title="Panel Admin"
                to="/admin"
                icon={<AdminPanelSettingsIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebardash;
