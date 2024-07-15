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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import PlaceholderCard from "examples/Cards/PlaceholderCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { getData } from "services/fetch";
import { useEffect, useState } from "react";
import { apiStatus } from "services/enum";
import { postData } from "services/fetch";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Earn() {

  const [advertisments, setAdvertisments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAvailableAdvertisments();
  }, [])

  const watchAdvertisment = async (advertismentId, amount, link) => {
    const url = "user/watch/watchAdvertisment";
    const request = {
      advertismentId: advertismentId,
      earnedAmount: amount
    }
    const result = await postData(url, request);
    if (result.ok) {
      if (result.data.status == apiStatus.success) {
        window.open(link);
        await getAvailableAdvertisments();
      } else {

      }
    } else {

    }
  }

  const getAvailableAdvertisments = async () => {
    const url = "user/watch/getAvailableAdvertisments";
    const result = await getData(url);
    if (result.ok) {
      if (result.data.status == apiStatus.success) {
        let paginatedResult = result.data.data;
        setAdvertisments(paginatedResult.data);
      }
    } else {
      if (result.status == 401 || result.status == 403) {
        navigate('/authentication/sign-in')
      }
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* <Header /> */}
      <SoftBox mb={3}>
        <Card>
          <SoftBox pt={2} px={2}>
            <SoftBox mb={0.5}>
              <SoftTypography variant="h6" fontWeight="medium">
                Today Projects
              </SoftTypography>
            </SoftBox>
            <SoftBox mb={1}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                Click and watch to earn
              </SoftTypography>
            </SoftBox>
          </SoftBox>
          <SoftBox p={2}>
            <Grid container spacing={3}>
              {
                advertisments.map((ad, index) =>
                  <Grid item xs={12} md={6} xl={3} key={ad.id}>
                    <DefaultProjectCard
                      key={ad.id}
                      image={ad.embedLink}
                      label={ad.title}
                      title={`${ad.amountPerWatch} MMK`}
                      description={ad.description}
                      link={ad.link}
                      available={ad.isAvailable}
                      watchAd={() => watchAdvertisment(ad.id, ad.amountPerWatch, ad.link)}
                      action={{
                        type: "internal",
                        route: "/pages/profile/profile-overview",
                        color: "info",
                        label: "view project",
                      }}
                      authors={[
                        { image: team1, name: "Elena Morison" },
                        { image: team2, name: "Ryan Milly" },
                        { image: team3, name: "Nick Daniel" },
                        { image: team4, name: "Peterson" },
                      ]}
                    />
                    <br />
                  </Grid>
                )
              }

            </Grid>
          </SoftBox>
        </Card>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Earn;
