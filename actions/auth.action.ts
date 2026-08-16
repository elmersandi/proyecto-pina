"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// PASO 1: Enviar el correo y guardar el OTP temporal (Registro)
export async function enviarOTPRegistro(correo: string) {
  try {
    const adminExistente = await prisma.usuario.count({ where: { rol: "ADMIN" } });
    if (adminExistente >= 1) {
      return { success: false, error: "Ya existe un administrador en el sistema." };
    }

    const usuario = await prisma.usuario.findUnique({ where: { email: correo } });
    if (usuario && usuario.emailVerificado) {
      return { success: false, error: "Este correo ya está registrado y verificado." };
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    if (!usuario) {
      // Creamos un cascarón temporal del usuario
      const dummyPassword = await bcrypt.hash(Math.random().toString(), 10);
      await prisma.usuario.create({
        data: {
          email: correo,
          password: dummyPassword,
          rol: "ADMIN",
          otp: otpCode,
          otpExpires: expiracion,
          emailVerificado: false,
        }
      });
    } else {
      // Si ya existía el cascarón, actualizamos el OTP
      await prisma.usuario.update({
        where: { email: correo },
        data: { otp: otpCode, otpExpires: expiracion }
      });
    }

    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', 
      to: correo, 
      subject: 'Código de Validación - Proyecto Piña',
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #0f172a;">Validación de Registro</h2>
          <p style="color: #334155;">Tu código de seguridad de 4 dígitos es:</p>
          <h1 style="font-size: 40px; letter-spacing: 5px; color: #1e3a8a;">${otpCode}</h1>
          <p style="color: #64748b; font-size: 12px;">Este código expirará en 15 minutos.</p>
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error("Error en enviarOTPRegistro:", error);
    return { success: false, error: "Error al enviar el correo." };
  }
}

// PASO 2: Validar que los 4 dígitos sean correctos (Registro)
export async function verificarOTPInline(correo: string, codigo: string) {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email: correo } });
    
    if (!usuario || usuario.otp !== codigo) {
      return { success: false, error: "Código incorrecto." };
    }
    if (usuario.otpExpires && new Date() > usuario.otpExpires) {
      return { success: false, error: "El código expiró." };
    }

    // Limpiamos el OTP para que no se pueda reusar (Seguridad)
    await prisma.usuario.update({
      where: { email: correo },
      data: { emailVerificado: true, otp: null, otpExpires: null }
    });

    return { success: true };
  } catch (error) {
    console.error("Error en verificarOTPInline:", error);
    return { success: false, error: "Error al validar código." };
  }
}

// PASO 3: Guardar el nombre y contraseña finales (Registro)
export async function completarRegistroAdmin(datos: { correo: string; nombre: string; apellidos: string; password: string; }) {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email: datos.correo } });
    if (!usuario || !usuario.emailVerificado) {
      return { success: false, error: "Correo no verificado." };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(datos.password, salt);

    await prisma.usuario.update({
      where: { email: datos.correo },
      data: {
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        password: hashedPassword,
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error en completarRegistroAdmin:", error);
    return { success: false, error: "Error al crear la cuenta." };
  }
}

// PASO 4: Iniciar Sesión (Login)
export async function iniciarSesion(datos: { correo: string; password: string }) {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email: datos.correo } });

    // Mensaje genérico para no dar pistas a atacantes
    if (!usuario) {
      return { success: false, error: "Correo o contraseña incorrectos." };
    }

    const passwordValida = await bcrypt.compare(datos.password, usuario.password);
    if (!passwordValida) {
      return { success: false, error: "Correo o contraseña incorrectos." };
    }

    const cookieStore = await cookies(); 
    cookieStore.set("admin_session", usuario.id, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 días de sesión
    });

    return { success: true };
  } catch (error) {
    console.error("Error en iniciarSesion:", error);
    return { success: false, error: "Error al intentar iniciar sesión." };
  }
}

// PASO 5: Pedir cambio de contraseña (Link Mágico)
export async function solicitarRecuperacion(correo: string) {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email: correo } });
    
    if (!usuario) {
      return { success: false, error: "El correo ingresado no coincide con ningún administrador registrado." };
    }

    const token = randomUUID();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000); 

    await prisma.usuario.update({
      where: { email: correo },
      data: { otp: token, otpExpires: expiracion }
    });

    const enlace = `http://localhost:3000/restablecer?correo=${encodeURIComponent(correo)}&token=${token}`;

    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: correo,
      subject: 'Restablecer contraseña - Proyecto Piña',
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #0f172a;">Recuperación de contraseña</h2>
          <p style="color: #334155;">Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:</p>
          <a href="${enlace}" style="display: inline-block; padding: 12px 24px; background-color: #172554; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px;">Restablecer mi contraseña</a>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Este enlace expirará en 15 minutos.</p>
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error("Error en solicitarRecuperacion:", error);
    return { success: false, error: "Error al intentar enviar el correo de recuperación." };
  }
}

// PASO 6: Guardar la nueva contraseña (¡El paso que faltaba!)
export async function restablecerPassword(datos: { correo: string; codigo: string; nuevaPass: string }) {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email: datos.correo } });
    
    // Verificamos que el token coincida y no haya expirado
    if (!usuario || usuario.otp !== datos.codigo || (usuario.otpExpires && new Date() > usuario.otpExpires)) {
      return { success: false, error: "El enlace es inválido o ha expirado." };
    }

    // Encriptamos la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(datos.nuevaPass, salt);

    // Actualizamos la contraseña y destruimos el token para que no se pueda reusar
    await prisma.usuario.update({
      where: { email: datos.correo },
      data: { password: hashedPassword, otp: null, otpExpires: null }
    });

    return { success: true };
  } catch (error) {
    console.error("Error en restablecerPassword:", error);
    return { success: false, error: "Error al actualizar contraseña." };
  }
}


// PASO 7: Actualizar Perfil del Administrador
export async function actualizarPerfilAdmin(datos: { nombre: string; apellidos: string; passwordActual?: string; nuevaPassword?: string }) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    if (!sessionId) {
      return { success: false, error: "No autorizado. Inicia sesión nuevamente." };
    }

    const usuario = await prisma.usuario.findUnique({ where: { id: sessionId } });
    if (!usuario) {
      return { success: false, error: "Usuario no encontrado." };
    }

    let hashedPassword = usuario.password;

    // Si el usuario quiere cambiar la contraseña
    if (datos.nuevaPassword && datos.passwordActual) {
      const passValida = await bcrypt.compare(datos.passwordActual, usuario.password);
      if (!passValida) {
        return { success: false, error: "La contraseña actual es incorrecta." };
      }
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(datos.nuevaPassword, salt);
    }

    // Actualizamos los datos
    await prisma.usuario.update({
      where: { id: sessionId },
      data: {
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        password: hashedPassword,
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error en actualizarPerfilAdmin:", error);
    return { success: false, error: "Error al actualizar el perfil." };
  }
}

// PASO 8: Obtener los datos del usuario logueado para mostrarlos en el perfil
export async function obtenerPerfilAdmin() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    if (!sessionId) return null;

    const usuario = await prisma.usuario.findUnique({
      where: { id: sessionId },
      select: { nombre: true, apellidos: true, email: true, rol: true }
    });

    return usuario;
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return null;
  }
}

// PASO 9: Cerrar Sesión
export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}