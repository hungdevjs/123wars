import admin from 'firebase-admin';

import environments from '../utils/environments.js';

const { SERVICE_ACCOUNT } = environments;
const serviceAccount = JSON.parse(SERVICE_ACCOUNT.replaceAll('\n', '\\n'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

export const firestore = admin.firestore();
