import "server-only";
import admin from 'firebase-admin';
import { App, getApps, initializeApp, cert } from 'firebase-admin/app';
import * as fs from 'fs';
import * as path from 'path';

// Prevent multiple initializations in development
const getFirebaseAdminApp = (): App => {
    const apps = getApps();
    if (apps.length > 0) {
        return apps[0];
    }

    try {
        // Method 1: Environment Variable (Production/Best Practice)
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            return initializeApp({
                credential: cert(serviceAccount)
            });
        }

        // Method 2: Local File (Development)
        const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
        if (fs.existsSync(serviceAccountPath)) {
            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            return initializeApp({
                credential: cert(serviceAccount)
            });
        }
    } catch (error) {
        console.error("Firebase Admin Initialization Error:", error);
    }

    // Fallback or error if no credentials found (will likely fail on usage)
    console.warn("⚠️ Firebase Admin initialized without credentials! Admin features may fail.");
    return initializeApp();
};

export const adminApp = getFirebaseAdminApp();
export const adminAuth = admin.auth(adminApp);
export const adminDb = admin.firestore(adminApp);
