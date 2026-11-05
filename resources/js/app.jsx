import React from 'react';
import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.warn('UI Conflict detected (often caused by browser auto-translate):', error, errorInfo);
        if (error?.message?.includes('insertBefore') || error?.message?.includes('removeChild')) {
            const lastReload = sessionStorage.getItem('last_dom_conflict_reload');
            const now = Date.now();
            if (!lastReload || now - Number(lastReload) > 10000) {
                sessionStorage.setItem('last_dom_conflict_reload', String(now));
                window.location.reload();
            }
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-md w-full space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
                            ⚠️
                        </div>
                        <h3 className="text-base font-bold text-slate-800">Menyinkronkan Tampilan</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Terjadi konflik DOM peramban (biasanya akibat fitur terjemahan otomatis browser). Klik tombol di bawah untuk memuat ulang.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="w-full py-2.5 rounded-xl bg-[#800020] hover:bg-[#5C0017] text-white text-xs font-bold transition shadow-sm"
                        >
                            Muat Ulang Halaman
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const appName = import.meta.env.VITE_APP_NAME || 'UPT SDN 9 Gandangbatu Sillanan';

createInertiaApp({
    title: (title) => {
        if (!title || title === appName || title.includes(appName)) {
            return title || appName;
        }
        return `${title} - ${appName}`;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <GlobalErrorBoundary>
                <App {...props} />
            </GlobalErrorBoundary>
        );
    },
    progress: {
        color: '#800020',
    },
});
