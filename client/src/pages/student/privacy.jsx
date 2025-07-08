import React from "react";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";

const PrivacyPage = () => {
  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-800">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-10 w-64 h-full bg-gray-100">
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
                <h3 className="font-medium text-gray-700">Data Controller:</h3>
                <p className="text-gray-600">Residue Solution Company (Pvt) Ltd</p>
                <p className="text-gray-600">No. 123, Industrial Zone,</p>
                <p className="text-gray-600">Ja-Ela, Colombo, Sri Lanka</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Data Protection Officer:</h3>
                <p className="text-gray-600">Email: dpo@residuesolution.lk</p>
                <p className="text-gray-600">Phone: +94 11 234 5678 (Ext. 103)</p>
                <p className="text-gray-600">Hours: 9:00 AM - 5:00 PM (IST), Mon-Fri</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy Policy Cards */}
        <Card className="p-6">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-600">Effective: {new Date().toLocaleDateString()}</p>

            {/* Section 1 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">1. Information We Collect</h2>
              <p className="text-gray-700">
                We collect information to provide better services to our clients and comply with Sri Lankan regulations:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Business contact information (name, email, phone)</li>
                <li>Company details for service agreements</li>
                <li>Waste processing documentation required by law</li>
                <li>Website usage data through cookies</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">2. How We Use Information</h2>
              <p className="text-gray-700">
                Your data helps us:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Provide and improve our residue management services</li>
                <li>Comply with Sri Lankan environmental regulations</li>
                <li>Communicate about service updates</li>
                <li>Ensure proper waste handling documentation</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Second Privacy Card */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Section 3 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">3. Data Sharing</h2>
              <p className="text-gray-700">
                We may share information with:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Regulatory authorities as required by Sri Lankan law</li>
                <li>Third-party processors under strict confidentiality agreements</li>
                <li>Legal entities when required by court order</li>
              </ul>
              <p className="text-gray-700 mt-2">
                We never sell client data to marketing companies.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">4. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate technical measures including:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Secure servers located in Sri Lanka</li>
                <li>Encrypted data transmission</li>
                <li>Restricted employee access</li>
                <li>Regular security audits</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Third Privacy Card */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Section 5 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">5. Your Rights</h2>
              <p className="text-gray-700">
                Under Sri Lankan data protection principles, you have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Access personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Withdraw consent for processing (where applicable)</li>
                <li>Lodge complaints with the Sri Lankan authorities</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">6. Retention Period</h2>
              <p className="text-gray-700">
                We retain data as required by Sri Lankan environmental and tax laws:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Service records: 7 years minimum</li>
                <li>Waste processing documentation: 10 years minimum</li>
                <li>Financial transactions: 7 years minimum</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Contact Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Contact Our Data Protection Team</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">Residue Solution Company (Pvt) Ltd</p>
              <p>Data Protection Office</p>
              <p>No. 123, Industrial Zone, Ja-Ela</p>
              <p>Colombo, Sri Lanka</p>
              <p>Tel: +94 11 234 5678 (Ext. 103)</p>
              <p>Email: privacy@residuesolution.lk</p>
              <p className="mt-2 text-sm text-gray-600">
                For data access requests, please use our Subject Access Request Form available at our office.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PrivacyPage;