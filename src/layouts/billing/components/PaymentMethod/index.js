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
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React base styles
import borders from "assets/theme/base/borders";

// Images
import kpayLogo from "assets/images/logos/kpay.png";
import wavepayLogo from "assets/images/logos/wavepay.png";
import { Dialog, DialogTitle, Modal } from "@mui/material";
import SoftInput from "components/SoftInput";
import AddPaymentMethod from "./add";
import { useEffect, useState } from "react";
import { getData } from "services/fetch";
import { apiStatus } from "services/enum";
import PropTypes from "prop-types";

function PaymentMethod({ paymentMethods }) {
  const { borderWidth, borderColor } = borders;
  const [addPaymetMethodModal, setAddPaymentMethodModal] = useState(false);
  const [walletPaymentMethods, setWalletPaymentMethods] = useState(paymentMethods);
  const [error, setError] = useState('');

  useEffect(() => {
  }, [])

  const getWalletPaymentMethods = async () => {
    const url = 'user/wallet/getWalletPaymentMethods';
    const result = await getData(url);
    if (result.ok) {
      if (result.data.status == apiStatus.success) {
        setWalletPaymentMethods(result.data.data);
      }
    } else {
      setError(result.message);
    }
  }

  return (
    <Card id="delete-account">
      <SoftBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <SoftTypography variant="h6" fontWeight="medium">
          Payment Method
        </SoftTypography>
        <SoftButton variant="gradient" color="dark" onClick={() => setAddPaymentMethodModal(true)}>
          <Icon sx={{ fontWeight: "bold" }}>add</Icon>
          &nbsp;add
        </SoftButton>
      </SoftBox>
      <SoftBox p={2}>
        <Grid container spacing={3}>
          {
            walletPaymentMethods.length > 0
              ?
              walletPaymentMethods.map((payment, index) =>
                <Grid item xs={12} md={6} key={payment.id}>
                  <SoftBox
                    border={`${borderWidth[1]} solid ${borderColor}`}
                    borderRadius="lg"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={3}
                  >
                    <SoftBox component="img" src={payment.paymentMethod.name.toLowerCase() == "kbz pay" ? kpayLogo : wavepayLogo} alt="master card" width="10%" mr={2} />
                    <SoftTypography variant="h6" fontWeight="medium">
                      {payment.accountNumber}
                    </SoftTypography>
                    <SoftBox ml="auto" lineHeight={0}>
                      <Tooltip title="Edit Account" placement="top">
                        <Icon sx={{ cursor: "pointer" }} fontSize="small">
                          edit
                        </Icon>
                      </Tooltip>
                    </SoftBox>
                  </SoftBox>
                </Grid>
              )
              :
              <Grid item xs={12} md={6}>
                <SoftBox component="ul"
                  display="flex"
                  flexDirection="column"
                  p={0}
                  m={0}
                  sx={{ listStyle: "none" }}>
                  <SoftTypography
                    variant="caption"
                    color="text"
                    fontWeight="bold"
                    textTransform="uppercase"
                    align='center'
                  >
                    No Payment Method Yet
                  </SoftTypography>
                </SoftBox>

              </Grid>

          }
        </Grid>
      </SoftBox>
      <Dialog open={addPaymetMethodModal} onClose={() => setAddPaymentMethodModal(false)}>
        <DialogTitle>Payment Method</DialogTitle>
        <AddPaymentMethod close={() => setAddPaymentMethodModal(false)} refresh={() => getWalletPaymentMethods()} />
      </Dialog>
    </Card>
  );
}

PaymentMethod.propTypes = {
  paymentMethods: PropTypes.array.isRequired
}

export default PaymentMethod;
