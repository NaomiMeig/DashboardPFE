import { useState } from "react";
import { useLocation, Link } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import "react-pro-sidebar/dist/css/styles.css";
import UserHistory from "../components/UserHistory";

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
  const userRole = localStorage.getItem("userRole");

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        "& .pro-sidebar": {
          height: "100%",
          width: isCollapsed ? "80px" : "250px",
          minWidth: isCollapsed ? "80px" : "250px",
        },
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "8px 35px 8px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: `${colors.greenAccent[500]} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${colors.greenAccent[500]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* Logo et bouton de menu */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "space-between",
              padding: isCollapsed ? "10px" : "15px",
            }}
          >
            {!isCollapsed && (
              <Typography variant="h3" color={colors.grey[100]}>
                Tableau
              </Typography>
            )}
            {!isCollapsed && <MenuOutlinedIcon />}
          </MenuItem>

          {/* Menu principal */}
          <Box 
            sx={{ 
              flex: 1,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: colors.greenAccent[500],
                borderRadius: "2px",
              },
            }}
          >
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
                state={{ initialData: location.state?.initialData }}
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
            </Box>
          </Box>

          {/* Historique utilisateur */}
          {!isCollapsed && (
            <Box 
              sx={{ 
                borderTop: `1px solid ${colors.grey[800]}`,
                padding: "15px",
                marginTop: "auto" // Pousse vers le bas
              }}
            >
              <UserHistory />
            </Box>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebardash;

