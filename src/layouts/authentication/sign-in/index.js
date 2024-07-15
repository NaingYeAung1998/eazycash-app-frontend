/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { setRole, setToken } from "services/storage";
import { postData } from "services/fetch";
import { apiStatus } from "services/enum";
import { authApiStatus } from "services/enum";
import { getToken } from "services/storage";
import SoftAlert from "components/SoftAlert";
import { Grid, InputAdornment } from "@mui/material";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const [redirectToIndex, setRedirectToIndex] = useState(false);

  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  useEffect(() => {
    redirectIfSignedIn();
  })

  const redirectIfSignedIn = async () => {
    var token = await getToken();
    if (token) {
      navigate('/earn')
    }
  }

  const handleLogin = async () => {
    if (username && password) {
      const url = "authentication/login"
      const body = {
        username: username,
        password: password
      }
      const response = await postData(url, body);
      if (response.ok) {
        if (response.data.status == apiStatus.success) {
          const data = response.data.data;
          if (data.statusCode == authApiStatus.success) {
            setToken(data.token);
            setRole(data.role);
            window.location.href = "/earn";
          }
        }
        else {
          if (response.data.data.statusCode == authApiStatus.incorrect) {
            setError("Incorrect Username or Password");
          }
        }
      } else {
        setError(response.message);
      }
    }
  }

  return (
    <CoverLayout
      title="Welcome back"
      description="Enter your username and password to sign in"
    // image={curved9}
    >
      <SoftBox component="form" role="form">
        {
          error != "" ?
            <SoftAlert color='error' style={{ fontSize: '12px' }}>{error}</SoftAlert>
            :
            <></>
        }
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Phone
            </SoftTypography>
          </SoftBox>
          <Grid direction={'row'} container>
            <Grid item flex={1}>
              <SoftInput type='text' disabled value="+959" width="10%" sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, color: 'grey' }}></SoftInput>
            </Grid>
            <Grid item flex={4}>
              <SoftInput type="text" placeholder="Phone" value={username} onChange={(e) => setUsername(e.target.value)} sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none' }} />
            </Grid>

          </Grid>
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </SoftBox>
        <SoftBox display="flex" alignItems="center">
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <SoftTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;Remember me
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={4} mb={1}>
          <SoftButton variant="gradient" color="info" onClick={() => handleLogin()} fullWidth>
            sign in
          </SoftButton>
        </SoftBox>
        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;
