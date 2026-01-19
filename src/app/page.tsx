import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Lock, Upload } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Society Docs</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Housing Society Legal Document Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Securely store, manage, and access all your housing society legal documents
            in one place with digital stamping and password-protected folders.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Managing Documents
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <FeatureCard
            icon={<Upload className="h-12 w-12 text-blue-600" />}
            title="Easy Upload"
            description="Upload PDF documents with organized categorization for all 15+ document types"
          />
          <FeatureCard
            icon={<Lock className="h-12 w-12 text-green-600" />}
            title="Password Protected"
            description="Individual folder protection for each owner with secure password encryption"
          />
          <FeatureCard
            icon={<Shield className="h-12 w-12 text-purple-600" />}
            title="Digital Stamping"
            description="Mark superseded documents with digital stamps for version control"
          />
          <FeatureCard
            icon={<FileText className="h-12 w-12 text-orange-600" />}
            title="Document Types"
            description="Support for membership, receipts, certificates, deeds, and more"
          />
        </div>

        <div className="mt-24 bg-white rounded-lg shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Supported Document Types
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentTypes.map((type, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 rounded hover:bg-gray-50">
                <span className="text-blue-600 font-semibold">{String.fromCharCode(97 + index)})</span>
                <span className="text-gray-700">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-24 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2026 Society Document Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

const documentTypes = [
  "Application for membership",
  "Society Payment receipts",
  "Share certificate details (with % shareholding)",
  "Flat legal registration",
  "Society approved Map",
  "Corporation Completion certificate",
  "Corporation occupation Certificate",
  "Society flat NOC",
  "Society Nomination documentation",
  "Corporation Tax Ownership documentation",
  "MSEB power connection Ownership",
  "Pipegas ownership documentation",
  "Bank loan documentation",
  "Gift deed / Sale deed / Will documents",
  "Management Committee Meeting copy",
];
