/* #region Token */
// Save token
export function setToken(value) {
    setPreferences('token', value);
}

// Get saved token
export function getToken() {
    return getPreferences('token');
}


// Remove saved token
export function removeToken() {
    removePreferences('token');
}
/* #endregion */

//Save current Tab
export function setTab(value){
    setPreferences('tab', value)
}

//Get current Tab
export function getTab(){
    return getPreferences('tab')
}

/* #region Role */
// Save Role
export function setRole(value) {
    setPreferences('role', value);
}

export function setLoginProvider(value){
    setPreferences('loginProvider', value);
}

export function removeLoginProvider(){
    removePreferences('loginProvider')
}

// Get saved Role
export function getRole() {
    var strRoles = getPreferences('role');
    if (strRoles) {
        var roles = strRoles.split(',');
        return roles.map(x => x.trim());
    } else
        return [];
}

export const isInRole = (role) => !!((getRole('role')).find(x => x.toString().toLowerCase() == role))

// Remove saved Role
export function removeRole() {
    removePreferences('role');
}
/* #endregion */

/* #region Preferences */
// Save preferences
export function setPreferences(key, value) {
    localStorage.setItem(key, value);
}

// Get saved preferences
export function getPreferences(key) {
    return localStorage.getItem(key);
}

// Remove saved preferences
export function removePreferences(key) {
    localStorage.removeItem(key);
}
/* #endregion */