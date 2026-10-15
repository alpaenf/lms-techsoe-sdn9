import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TabPenilaian from '@/Pages/ELearning/Partials/TabPenilaian';

export default function PenilaianIndex(props) {
    return (
        <AuthenticatedLayout user={props.auth?.user}>
            <Head title={`Buku Nilai Siswa - UPT SDN 9 Gandangbatu Sillanan`} />

            <div className="py-6 sm:py-8 max-w-[98%] mx-auto px-2 sm:px-4">
                <TabPenilaian {...props} />
            </div>
        </AuthenticatedLayout>
    );
}
