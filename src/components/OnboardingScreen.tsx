import React from 'react';
import { Check } from 'lucide-react';
import { UserData } from '../types';

interface OnboardingScreenProps {
  setCurrentScreen: (screen: string) => void;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  handleOnboardingNext: () => void;
  handleOnboardingBack: () => void;
  onboardingScreens: {
    title: string;
    subtitle?: string;
    field: keyof UserData;
    type: 'text' | 'date' | 'options' | 'multiple';
    placeholder?: string;
    question?: string;
    options?: { value: string; label: string; icon: string; }[];
  }[];
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  setCurrentScreen,
  userData,
  setUserData,
  onboardingStep,
  setOnboardingStep,
  handleOnboardingNext,
  handleOnboardingBack,
  onboardingScreens,
}) => {
  const screen = onboardingScreens[onboardingStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-amber-50 p-6 flex flex-col">
      <div className="flex-1 max-w-md mx-auto w-full flex flex-col">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {onboardingScreens.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  idx <= onboardingStep ? 'bg-gradient-to-r from-rose-400 to-purple-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center">
            Passo {onboardingStep + 1} de {onboardingScreens.length}
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{screen.title}</h1>
            {screen.subtitle && (
              <p className="text-gray-600">{screen.subtitle}</p>
            )}
          </div>

          <div className="space-y-4">
            {screen.type === 'text' && (
              <input
                type="text"
                placeholder={screen.placeholder}
                value={userData[screen.field]}
                onChange={(e) => setUserData({ ...userData, [screen.field]: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-rose-400 outline-none text-lg"
              />
            )}

            {screen.type === 'date' && (
              <input
                type="date"
                value={userData[screen.field]}
                onChange={(e) => setUserData({ ...userData, [screen.field]: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-rose-400 outline-none text-lg"
              />
            )}

                          {screen.type === 'options' && screen.options && (
                            <div className="space-y-3">
                              {screen.options.map((option: any) => (
                                <button
                                  key={option.value}
                                  onClick={() => setUserData({ ...userData, [screen.field]: option.value })}
                                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                                    userData[screen.field] === option.value
                                      ? 'border-rose-400 bg-rose-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <span className="text-3xl">{option.icon}</span>
                                  <span className="font-semibold text-gray-800">{option.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
            {screen.type === 'multiple' && screen.options && (
              <div className="space-y-3">
                {screen.options.map((option: any) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      const current = (userData[screen.field] || []) as string[];
                      const newValue = current.includes(option.value)
                        ? current.filter((v: string) => v !== option.value)
                        : [...current, option.value];
                      setUserData({ ...userData, [screen.field]: newValue });
                    }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                      ((userData[screen.field] || []) as string[]).includes(option.value)
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="font-semibold text-gray-800 flex-1">{option.label}</span>
                    {((userData[screen.field] || []) as string[]).includes(option.value) && (
                      <Check className="w-6 h-6 text-rose-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          {onboardingStep > 0 && (
            <button
              onClick={handleOnboardingBack}
              className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all"
            >
              Voltar
            </button>
          )}
          <button
            onClick={handleOnboardingNext}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {onboardingStep === onboardingScreens.length - 1 ? 'Começar!' : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
