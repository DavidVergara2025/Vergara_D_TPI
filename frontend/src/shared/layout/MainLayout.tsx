import React from 'react';
import { Navbar } from './Navbar';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors">
            <Navbar />
            <main>{children}</main>
        </div>
    );
};