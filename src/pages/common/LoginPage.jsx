import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { publicRequest } from '../../requestMethods';
import { useNavigate, Link, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook'
import { useSignIn } from "react-auth-kit";
const defaultTheme = createTheme();
import "./login.scss";
function LoginPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useSignIn();
  useEffect(() => {
    let token = Cookies.get('x-auth-token');
    if (token) {
      Cookies.remove('x-auth-token');
      localStorage.removeItem('userInfo')
    }
  }, []);

  const handleFacebookLogin = async () => {
    try {
      //window.location.href = 'http://localhost:8080/login/auth/facebook';
      window.location.href = 'https://toeic-app-backend-j1c5.onrender.com/login/auth/facebook';
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      //window.location.href = 'http://localhost:8080/login/auth/google';
      window.location.href = 'https://toeic-app-backend-j1c5.onrender.com/login/auth/google';
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="main-container">
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid className="left-logo" item xs={2} sm={3} md={7}>
            <div className="sapo-logo"></div>
          </Grid>

          <Grid
            className="right-side"
            item
            xs={8}
            sm={6}
            md={4}
            sx={{ my: 20, height: "60vh" }}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              className="form-box"
              sx={{
                my: 8,
                mx: 4,
                height: "25vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography className="form-title" component="h1" variant="h4">
                Đăng nhập <img />
              </Typography>
              <div style={{ marginTop: 20, fontStyle: 'italic' }}>Dễ dàng đăng nhập vào Toeic88 với tài khoản Google hoặc Facebook</div>
              <Box
                className="form-input-text"
                component="form"
                noValidate
                //onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <Button
                  //type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  style={{ background: '#DD4B39' }}
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleLogin}
                >
                  Đăng nhập bằng google
                </Button>
                <Button
                  //type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  style={{ background: '#3B5998' }}
                  startIcon={<FacebookIcon />}
                  onClick={handleFacebookLogin}
                >
                  Đăng nhập bằng Facebook
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default LoginPage;