import RegistrationForm from './components/RegistrationForm';
import logo from './assets/logo.jpeg';

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex-shrink-0 flex items-center justify-center sm:justify-start">
            <img src={logo} alt="Quantum Student Summit Logo" className="h-12 md:h-16 w-auto object-contain rounded-md" />
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Visvesvaraya Technological University Belagavi
            </div>
            <h1 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 leading-tight mt-0.5">
              Quantum Student Summit 2026
            </h1>
            <p className="text-xs sm:text-sm font-medium text-blue-600 mt-1">Advanced Research & Technologies</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pre-Registration Portal
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to the preliminary registration platform for the Quantum Student Summit 2026. Please complete the form below to secure your initial registration.
          </p>
          
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md text-left inline-block max-w-2xl w-full shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    <strong>This is only a pre-registration portal.</strong> Final registration links, payment details (if applicable), and official schedules will be sent to approved applicants exclusively via email closer to the event date.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RegistrationForm />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; 2026 Visvesvaraya Technological University Quantum Club Belagavi . All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
