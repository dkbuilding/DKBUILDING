import { Check } from "lucide-react";

const ContactStepProgress = ({ currentStep, steps }) => {
  return (
    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-6 xs:mb-8 space-y-4 xs:space-y-0">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`w-10 h-10 xs:w-11 xs:h-11 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
              currentStep >= step.id
                ? "bg-dk-yellow text-dk-black"
                : "bg-dk-gray-800 text-dk-gray-400"
            }`}
            aria-current={currentStep === step.id ? "step" : undefined}
          >
            {currentStep > step.id ? (
              <Check className="w-5 h-5" />
            ) : (
              step.id
            )}
          </div>
          <div className="ml-3">
            <div
              className={`text-sm font-medium ${
                currentStep >= step.id
                  ? "text-white"
                  : "text-dk-gray-400"
              }`}
            >
              {step.title}
            </div>
            <div className="text-xs text-dk-gray-500 hidden xs:block">
              {step.description}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`hidden xs:block flex-1 min-w-[1rem] xs:min-w-[2rem] h-0.5 mx-2 xs:mx-4 transition-colors duration-200 ${
                currentStep > step.id
                  ? "bg-dk-yellow"
                  : "bg-dk-gray-800"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactStepProgress;
