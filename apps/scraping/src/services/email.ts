import nodemailer from "nodemailer";
import type { PipelineOutput } from "../lib/scraperTypes";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function enviarCorreoAnalisis(
  email: string,
  resultado: PipelineOutput,
) {
  const { busqueda, fecha, total_empresas, mas_valorado, mas_criticado, analisis_tienda_base } = resultado;

  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1b1c1c;">Análisis Competitivo - ${busqueda.tema}</h2>
      <p style="color: #4f4441;">Ubicación: ${busqueda.ubicacion}</p>
      <p style="color: #4f4441;">Fecha: ${fecha}</p>
      <hr style="border: 1px solid #e4e2e2;" />

      <h3 style="color: #1b1c1c;">Resumen</h3>
      <p><strong>Competidores analizados:</strong> ${total_empresas}</p>

      <h4 style="color: #725950;">Lo más valorado del rubro</h4>
      <p style="color: #4f4441;">${mas_valorado}</p>

      <h4 style="color: #725950;">Lo más criticado del rubro</h4>
      <p style="color: #4f4441;">${mas_criticado}</p>
  `;

  if (analisis_tienda_base) {
    html += `
      <hr style="border: 1px solid #e4e2e2;" />
      <h3 style="color: #1b1c1c;">Tu tienda vs competencia</h3>

      <h4 style="color: #725950;">Comparación de precios</h4>
      <p style="color: #4f4441;">${analisis_tienda_base.comparacion_precios}</p>

      <h4 style="color: #725950;">Estado general</h4>
      <p style="color: #4f4441;">${analisis_tienda_base.comparacion_general}</p>

      <h4 style="color: #725950;">Conclusión</h4>
      <p style="color: #4f4441;"><strong>${analisis_tienda_base.conclusion}</strong></p>
    `;
  }

  html += `
      <hr style="border: 1px solid #e4e2e2;" />
      <p style="color: #817470; font-size: 12px;">
        Este análisis fue generado automáticamente por PymeTracker.
        Para ver los gráficos completos, ingresa a tu panel.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"PymeTracker" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Análisis ${busqueda.tema} en ${busqueda.ubicacion} - ${fecha}`,
      html,
    });
    console.log(`📧 Correo enviado a ${email}`);
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
}
