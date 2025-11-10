import React from 'react';
import { Activity, ChevronLeft } from 'lucide-react';

interface AuthScreenProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    onBack?: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ title, subtitle, children, onBack }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-amber-50 p-6 flex flex-col">
            <div className="flex-1 max-w-md mx-auto w-full flex flex-col">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="self-start mb-4 p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}

                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-center items-center space-x-2 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-purple-400 rounded-2xl flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <h1 className='bg-gradient-to-br from-rose-400 to-purple-400 text-transparent bg-clip-text text-4xl font-bold'>
                            FlowFit AI
                        </h1>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                        {subtitle && (
                            <p className="text-gray-600">{subtitle}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
