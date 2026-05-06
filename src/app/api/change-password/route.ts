import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const PIN_PATTERN = /^\d{4}$/;
const RECENT_LOGIN_SECONDS = 10 * 60;

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        let decodedToken;

        try {
            decodedToken = await adminAuth.verifyIdToken(token);
        } catch {
            return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
        }

        const nowSeconds = Math.floor(Date.now() / 1000);
        if (!decodedToken.auth_time || nowSeconds - decodedToken.auth_time > RECENT_LOGIN_SECONDS) {
            return NextResponse.json({ error: "Recent login required" }, { status: 401 });
        }

        const requesterDoc = await adminDb.collection("usuarios").doc(decodedToken.uid).get();
        if (!requesterDoc.exists) {
            return NextResponse.json({ error: "User profile not found" }, { status: 403 });
        }

        const body = await req.json();
        const { newPin } = body;

        if (typeof newPin !== "string") {
            return NextResponse.json({ error: "Missing newPin" }, { status: 400 });
        }

        if (!PIN_PATTERN.test(newPin)) {
            return NextResponse.json({ error: "PIN must be 4 digits" }, { status: 400 });
        }

        const newPassword = `SCApp-${newPin}`;

        await adminAuth.updateUser(decodedToken.uid, {
            password: newPassword
        });

        return NextResponse.json({ success: true, message: "Password updated successfully" });

    } catch (error: any) {
        console.error("Change Password Error:", error);
        return NextResponse.json({
            error: "Internal Server Error"
        }, { status: 500 });
    }
}
