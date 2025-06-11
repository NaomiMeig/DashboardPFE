import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../theme";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useData } from "../../contexts/DataContext";
import Sidebardash from "../../components/Sidebardash";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import LineChart from "../../components/LineChart";

const Charts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const { uploadedData } = useData();

  const dataFromImport = location.state?.initialData;

  const [selectedXAxis, setSelectedXAxis] = useState(null);
  const [selectedYAxis, setSelectedYAxis] = useState(null);

  useEffect(() => {
    // Redirige si pas de données importées
    if (!dataFromImport) {
      navigate("/importation");
      return;
    }

    const { columns = [], numeric_columns = [] } = dataFromImport;
    setSelectedXAxis(columns[0] || "");
    setSelectedYAxis(numeric_columns[0] || "");
  }, [dataFromImport, navigate]);

  // Évite tout rendu si les données sont absentes
  if (!dataFromImport) {
    return (
      <Box p={4}>
        <Typography variant="h6">
          Aucune donnée trouvée. Veuillez importer un fichier d’abord.
        </Typography>
      </Box>
    );
  }

  const { data, columns = [], numeric_columns = [] } = dataFromImport;

  return (
    <Box display="flex">
      <Sidebardash />
      <Box flex="1" m="20px">
        <Header title="GRAPHIQUES" subtitle="Visualisation avancée des données" />

        {/* Sélections */}
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: "16px" }}>
          <Box display="flex" gap="20px" flexWrap="wrap">
            <FormControl fullWidth sx={{ minWidth: 150 }}>
              <InputLabel>Axe X</InputLabel>
              <Select
                value={selectedXAxis || ""}
                onChange={(e) => setSelectedXAxis(e.target.value)}
                label="Axe X"
              >
                {columns.map((col) => (
                  <MenuItem key={col} value={col}>
                    {col}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ minWidth: 150 }}>
              <InputLabel>Axe Y</InputLabel>
              <Select
                value={selectedYAxis || ""}
                onChange={(e) => setSelectedYAxis(e.target.value)}
                label="Axe Y"
              >
                {numeric_columns.map((col) => (
                  <MenuItem key={col} value={col}>
                    {col}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Graphiques */}
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
          {/* Line Chart */}
          <Box gridColumn="span 12" bgcolor={colors.primary[400]} p={2} borderRadius="16px">
            <Typography variant="h5" color={colors.grey[100]} mb={2}>
              Évolution des données
            </Typography>
            <Box height="400px">
              <LineChart data={data} xAxisKey={selectedXAxis} yAxisKey={selectedYAxis} />
            </Box>
          </Box>

          {/* Bar Chart */}
          <Box gridColumn="span 6" bgcolor={colors.primary[400]} p={2} borderRadius="16px">
            <Typography variant="h5" color={colors.grey[100]} mb={2}>
              Diagramme en barres
            </Typography>
            <Box height="400px">
              <BarChart data={data} xAxisKey={selectedXAxis} yAxisKey={selectedYAxis} />
            </Box>
          </Box>

          {/* Pie Chart */}
          <Box gridColumn="span 6" bgcolor={colors.primary[400]} p={2} borderRadius="16px">
            <Typography variant="h5" color={colors.grey[100]} mb={2}>
              Diagramme circulaire
            </Typography>
            <Box height="400px">
              <PieChart data={data} idKey={selectedXAxis} valueKey={selectedYAxis} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Charts;
