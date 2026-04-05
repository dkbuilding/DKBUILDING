import { Check } from "lucide-react";

const ContactStepProgress = ({ currentStep, steps }) => {
  return (
    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-6 xs:mb-8 space-y-4 xs:space-y-0">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`w-8 h-8 xs:w-10 xs:h-10 rounded-full flex items-center justify-center text-xs xs:text-sm font-medium ${
              currentStep >= step.id
                ? "bg-dk-yellow text-dk-black"
                : "bg-dk-gray-800 text-dk-gray-400"
            }`}
          >
            {currentStep > step.id ? (
              <Check className="w-4 h-4 xs:w-5 xs:h-5" />
            ) : (
              step.id
            )}
          </div>
          <div className="ml-2 xs:ml-3">
            <div
              className={`text-xs xs:text-sm font-medium ${
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
              className={`hidden xs:block w-6 xs:w-8 h-0.5 mx-2 xs:mx-4 ${
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
