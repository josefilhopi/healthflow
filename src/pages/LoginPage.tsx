"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Simulate API call for login
    if (values.email === "test@example.com" && values.password === "password") {
      login(values.email);
      navigate("/dashboard");
    } else {
      toast.error("Erro de login", {
        description: "E-mail ou senha inválidos. Tente novamente.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden mesh-gradient">
      {/* Adornos decorativos animados */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[15%] w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md glass p-10 rounded-[2rem] shadow-2xl relative z-10 animate-scale-in border-white/40">
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-extrabold tracking-tighter text-gradient">
            HealthFlow
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-foreground">
            Bem-vindo de volta
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">
            Acesse sua conta para continuar a gestão
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-foreground/70">E-mail corporativo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="nome@clinica.com" 
                      className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-foreground/70">Senha de acesso</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full py-7 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Autenticando..." : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Entrar no Sistema
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Novo por aqui?{" "}
            <Link to="#" className="text-primary font-bold hover:underline underline-offset-4">
              Solicite acesso agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}