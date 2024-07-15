export const apiStatus = Object.freeze({ "success": 0, "fail": 1 })
export const authApiStatus = Object.freeze({ "success": 0, "incorrect": 1, "unavailableUsername": 2, "unavailablePassword": 3, "passwordsNotMatch": 4, "userNotFound": 5 })
export const transactionType = Object.freeze({ "deposit": 0, "withdraw": 1 });
export const transactionStatus = ['Pending', 'Approved', 'Rejected'];
export const transactionStatusColor = ['warning', 'success', 'approved'];