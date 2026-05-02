import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

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

        const body = await req.json();
        const { newPin } = body;

        if (!newPin) {
            return NextResponse.json({ error: "Missing newPin" }, { status: 400 });
        }

        if (newPin.length !== 4 || isNaN(Number(newPin))) {
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
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}
