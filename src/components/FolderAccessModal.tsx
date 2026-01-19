"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FolderAccessModalProps {
  userId: string;
  onClose: () => void;
  onUnlock: () => void;
}

export default function FolderAccessModal({ userId, onClose, onUnlock }: FolderAccessModalProps) {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const response = await fetch("/api/folder/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      if (response.ok) {
        onUnlock();
      } else {
        toast({
          title: "Incorrect Password",
          description: "The folder password you entered is incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify password",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
          <CardTitle>Unlock Document Folder</CardTitle>
          <CardDescription>Enter your folder password to access your documents</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folderPassword">Folder Password 🔑</Label>
              <Input
                id="folderPassword"
                type="password"
                placeholder="Enter your folder password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Unlock"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
