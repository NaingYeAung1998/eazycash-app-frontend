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

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React components
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Billing page components
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import { useEffect, useState } from "react";
import { getData } from "services/fetch";
import { apiStatus } from "services/enum";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle } from "@mui/material";
import Withdraw from "./components/Transactions/withdraw";

function Billing() {
  const [wallet, setWallet] = useState({ walletPaymentMethods: [], walletNumber: 1111111111111111, balance: 0, walletTransactions: [] });
  const [error, setError] = useState('');
  const [withdrawModal, setWithdrawModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getWalletInfo();
  }, [])


  const getWalletInfo = async () => {
    const url = 'user/wallet/getWalletInfo';
    const result = await getData(url);
    if (result.ok) {
      if (result.data.status == apiStatus.success) {
        setWallet(result.data.data);
      } else {
        setError(result.data.message)
      }
    } else {
      setError(result.message);
    }
  }

  const getWalletTransactions = async () => {
    const url = 'user/wallet/getWalletTransactions';
    const result = await getData(url);
    if (result.ok) {
      if (result.data.status == apiStatus.success) {
        let walletObject = wallet;
        walletObject.walletTransactions = result.data.data;
        setWallet(walletObject);
      }
    } else {
      setError(result.message)
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={4}>
        <SoftBox mb={1.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} xl={6}>
                  <MasterCard number={wallet.walletNumber} holder={wallet.name} expires={moment(wallet.expiryDate).format("YYYY/MM/DD")} />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="account_balance"
                    title="Balance"
                    description=""
                    value={`${wallet.balance.toLocaleString()} MMK`}
                    btnLabel='Earn'
                    btnAction={() => navigate('/earn')}
                    isEnabled={true}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="account_balance_wallet"
                    title="Withdrawable Amount"
                    description=""
                    value={wallet.balance > process.env.REACT_APP_WITHDRAW_LIMIT ? `${wallet.balance.toLocaleString()} MMK` : `0 MMK`}
                    btnLabel='Withdraw'
                    isEnabled={wallet.balance > process.env.REACT_APP_WITHDRAW_LIMIT}
                    btnAction={() => setWithdrawModal(true)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PaymentMethod paymentMethods={wallet.walletPaymentMethods} key={wallet.id} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Transactions transactions={wallet.walletTransactions} key={wallet.id} />

            </Grid>
          </Grid>
        </SoftBox>
        {/* <SoftBox my={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
            <Invoices />
            </Grid>
          </Grid>
        </SoftBox> */}
        <Dialog open={withdrawModal} onClose={() => setWithdrawModal(false)}>
          <DialogTitle>Withdraw</DialogTitle>
          <Withdraw close={() => setWithdrawModal(false)} refresh={() => getWalletInfo()} paymentMethods={wallet.walletPaymentMethods} withdrawableAmount={wallet.balance} />
        </Dialog>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
