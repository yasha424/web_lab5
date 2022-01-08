import createAuth0Client from '@auth0/auth0-spa-js';
import { user, is_auth, popup_open, token } from './store';
import config from './auth-config';

async function createClient () {
    return await createAuth0Client({
        domain: DOMAIN,
        client_id: CLIENT_ID
    });
}

async function loginWithPopup (client, options) {
    popup_open.set(true);
    try {
        await client.loginWithPopup(options);
        user.set(await client.getUser());
        const access_token = await client.getIdTokenClaims();
        if (access_token) {
            token.set(access_token.__raw);
        }
        is_auth.set(true);
    } catch (e) {
        console.error(e);
        throw e[0].message;
    } finally {
        popup_open.set(false);
    }
}

function logout (client) {
    // is_auth.set(false);
    return client.logout();
}

const auth = {
    createClient, loginWithPopup, logout
};

export default auth;
