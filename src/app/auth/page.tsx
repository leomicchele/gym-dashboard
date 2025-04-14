"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { postFetchLogin } from "@/lib/auth"
import { setLocalStorage } from "@/lib/storage"
import AuthRedirect from "@/components/AuthRedirect"

const loginSchema = z.object({
  email: z.string().email({
    message: "Ingresa un correo electrónico válido",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
})

const registerSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Ingresa un correo electrónico válido",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export default function AuthPage() {
  const router = useRouter()
  const [authType, setAuthType] = useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = useState(false)

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const response = await postFetchLogin({
        userName: values.email,
        password: values.password
      });
      
      if (response.login) {
        // Guardar la respuesta en localStorage
        setLocalStorage(response.user);
        // Redirigir al dashboard
        router.push("/dashboard");
      } else {
        // Mostrar error
        toast.error(response.message, {
          description: "Por favor verifica tus credenciales"
        });
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      toast.error("Error", {
        description: "Ocurrió un error al intentar iniciar sesión"
      });
    } finally {
      setIsLoading(false);
    }
  }

  function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    // Aquí iría la lógica de registro
    console.log(values)
    router.push("/dashboard")
  }

  return (
    <AuthRedirect>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Gym Dashboard</h1>
            <p className="mt-2 text-gray-600">
              {authType === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex space-x-2">
              <Button
                variant={authType === "login" ? "default" : "outline"}
                className="w-1/2 cursor-pointer"
                onClick={() => setAuthType("login")}
              >
                Iniciar sesión
              </Button>
              <Button
                variant={authType === "register" ? "default" : "outline"}
                className="w-1/2 cursor-pointer"
                onClick={() => setAuthType("register")}
              >
                Registrarse
              </Button>
            </div>
          </div>

          {authType === "login" ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input placeholder="correo@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Cargando..." : "Iniciar sesión"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input placeholder="correo@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full cursor-pointer">
                  Registrarse
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </AuthRedirect>
  )
} 