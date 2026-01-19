"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  userId: string;
  onClose: () => void;
}

const DOCUMENT_TYPES = [
  { value: "APPLICATION_MEMBERSHIP", label: "Application for membership" },
  { value: "PAYMENT_RECEIPT", label: "Society Payment receipts" },
  { value: "SHARE_CERTIFICATE", label: "Share certificate details" },
  { value: "FLAT_REGISTRATION", label: "Flat legal registration" },
  { value: "SOCIETY_MAP", label: "Society approved Map" },
  { value: "COMPLETION_CERTIFICATE", label: "Corporation Completion certificate" },
  { value: "COMPLETION_CERTIFICATE_2", label: "Corporation completion certificate (2)" },
  { value: "OCCUPATION_CERTIFICATE", label: "Corporation occupation Certificate" },
  { value: "NOC", label: "Society flat NOC" },
  { value: "NOMINATION", label: "Society Nomination documentation" },
  { value: "TAX_OWNERSHIP", label: "Corporation Tax Ownership documentation" },
  { value: "MSEB_CONNECTION", label: "MSEB power connection Ownership" },
  { value: "PIPEGAS_OWNERSHIP", label: "Pipegas ownership documentation" },
  { value: "BANK_LOAN", label: "Bank loan documentation" },
  { value: "DEED_DOCUMENTS", label: "Gift deed / Sale deed / Will documents" },
  { value: "COMMITTEE_MEETING_COPY", label: "Management Committee Meeting copy" },
];

export default function DocumentUpload({ userId, onClose }: DocumentUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    documentType: "",
    description: "",
    shareholding: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid File",
          description: "Only PDF files are allowed",
          variant: "destructive",
        });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("userId", userId);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("documentType", formData.documentType);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("shareholding", formData.shareholding);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Document uploaded successfully",
        });
        onClose();
        window.location.reload(); // Refresh to show new document
      } else {
        const data = await response.json();
        toast({
          title: "Upload Failed",
          description: data.error || "Failed to upload document",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Upload a legal document (PDF format)</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="e.g., Share Certificate 2024"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <select
                id="documentType"
                required
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select document type</option>
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.documentType === "SHARE_CERTIFICATE" && (
              <div className="space-y-2">
                <Label htmlFor="shareholding">Shareholding Percentage</Label>
                <Input
                  id="shareholding"
                  placeholder="e.g., 50%, 33.33%"
                  value={formData.shareholding}
                  onChange={(e) => setFormData({ ...formData, shareholding: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                placeholder="Add any additional notes about this document"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">PDF File (Max 10MB)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  id="file"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  {file ? (
                    <p className="text-sm text-gray-600">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">Click to upload PDF</p>
                      <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
