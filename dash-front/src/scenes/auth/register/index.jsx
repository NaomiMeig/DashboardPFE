import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Link as MuiLink,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../../theme";

const Register = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // ou "admin"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/register", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setMessage(res.data.message);
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Erreur lors de l'inscription");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: colors.primary[400],
        p: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
          maxWidth: 450,
          p: 4,
          borderRadius: 2,
          backgroundColor:
            theme.palette.mode === "dark"
              ? colors.primary[600]
              : colors.primary[50],
          boxShadow: theme.shadows[3],
          border: `1px solid ${colors.grey[200]}`,
        }}
      >
        <Typography variant="h3" textAlign="center" sx={{ mb: 2, color: colors.grey[100] }}>
          Créer un compte
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          InputProps={{ style: { color: colors.grey[100] } }}
          InputLabelProps={{ style: { color: colors.grey[300] } }}
        />

        <TextField
          fullWidth
          variant="outlined"
          label="Mot de passe"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          InputProps={{ style: { color: colors.grey[100] } }}
          InputLabelProps={{ style: { color: colors.grey[300] } }}
        />

        <TextField
          fullWidth
          variant="outlined"
          label="Confirmer le mot de passe"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          InputProps={{ style: { color: colors.grey[100] } }}
          InputLabelProps={{ style: { color: colors.grey[300] } }}
        />

        <TextField
          select
          fullWidth
          label="Rôle"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          InputProps={{ style: { color: colors.grey[100] } }}
          InputLabelProps={{ style: { color: colors.grey[300] } }}
        >
          <MenuItem value="user">Utilisateur</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        {message && (
          <Typography color="error" textAlign="center">
            {message}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            mt: 2,
            p: 1.5,
            backgroundColor: colors.blueAccent[500],
            color: "white",
            "&:hover": {
              backgroundColor: colors.blueAccent[400],
            },
          }}
        >
          S'inscrire
        </Button>

        <Typography textAlign="center" sx={{ mt: 2, color: colors.grey[100] }}>
          Déjà un compte ?{" "}
          <MuiLink
            component={RouterLink}
            to="/login"
            sx={{
              color: colors.blueAccent[300],
              "&:hover": { color: colors.blueAccent[100] },
            }}
          >
            Se connecter
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
