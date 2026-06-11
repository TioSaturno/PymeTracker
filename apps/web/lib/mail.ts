import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function sendPasswordResetEmail(
  to: string,
  resetLink: string,
): Promise<void> {
  if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
    console.log("========================================");
    console.log("RESET LINK (dev mode):");
    console.log(resetLink);
    console.log("========================================");
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@pymetracker.cl",
    to,
    subject: "PymeTracker — Restablece tu contraseña",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1b1c1c;">PymeTracker</h2>
        <p style="color: #4f4441;">Recibiste este correo porque solicitaste restablecer tu contraseña.</p>
        <a href="${resetLink}"
           style="display: inline-block; background: #725950; color: white; padding: 12px 24px;
                  border-radius: 12px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Restablecer contraseña
        </a>
        <p style="color: #817470; font-size: 12px;">El enlace expira en 1 hora. Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  });
}
