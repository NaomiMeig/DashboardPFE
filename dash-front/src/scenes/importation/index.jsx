import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axiosInstance from "../api/axiosInstance";
import { useData } from "../../contexts/DataContext"; // Importez le contexte
import { useAuth } from "../../contexts/AuthContext";

const ImportData = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUploadedData } = useData(); // Utilisez le contexte
  const { token } = useAuth();
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Vérification de l'extension
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      setError("Format de fichier non supporté. Veuillez importer un fichier CSV ou Excel.");
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Prévisualisation simple (optionnelle)
    if (fileExtension === 'csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n').slice(0, 5);
        setPreviewData(lines);
      };
      reader.readAsText(selectedFile);
    } else {
      setPreviewData([]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;
      console.log("Réponse du backend:", result);

      if (!result.data || !result.columns || !result.numeric_columns) {
        throw new Error("Format de réponse inattendu du serveur");
      }

      // Stockez les données dans le contexte
      const formattedData = {
        data: result.data,
        columns: result.columns,
        numeric_columns: result.numeric_columns,
        stats: result.stats,
        row_count: result.row_count
      };

      setUploadedData(formattedData); // Sauvegarde dans le contexte

      navigate('/dashboard', { 
        state: { 
          initialData: formattedData // Passez aussi dans le state pour compatibilité
        }
      });

    } catch (error) {
      console.error("Erreur:", error);
      setError(error.response?.data?.detail || error.message || "Une erreur est survenue lors de l'import");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="IMPORTATION" subtitle="Importez vos données CSV ou Excel" />
      
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p="20px"
        backgroundColor={colors.primary[400]}
        borderRadius="4px"
        boxShadow="0 4px 8px rgba(0,0,0,0.1)"
      >
        <Typography variant="h5" mb="20px" color={colors.grey[100]}>
          Sélectionnez votre fichier
        </Typography>

        {error && (
          <Typography color="error" mb="10px">
            {error}
          </Typography>
        )}

        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            sx={{
              backgroundColor: colors.blueAccent[600],
              color: colors.grey[100],
              padding: "10px 20px",
              mb: "20px"
            }}
          >
            Choisir un fichier
          </Button>
        </label>

        {file && (
          <Typography color={colors.greenAccent[400]} mb="10px">
            Fichier sélectionné: {file.name}
          </Typography>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isLoading}
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
            padding: "10px 30px",
            '&:disabled': {
              backgroundColor: colors.grey[700],
              color: colors.grey[500]
            }
          }}
        >
          {isLoading ? "Traitement..." : "Analyser les données"}
        </Button>

        {previewData.length > 0 && (
          <Box mt="20px" width="100%">
            <Typography variant="h6" color={colors.grey[100]} mb="10px">
              Aperçu (5 premières lignes)
            </Typography>
            <Box
              p="10px"
              backgroundColor={colors.primary[500]}
              borderRadius="4px"
              maxHeight="200px"
              overflow="auto"
            >
              <pre style={{ margin: 0, color: colors.grey[100] }}>
                {previewData.join('\n')}
              </pre>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ImportData;