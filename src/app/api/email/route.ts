import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, type, data } = body;

    console.log("Email notification triggered:", { to, subject, type });

    const emailTemplates: Record<string, { subject: string; body: string }> = {
      booking_confirmation: {
        subject: `Booking Confirmed - ${data?.serviceName || "IT Service"}`,
        body: `
          Dear ${data?.clientName || "Client"},
          
          Thank you for your booking request! We have received your request for ${data?.serviceName || "IT Service"}.
          
          Booking Details:
          - Service: ${data?.serviceName}
          - Estimated Cost: $${data?.totalPrice?.toLocaleString() || "TBD"}
          - Estimated Timeline: ${data?.estimatedTime || "TBD"} days
          
          Our team will review your request and get back to you within 24 hours.
          
          You can track your project status in your dashboard.
          
          Best regards,
          TechFlow Team
        `,
      },
      status_update: {
        subject: `Project Status Update - ${data?.serviceName || "Your Project"}`,
        body: `
          Dear ${data?.clientName || "Client"},
          
          Your project status has been updated to: ${data?.status?.replace("_", " ").toUpperCase()}
          
          ${data?.message || ""}
          
          Log in to your dashboard to see more details.
          
          Best regards,
          TechFlow Team
        `,
      },
      admin_new_request: {
        subject: `New Booking Request - ${data?.serviceName || "IT Service"}`,
        body: `
          A new booking request has been received.
          
          Client: ${data?.clientName}
          Email: ${data?.clientEmail}
          Service: ${data?.serviceName}
          Estimated Value: $${data?.totalPrice?.toLocaleString()}
          
          Please review the request in the admin dashboard.
        `,
      },
    };

    const template = emailTemplates[type] || {
      subject: subject || "TechFlow Notification",
      body: "You have a new notification from TechFlow.",
    };

    console.log("Email would be sent:", {
      to,
      subject: template.subject,
      body: template.body,
    });

    return NextResponse.json({
      success: true,
      message: "Email notification queued successfully",
      data: {
        to,
        subject: template.subject,
        type,
      },
    });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email notification" },
      { status: 500 }
    );
  }
}
