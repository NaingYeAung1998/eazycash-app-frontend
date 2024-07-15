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

function Withdraw({ paymentMethods, withdrawableAmount, close, refresh }) {
    const [paymentMethod, setPaymentMethod] = useState({});
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState('');

    const handlePaymentChange = (value) => {
        setPaymentMethod(value);
    }

    const handleWithdraw = async () => {
        const url = 'user/wallet/withdraw';
        const body = {
            paymentMethodId: paymentMethod.value,
            amount: amount
        }
        const result = await postData(url, body);
        if (result.ok) {
            if (result.data.status == apiStatus.success) {
                refresh();
                close();
            } else {
                setError(result.data.message)
            }
        } else {
            setError(result.message);
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
                    options={paymentMethods.map((method, index) => {
                        return ({ label: `${method.paymentMethod.name} - ${method.accountNumber}`, value: method.id })
                    })}
                    onChange={(value) => handlePaymentChange(value)}
                />
            </SoftBox>
            <SoftBox mb={2}>
                <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                        {`Amount (Up to ${withdrawableAmount.toLocaleString()}) MMK`}
                    </SoftTypography>
                </SoftBox>
                <SoftInput type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </SoftBox>
            <SoftBox mt={4} mb={1}>
                <SoftButton variant="gradient" color="info" onClick={() => handleWithdraw()} fullWidth>
                    Withdraw
                </SoftButton>
            </SoftBox>
        </SoftBox>
    )
}

Withdraw.propTypes = {
    paymentMethods: PropTypes.array.isRequired,
    withdrawableAmount: PropTypes.any.isRequired,
    close: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired
};

export default Withdraw;