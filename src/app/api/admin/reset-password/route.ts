import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

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

        // Optional: Verify if the requester is actually a Supervisor in Firestore
        // For now, we trust the verified token allows access, assuming the UI protects this route
        // and we verify the requester's role:
        const requesterDoc = await adminDb.collection("usuarios").doc(decodedToken.uid).get();
        const requesterData = requesterDoc.data();

        if (requesterData?.role !== 'supervisor') {
            return NextResponse.json({ error: "Forbidden: Only Supervisors can reset passwords." }, { status: 403 });
        }

        // 2. Parse Body
        const body = await req.json();
        const { targetUid, newPin } = body;

        if (!targetUid || !newPin) {
            return NextResponse.json({ error: "Missing targetUid or newPin" }, { status: 400 });
        }

        if (newPin.length !== 4 || isNaN(Number(newPin))) {
            return NextResponse.json({ error: "PIN must be 4 digits" }, { status: 400 });
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
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}
