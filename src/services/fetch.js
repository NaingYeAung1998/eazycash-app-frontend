import { useNavigate } from 'react-router-dom';
import { getToken, removeRole, removeToken } from '../services/storage';

const apiurl = process.env.REACT_APP_API_URL;

export async function getData(url = '') {
    var token = await getToken();
    return await fetch(apiurl + url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + token,
            'cache-control': 'no-cache'
        }
    }).then(async (response) => {
        if (response.ok) {
            // you can call response.json() here too if you want to return json
            var data = [];
            if (response.status !== 204) {
                var promise = response.json();
                await promise.then(x => data = x);
            }
            return {
                ok: response.ok,
                status: response.status,
                data: data,
            }
        } else {
            //handle errors in the way you want to
            var message = '';
            switch (response.status) {
                case 401:
                    message = "Unauthorized"
                    removeToken();
                    removeRole();
                    window.location.href = "/authentication/sign-in"
                    break;
                case 404:
                    message = 'Object not found';
                    break;
                case 500:
                    message = 'Internal server error';
                    break;
                default:
                    message = 'Some error occured';
                    break;
            }
            return {
                ok: response.ok,
                status: response.status,
                data: message,
            }
        }
    }).then(json => json);
}

export async function postData(url = '', data = {}) {
    return await fetchData(url, data);
}

export async function putData(url = '', data = {}) {
    return await fetchData(url, data, 'PUT');
}

export async function deleteData(url = '', data = {}) {
    return await fetchData(url, data, 'DELETE');
}

export async function fetchData(url = '', data = {}, method = 'POST') {
    var token = await getToken();
    return await fetch(apiurl + url, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + token,
            'cache-control': 'no-cache',
            "Access-Control-Allow-Origin": "*",
            "Referrer-Policy": "no-referrer-when-downgrade"
        },
        body: JSON.stringify(data),
    }).then(async (response) => {
        var data = [];
        if (response.status !== 204) {
            var promise = response.json();
            await promise.then(x => data = x);
        }
        if (response.ok) {
            // you can call response.json() here too if you want to return json

            return {
                ok: response.ok,
                status: response.status,
                data: data,
            }
        } else {
            //handle errors in the way you want to
            var message = '';
            switch (response.status) {
                case 401:
                    message = "Access Denied"
                    break;
                case 403:
                    message = "Forbidden Access"
                    break;
                case 404:
                    message = 'Object not found';
                    break;
                case 500:
                    message = 'Internal server error';
                    break;
                default:
                    message = 'Some error occured';
                    break;
            }
            return {
                ok: response.ok,
                status: response.status,
                data: data != null && typeof data == 'string' ? data : message,
            }
        }
    }).then(json => json);
}