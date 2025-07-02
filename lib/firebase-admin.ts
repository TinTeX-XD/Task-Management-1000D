import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
}

// Initialize Firebase Admin
const adminApp =
  getApps().length === 0
    ? initializeApp(
        {
          credential: cert(firebaseAdminConfig),
        },
        "admin",
      )
    : getApps().find((app) => app.name === "admin")

export const adminAuth = getAuth(adminApp)
export default adminApp
