"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, LogOut, Lock, Eye, Stamp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentList from "@/components/DocumentList";
import FolderAccessModal from "@/components/FolderAccessModal";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [isFolderUnlocked, setIsFolderUnlocked] = useState(false);
  const [showFolderAccess, setShowFolderAccess] = useState(false);
  const [documentStats, setDocumentStats] = useState({ total: 0, active: 0, superseded: 0 });

  const loadDocumentStats = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/documents?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const total = data.documents.length;
        const active = data.documents.filter((doc: any) => doc.status === "ACTIVE").length;
        const superseded = data.documents.filter((doc: any) => doc.isSuperseded).length;
        setDocumentStats({ total, active, superseded });
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push("/auth/signin");
      }
    } catch (error) {
      router.push("/auth/signin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleFolderUnlock = () => {
    setIsFolderUnlocked(true);
    setShowFolderAccess(false);
    toast({
      title: "Folder Unlocked 🔓",
      description: "You can now access your documents",
    });
    loadDocumentStats();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && isFolderUnlocked) {
      loadDocumentStats();
    }
  }, [user, isFolderUnlocked]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Society Documents</h1>
              <p className="text-sm text-gray-600">Flat: {user.flatNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Folder Access */}
        {!isFolderUnlocked ? (
          <Card className="mb-8">
            <CardHeader className="text-center">
              <Lock className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
              <CardTitle>Protected Document Folder 🔑</CardTitle>
              <CardDescription>
                Your documents are password protected. Enter your folder password to access them.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => setShowFolderAccess(true)}>
                Unlock My Documents
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Actions */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Documents</h2>
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documentStats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                  <Eye className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{documentStats.active}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Superseded</CardTitle>
                  <Stamp className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{documentStats.superseded}</div>
                </CardContent>
              </Card>
            </div>

            {/* Document List */}
            <Card>
              <CardHeader>
                <CardTitle>Document Library</CardTitle>
                <CardDescription>View and manage all your legal documents</CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentList userId={user.id} />
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Modals */}
      {showFolderAccess && (
        <FolderAccessModal
          userId={user.id}
          onClose={() => setShowFolderAccess(false)}
          onUnlock={handleFolderUnlock}
        />
      )}
      {showUpload && (
        <DocumentUpload userId={user.id} onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
}
