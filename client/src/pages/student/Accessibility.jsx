import React from "react";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/card"

const AccessibilityPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800">
      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 fixed h-full top-0 left-0 z-10">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 ml-64 space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Accessibility Statement</h1>
              <p className="text-gray-700">
                At Residue Solution Company, we are committed to ensuring digital accessibility for people with disabilities.
              </p>
              <p className="text-gray-700">
                We aim to improve the user experience for everyone and apply relevant accessibility standards to ensure inclusion.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Accessibility Features</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Screen-reader compatibility using semantic HTML</li>
                <li>Keyboard-navigable interface</li>
                <li>Color contrast meeting WCAG 2.1 AA standards</li>
                <li>Responsive design for all screen sizes</li>
                <li>Descriptive alt text for all informative images</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Continuous Improvements</h2>
              <p className="text-gray-700">
                We regularly audit and update our platform to fix accessibility issues and align with global standards and local Sri Lankan regulations.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Feedback & Contact</h2>
              <p className="text-gray-700">
                If you experience any accessibility barriers or need assistance using our site, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium">Residue Solution Company (Pvt) Ltd</p>
                <p>No. 123, Industrial Zone, Ja-Ela, Colombo</p>
                <p>Phone: +94 11 234 5678</p>
                <p>Email: accessibility@residuesolution.lk</p>
              </div>
            </div>
          </Card>
        </main>
        
      </div>
      
    </div>
  );
};

export default AccessibilityPage;
