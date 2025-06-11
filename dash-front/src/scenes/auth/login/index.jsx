import { useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance"; // Instance avec token automatique
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Link as MuiLink,
  Alert
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      // 1. Récupérer le token
      const params = new URLSearchParams();
      params.append("username", formData.email);
      params.append("password", formData.password);

      const res = await axios.post("http://localhost:8000/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("token", res.data.access_token);

      // 2. Récupérer les infos user avec token
      const userRes = await axiosInstance.get("/users/me");

      // Stocker le rôle dans localStorage si besoin ailleurs
      localStorage.setItem("userRole", userRes.data.role);

      // 3. Redirection selon rôle
      if (userRes.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/importation");
      }
    } catch (err) {
      setError("Email ou mot de passe incorrect");
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
          boxShadow: theme.shadows[10],
        }}
      >
        <Typography
          variant="h3"
          textAlign="center"
          sx={{
            mb: 2,
            color: colors.grey[100],
          }}
        >
          Connexion
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: colors.grey[300],
              },
              "&:hover fieldset": {
                borderColor: colors.blueAccent[100],
              },
            },
            "& .MuiInputLabel-root": {
              color: colors.grey[300],
            },
          }}
          InputProps={{
            style: {
              color: colors.grey[100],
            },
          }}
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
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: colors.grey[300],
              },
              "&:hover fieldset": {
                borderColor: colors.blueAccent[100],
              },
            },
            "& .MuiInputLabel-root": {
              color: colors.grey[300],
            },
          }}
          InputProps={{
            style: {
              color: colors.grey[100],
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            mt: 2,
            p: 1.5,
            backgroundColor: colors.blueAccent[500],
            "&:hover": {
              backgroundColor: colors.blueAccent[400],
            },
          }}
        >
          Se connecter
        </Button>

        <Typography
          textAlign="center"
          sx={{
            mt: 2,
            color: colors.grey[100],
          }}
        >
          Pas encore de compte ?{" "}
          <MuiLink
            component={RouterLink}
            to="/register"
            sx={{
              color: colors.blueAccent[300],
              "&:hover": {
                color: colors.blueAccent[100],
              },
            }}
          >
            S'inscrire
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;


