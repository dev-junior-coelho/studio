import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const PIN_PATTERN = /^\d{4}$/;

export async function POST(req: NextRequest) {
    try {
        // 1. Authorization Check
        // Expecting "Authorization: Bearer <token>"
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        let decodedToken;

        try {
            decodedToken = await adminAuth.verifyIdToken(token);
        } catch (e) {
            return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
        }

        const requesterDoc = await adminDb.collection("usuarios").doc(decodedToken.uid).get();
        const requesterData = requesterDoc.data();

        if (!requesterDoc.exists || requesterData?.role !== 'supervisor') {
            return NextResponse.json({ error: "Forbidden: Only Supervisors can reset passwords." }, { status: 403 });
        }

        // 2. Parse Body
        const body = await req.json();
        const { targetUid, newPin } = body;

        if (typeof targetUid !== "string" || typeof newPin !== "string") {
            return NextResponse.json({ error: "Missing targetUid or newPin" }, { status: 400 });
        }

        if (!PIN_PATTERN.test(newPin)) {
            return NextResponse.json({ error: "PIN must be 4 digits" }, { status: 400 });
        }

        const targetDoc = await adminDb.collection("usuarios").doc(targetUid).get();
        if (!targetDoc.exists) {
            return NextResponse.json({ error: "Target user not found" }, { status: 404 });
        }

        // 3. Reset Password
        // Construct standard password format: "SCApp-" + PIN
        const newPassword = `SCApp-${newPin}`;

        await adminAuth.updateUser(targetUid, {
            password: newPassword
        });

        console.log(`Password reset for user ${targetUid} by supervisor ${requesterData.nome}`);

        return NextResponse.json({ success: true, message: "Password updated successfully" });

    } catch (error: any) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({
            error: "Internal Server Error"
        }, { status: 500 });
    }
}
