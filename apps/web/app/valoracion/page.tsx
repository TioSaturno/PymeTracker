'use client';

import {
    LayoutGrid, Users, TrendingUp, MessageSquareMore, Search,
    Bell, Settings, CircleUser, RefreshCw, Star, Building2, ChartNoAxesCombined
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
    const [datos, setDatos] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [filtro, setFiltro] = useState<'ambos' | 'mi_negocio' | 'competencia'>('ambos');

    const router = useRouter();

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/valoracion');

            if (res.status === 401) {
                router.push('/');
                return;
            }

            const json = await res.json();
            if (json.error) throw new Error(json.error);

            setDatos(json.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    if (loading) return <div className="p-10 text-center flex flex-col items-center justify-center h-screen"><RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" /> Cargando análisis...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;
    if (!datos) return <div className="p-10 text-center">No hay datos disponibles.</div>;

    const miNegocio = datos.mi_negocio;
    const competidores = datos.competencia || [];
    const competenciaPrincipal = competidores[0];


    let resenasMostradas = [];

    if (filtro === 'ambos' || filtro === 'mi_negocio') {
        const misResenas = (miNegocio.calificaciones?.ultimas_resenas || [])
            .slice(0, 10)
            .map((texto: string) => ({ texto, esPropio: true, nombre: miNegocio.nombre }));
        resenasMostradas.push(...misResenas);
    }

    if ((filtro === 'ambos' || filtro === 'competencia') && competenciaPrincipal) {
        const resenasCompetencia = (competenciaPrincipal.calificaciones?.ultimas_resenas || [])
            .slice(0, 10)
            .map((texto: string) => ({ texto, esPropio: false, nombre: competenciaPrincipal.nombre }));
        resenasMostradas.push(...resenasCompetencia);
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">

            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
                <h1 className="text-xl font-semibold text-slate-900">PymeTracker</h1>
                <div className="flex items-center w-full max-w-md bg-slate-100 rounded-full h-10 px-4">
                    <Search className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0" />
                    <input type="text" placeholder="Buscar..." className="w-full bg-transparent text-sm outline-none border-none" />
                </div>
                <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-slate-500 hover:text-slate-700 cursor-pointer" />
                    <Settings className="h-5 w-5 text-slate-500 ml-2 hover:text-slate-700 cursor-pointer" />
                    <CircleUser className="h-5 w-5 text-slate-500 ml-2 hover:text-slate-700 cursor-pointer" />
                </div>
            </header>

            <div className="flex flex-1">
                <aside className="w-64 bg-white border-r border-slate-200 p-5 flex flex-col gap-y-10">
                    <div className="bg-slate-950 p-4 rounded-xl flex items-start gap-x-3 text-white">
                        <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center font-bold">{miNegocio.nombre[0]}</div>
                        <div>
                            <div className="font-semibold text-sm truncate w-32">{miNegocio.nombre}</div>
                            <div className="text-xs text-slate-400 text-nowrap">Análisis Real-time</div>
                        </div>
                    </div>
                    <nav className="flex-1 space-y-2">
                        <a href="#" className="flex items-center gap-x-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 transition"><LayoutGrid className="h-5 w-5" /> Inicio</a>
                        <a href="/analisis" className="flex items-center gap-x-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 transition"><ChartNoAxesCombined className="h-5 w-5" /> Graficas</a>
                        <a href="/valoracion" className="flex items-center gap-x-3 rounded-lg px-3 py-2 bg-white border text-slate-950 font-semibold shadow-sm transition"><MessageSquareMore className="h-5 w-5 text-blue-600" /> Reseñas</a>
                    </nav>
                </aside>

                <main className="flex-1 p-10 bg-slate-50">
                    <div className="max-w-5xl mx-auto">

                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Análisis de {miNegocio.nombre}</h2>
                                <p className="text-slate-500 text-sm italic">Basado en el último reporte generado ({new Date(datos.fecha_analisis).toLocaleDateString()})</p>
                            </div>
                            <button onClick={cargarDatos} className="bg-slate-950 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium hover:bg-slate-800 transition">
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </button>
                        </div>


                        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 flex flex-col md:flex-row gap-8 shadow-sm">


                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg"><Building2 className="h-6 w-6 text-blue-600" /></div>
                                        <h3 className="text-lg font-bold">Mi Negocio</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-bold text-amber-600">{miNegocio.calificaciones?.rating || '0.0'}</span>
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Rating Google</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 font-bold uppercase mb-4">Total Reseñas: {miNegocio.calificaciones?.total_resenas || 0}</p>


                                <div className="space-y-3">
                                    {datos.mas_valorado && (
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Fortalezas</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(typeof datos.mas_valorado === 'string'
                                                    ? datos.mas_valorado.split(/[.,] y |[.,]/).filter(Boolean).slice(0, 5)
                                                    : Array.isArray(datos.mas_valorado) ? datos.mas_valorado : []
                                                ).map((item: string, i: number) => (
                                                    <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-semibold rounded-full border border-green-100 uppercase">{item.trim()}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {datos.mas_criticado && (
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Debilidades</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(typeof datos.mas_criticado === 'string'
                                                    ? datos.mas_criticado.split(/[.,] y |[.,]/).filter(Boolean).slice(0, 5)
                                                    : Array.isArray(datos.mas_criticado) ? datos.mas_criticado : []
                                                ).map((item: string, i: number) => (
                                                    <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 text-[10px] font-semibold rounded-full border border-red-100 uppercase">{item.trim()}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="hidden md:block w-px bg-slate-200"></div>


                            <div className="flex-1">
                                {competenciaPrincipal ? (
                                    <>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-lg"><Users className="h-6 w-6 text-slate-700" /></div>
                                                <h3 className="text-lg font-bold truncate max-w-[200px]" title={competenciaPrincipal.nombre}>{competenciaPrincipal.nombre}</h3>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-3xl font-bold text-slate-700">{competenciaPrincipal.calificaciones?.rating || '0.0'}</span>
                                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Competencia</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-4">Total Reseñas: {competenciaPrincipal.calificaciones?.total_resenas || 0}</p>


                                        <div className="space-y-3">
                                            {datos.mas_valorado && (
                                                <div>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Fortalezas</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(typeof datos.mas_valorado === 'string'
                                                            ? datos.mas_valorado.split(/[.,] y |[.,]/).filter(Boolean).slice(2, 5)
                                                            : []
                                                        ).map((item: string, i: number) => (
                                                            <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-semibold rounded-full border border-green-100 uppercase">{item.trim()}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {datos.mas_criticado && (
                                                <div>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Debilidades</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(typeof datos.mas_criticado === 'string'
                                                            ? datos.mas_criticado.split(/[.,] y |[.,]/).filter(Boolean).slice(1, 4)
                                                            : []
                                                        ).map((item: string, i: number) => (
                                                            <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 text-[10px] font-semibold rounded-full border border-red-100 uppercase">{item.trim()}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <p className="text-slate-400 italic text-sm">No hay competidores analizados.</p>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Feed de Análisis Real</h3>
                            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                <button
                                    onClick={() => setFiltro('ambos')}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${filtro === 'ambos' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Ambos
                                </button>
                                <button
                                    onClick={() => setFiltro('mi_negocio')}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${filtro === 'mi_negocio' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Mi Negocio
                                </button>
                                <button
                                    onClick={() => setFiltro('competencia')}
                                    disabled={!competenciaPrincipal}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${filtro === 'competencia' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'} ${!competenciaPrincipal ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Competencia
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {resenasMostradas.length > 0 ? (
                                resenasMostradas.map((resena, index) => (
                                    <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4 hover:border-slate-300 transition shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-200">G</div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 text-sm">Reseña de Google Maps</h4>
                                                    <p className="text-xs text-slate-500">
                                                        {resena.esPropio ? 'Tu negocio' : 'Competencia'} • {resena.nombre}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${resena.esPropio ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                    {resena.esPropio ? 'Mi Negocio' : 'Competencia'}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">Vía Google Maps</span>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed italic">
                                            "{resena.texto}"
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-white border border-dashed border-slate-300 rounded-xl">
                                    <p className="text-slate-500">No hay reseñas para mostrar con el filtro actual.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}