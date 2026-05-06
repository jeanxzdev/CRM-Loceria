"use client";

import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginForm as LoginFormType } from "@/schemas/loginSchema";
import { useLogin } from "@/hooks/useLogin";

export default function LoginForm() {
    const { onSubmit, error, isLoading } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormType>({
        resolver: zodResolver(loginSchema),
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
        >
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    Loceria<span className="text-purple-600">Trujillo</span>
                </h1>
                <p className="text-slate-500">Inicia sesión para gestionar tu negocio</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-bold text-slate-700">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="tu@correo.com"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all"
                            />
                        </div>
                        {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-700">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all"
                            />
                        </div>
                        {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl flex justify-center font-bold shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Entrar"}
                    </button>
                </form>
            </div>
        </motion.div>
    );
}