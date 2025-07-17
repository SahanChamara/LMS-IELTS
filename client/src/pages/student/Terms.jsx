import React from "react";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/card";

const TermsPage = () => {
  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-800">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 pt-10 ml-0 md:ml-64 max-w-full space-y-6">
        {/* Company Information Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">About Residue Solution Company</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700">Registered Address:</h3>
                <p className="text-gray-600">No. 123, Industrial Zone,</p>
                <p className="text-gray-600">Ja-Ela,</p>
                <p className="text-gray-600">Colombo, Sri Lanka</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Contact Information:</h3>
                <p className="text-gray-600">Phone: +94 11 234 5678</p>
                <p className="text-gray-600">Email: info@residuesolution.lk</p>
                <p className="text-gray-600">Website: www.residuesolution.lk</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Terms and Conditions Cards */}
        <Card className="p-6">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Terms and Conditions</h1>
            <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

            {/* Section 1 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using services provided by Residue Solution Company (Pvt) Ltd, you agree to comply with these terms. Continued use constitutes acceptance of any modifications.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">2. Company Services</h2>
              <p className="text-gray-700">
                Residue Solution Company (Pvt) Ltd specializes in:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Industrial waste management solutions</li>
                <li>Environmental remediation services</li>
                <li>Sustainable residue processing</li>
                <li>Consultancy services for waste management</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Second Terms Card */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Section 3 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">3. Intellectual Property</h2>
              <p className="text-gray-700">
                All proprietary technologies, methodologies, and documentation provided by Residue Solution Company (Pvt) Ltd remain our exclusive property.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">4. Environmental Compliance</h2>
              <p className="text-gray-700">
                Clients must ensure all materials provided to our company comply with Sri Lankan environmental regulations (National Environmental Act No. 47 of 1980).
              </p>
            </div>
          </div>
        </Card>

        {/* Third Terms Card */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Section 5 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">5. Liability Limitations</h2>
              <p className="text-gray-700">
                Residue Solution Company (Pvt) Ltd liability is limited to the value of the service contract. We are not liable for indirect or consequential damages.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">6. Governing Law</h2>
              <p className="text-gray-700">
                These terms shall be governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">7. Dispute Resolution</h2>
              <p className="text-gray-700">
                Any disputes shall be first subject to mediation in Ja-Ela, Sri Lanka. Unresolved disputes will be settled in the Courts of Colombo.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Contact for Clarifications</h2>
            <p className="text-gray-700">
              For any questions regarding these terms, please contact our legal department:
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">Residue Solution Company (Pvt) Ltd</p>
              <p>Legal Department</p>
              <p>No. 123, Industrial Zone, Ja-Ela</p>
              <p>Colombo, Sri Lanka</p>
              <p>Tel: +94 11 234 5678 (Ext. 102)</p>
              <p>Email: legal@residuesolution.lk</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default TermsPage;