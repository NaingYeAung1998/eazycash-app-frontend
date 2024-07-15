import SoftButton from "components/SoftButton";
import { apiStatus } from "services/enum";
import { getData } from "services/fetch";

const { default: SoftAlert } = require("components/SoftAlert");
const { default: SoftBox } = require("components/SoftBox");
const { default: SoftInput } = require("components/SoftInput");
const { default: SoftTypography } = require("components/SoftTypography");
const { useState, useEffect } = require("react");
import Select from 'react-select';
import { postData } from "services/fetch";
import PropTypes from "prop-types";

function AddPaymentMethod({ close, refresh }) {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        getAvailablePaymentMethods();
    }, [])

    const getAvailablePaymentMethods = async () => {
        const url = "user/payment/getAvailablePaymentMethods?page=1&perPage=-1";
        const result = await getData(url);
        if (result.ok) {
            if (result.data.status == apiStatus.success) {
                let paginatedResult = result.data.data;
                let paymentMethodList = [];
                paginatedResult.data.map((payment, index) => {
                    paymentMethodList.push({ label: payment.name, value: payment.id });
                })
                setPaymentMethods(paymentMethodList);
            } else {

            }
        } else {
            setError(result.message);
        }
    }

    const handlePaymentChange = (value) => {
        setPaymentMethod(value);
    }

    const handleSave = async () => {
        console.log(paymentMethod);
        console.log(accountNumber)
        if (paymentMethod && accountNumber) {
            const url = 'user/wallet/addWalletPaymentMethod';
            const request = {
                paymentMethodId: paymentMethod.value,
                accountNumber: accountNumber
            }
            const result = await postData(url, request);
            if (result.ok) {
                if (result.data.status == apiStatus.success) {
                    refresh();
                    close();
                } else {
                    setError(result.data.message)
                }
            } else {
                setError(result.message)
            }
        } else {
            setError('Please fill all required fields')
        }

    }

    return (
        <SoftBox component="form" role="form" style={{ padding: '20px' }} width={{ xs: '280px', md: '350px', xl: '500px' }}>
            {
                error != "" ?
                    <SoftAlert color='error' style={{ fontSize: '12px' }}>{error}</SoftAlert>
                    :
                    <></>
            }
            <SoftBox mb={2}>
                <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                        Payment Method
                    </SoftTypography>
                </SoftBox>
                <Select
                    styles={{
                        control: (base) => ({ ...base, fontSize: '0.9rem' }),
                        menu: (base) => ({ ...base, fontSize: '0.9rem' })
                    }}

                    closeMenuOnSelect={true}
                    value={paymentMethod}
                    options={paymentMethods}
                    onChange={(value) => handlePaymentChange(value)}
                />
            </SoftBox>
            <SoftBox mb={2}>
                <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                        Account Number
                    </SoftTypography>
                </SoftBox>
                <SoftInput type="number" placeholder="09747683249" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </SoftBox>
            <SoftBox mt={4} mb={1}>
                <SoftButton variant="gradient" color="info" onClick={() => handleSave()} fullWidth>
                    Add
                </SoftButton>
            </SoftBox>
        </SoftBox>
    )
}

AddPaymentMethod.propTypes = {
    close: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired
};

export default AddPaymentMethod;