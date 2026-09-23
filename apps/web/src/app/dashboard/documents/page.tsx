"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FolderOpen, Upload } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Documents</h1>
        <Button size="sm">
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>
      <EmptyState
        icon={<FolderOpen className="h-7 w-7" />}
        title="No documents uploaded"
        description="Upload and manage documents for your application: government ID, employment letter, bank statements, and tenancy agreements."
        action={
          <Button>
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        }
      />
    </div>
  );
}
