import { useState, useEffect } from "react";
import { Box, Typography, useTheme, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { tokens } from "../../theme";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebardash from "../../components/Sidebardash";
import GeographyChart from "../../components/GeographyChart";

const Map = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const dataFromImport = location.state?.initialData;
  
  const [countryColumn, setCountryColumn] = useState(null);
  const [valueColumn, setValueColumn] = useState(null);

  useEffect(() => {
    if (!dataFromImport) {
      navigate("/importation");
    } else {
      const { columns, numeric_columns } = dataFromImport;
      
      // Détection automatique de la colonne pays
      const detectCountryColumn = () => {
        const countryKeywords = ['country', 'pays', 'nation', 'état', 'state', 'code', 'iso', 'location'];
        const exactMatch = columns.find(col => 
          countryKeywords.includes(col.toLowerCase())
        );
        if (exactMatch) return exactMatch;
        
        const partialMatch = columns.find(col => 
          countryKeywords.some(keyword => col.toLowerCase().includes(keyword))
        );
        
        return partialMatch || columns[0];
      };

      setCountryColumn(detectCountryColumn());
      setValueColumn(numeric_columns?.[0] || null);
    }
  }, [dataFromImport, navigate]);

  if (!dataFromImport) return null;

  const { data } = dataFromImport;

  return (
    <Box display="flex">
      <Sidebardash />
      <Box flex="1" m="20px">
        <Header title="CARTE" subtitle="Visualisation géographique des données" />
        
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: "16px" }}>
          <Box display="flex" gap="20px" flexWrap="wrap">
            <FormControl fullWidth sx={{ minWidth: 150 }}>
              <InputLabel>Colonne Pays</InputLabel>
              <Select 
                value={countryColumn || ""} 
                onChange={(e) => setCountryColumn(e.target.value)}
                label="Colonne Pays"
              >
                {dataFromImport.columns.map((col) => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ minWidth: 150 }}>
              <InputLabel>Valeur</InputLabel>
              <Select
                value={valueColumn || ""}
                onChange={(e) => setValueColumn(e.target.value)}
                label="Valeur"
              >
                {dataFromImport.numeric_columns.map((col) => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <Box bgcolor={colors.primary[400]} p={2} borderRadius="16px" height="75vh">
          <Typography variant="h5" color={colors.grey[100]} mb={2}>
            Répartition géographique
          </Typography>
          <Box height="calc(100% - 40px)">
            {countryColumn && valueColumn && (
              <GeographyChart 
                data={data} 
                countryKey={countryColumn} 
                valueKey={valueColumn} 
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Map;