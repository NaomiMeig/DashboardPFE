import { useState } from 'react';
import { Box, Button, Typography, useTheme, Menu, MenuItem } from '@mui/material';
import { Link } from "react-router-dom";
import { tokens } from '../../theme';
import { DownloadOutlined } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ExportPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Données exemple - à remplacer par vos données réelles
  const data = [
    { id: 1, nom: 'Dupont', prénom: 'Jean', email: 'jean.dupont@example.com', valeur: 1250 },
    { id: 2, nom: 'Martin', prénom: 'Sophie', email: 'sophie.martin@example.com', valeur: 2340 },
    { id: 3, nom: 'Bernard', prénom: 'Luc', email: 'luc.bernard@example.com', valeur: 1890 },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Données");
    XLSX.writeFile(workbook, "export_donnees.xlsx");
    handleClose();
  };

  const exportToCSV = () => {
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(item => Object.values(item).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'export_donnees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(18);
    doc.text('Export des données', 14, 15);
    
    // Tableau
    doc.autoTable({
      head: [Object.keys(data[0])],
      body: data.map(item => Object.values(item)),
      startY: 25,
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: 'middle',
        halign: 'center',
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    doc.save('export_donnees.pdf');
    handleClose();
  };

  return (
    <Box m="20px">
      
      <Box
        mt={4}
        p={3}
        borderRadius={2}
        sx={{
          backgroundColor: colors.primary[400],
          boxShadow: theme.shadows[5]
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Options d'exportation
        </Typography>
        
        <Box>
          <Button
            variant="contained"
            startIcon={<DownloadOutlined />}
            onClick={handleClick}
            sx={{
              backgroundColor: colors.blueAccent[600],
              '&:hover': {
                backgroundColor: colors.blueAccent[700]
              }
            }}
          >
            Exporter les données
          </Button>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={exportToExcel}>Excel (.xlsx)</MenuItem>
            <MenuItem onClick={exportToCSV}>CSV (.csv)</MenuItem>
            <MenuItem onClick={exportToPDF}>PDF (.pdf)</MenuItem>
          </Menu>
        </Box>
        
        {/* Aperçu des données */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Aperçu des données
          </Typography>
          
          <Box
            sx={{
              maxHeight: '400px',
              overflow: 'auto',
              border: `1px solid ${colors.grey[100]}`,
              borderRadius: '4px',
              p: 2,
              backgroundColor: colors.primary[500]
            }}
          >
            <pre style={{ margin: 0 }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </Box>
        </Box>
      </Box>
      <Button 
        component={Link} 
        to="/data-analysis"
        variant="contained"
        sx={{ mt: 2 }}
      >
        Analyser les données exportées
      </Button>
    </Box>
  );
};

export default ExportPage;