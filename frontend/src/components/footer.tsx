export default function Footer() {
  return (
    <footer className="bg-opacity-20 backdrop-filter backdrop-blur-lg border-t border-gray-300 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold">About Us</h2>
            <p className="mt-4">
              Connecting Patients and Doctors for Seamless Healthcare
              Appointments.
            </p>
          </div>
          <div className="mt-8 md:mt-0">
            <h2 className="text-xl font-semibold">Quick Links</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="/"
                  className="hover:text-blue-500 dark:hover:text-blue-300"
                >
                  Home
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-8 md:mt-0">
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <p className="mt-4">Email: contact@ondemandmarketplace.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024 On Demand Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
