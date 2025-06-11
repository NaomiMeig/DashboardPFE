import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";
import { motion } from "framer-motion";

const StatBox = ({ title = "", subtitle = "", icon, progress = 0, increase = "" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Box
        p="20px"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Partie haute : icône et titre */}
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box mb={{ xs: "10px", sm: 0 }}>
            {icon}
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: colors.grey[100], mt: "8px" }}
            >
              {title}
            </Typography>
          </Box>
          <ProgressCircle progress={progress} />
        </Box>

        {/* Partie basse : sous-titre et pourcentage */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt="20px"
          flexWrap="wrap"
          gap="10px"
        >
          <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
            {subtitle}
          </Typography>
          <Typography variant="h5" fontStyle="italic" sx={{ color: colors.greenAccent[600] }}>
            {increase}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default StatBox;
