"use server";

import { FormState, LoginFormSchema } from "@/lib/definition";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";

export async function login(state: FormState, formData: FormData) {
  const validationFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validationFields.success) {
    return {
      errors: validationFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validationFields.data;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    return {
      errors: {
        password: ["Invalid credentials"],
      },
    }
  }

  await createSession({ email });


  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}