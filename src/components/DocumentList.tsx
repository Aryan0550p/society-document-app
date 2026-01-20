"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Download, Stamp, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentListProps {
  userId: string;
}

interface Document {
  id: string;
  title: string;
  documentType: string;
  description: string | null;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  status: string;
  isSuperseded: boolean;
  shareholding: string | null;
  createdAt: string;
}

export default function DocumentList({ userId }: DocumentListProps) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [userId]);

  const loadDocuments = async () => {
    try {
      const response = await fetch(`/api/documents?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupersede = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/supersede`, {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: "Document Superseded",
          description: "Digital stamp applied successfully",
        });
        loadDocuments();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to supersede document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Document Deleted",
          description: "Document removed successfully",
        });
        loadDocuments();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const formatDocumentType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 animate-pulse mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-600 mb-2">No documents yet</p>
        <p className="text-sm text-gray-400">Upload your first document to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
            doc.isSuperseded ? "bg-red-50 border-red-200" : "bg-white"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                {doc.isSuperseded && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                    SUPERSEDED
                  </span>
                )}
                {doc.status === "ACTIVE" && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{formatDocumentType(doc.documentType)}</p>
              {doc.shareholding && (
                <p className="text-sm text-blue-600 mb-2">Shareholding: {doc.shareholding}</p>
              )}
              {doc.description && (
                <p className="text-sm text-gray-500 mb-2">{doc.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{doc.fileName}</span>
                <span>{formatFileSize(doc.fileSize)}</span>
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`/api/documents/${doc.id}/view`, "_blank")}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {!doc.isSuperseded && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSupersede(doc.id)}
                  title="Mark as Superseded"
                >
                  <Stamp className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(doc.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
