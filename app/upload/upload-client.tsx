"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { uploadZipFile } from "@/app/actions/upload.action";
import { Upload, AlertCircle, CheckCircle2, FileArchive } from "lucide-react";

interface Tag {
  id: number;
  name: string;
  created_at: string;
}

interface UploadPageProps {
  tags: Tag[];
}

export default function UploadPage({ tags }: UploadPageProps) {
  const [state, action, pending] = useActionState(uploadZipFile, undefined);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTagToggle = (tagId: string) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tagId)) {
      newSelected.delete(tagId);
    } else {
      newSelected.add(tagId);
    }
    setSelectedTags(newSelected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.endsWith(".zip")) return;

    const input = fileInputRef.current;
    if (!input) return;

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files;

    setFileName(file.name);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload ZIP File</h1>
        <p className="text-muted-foreground mt-2">
          Upload a ZIP file and assign tags to organize your content
        </p>
      </div>

      <Separator className="mb-8" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Form
          </CardTitle>
          <CardDescription>
            Fill in the details and select tags for your upload
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter a name for this upload"
                required
                disabled={pending}
                ref={fileInputRef}
              />
              <p className="text-sm text-muted-foreground">
                A descriptive name for your upload
              </p>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="zipFile">ZIP File</Label>
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="rounded-full bg-muted p-4">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {isDragging
                        ? "Drop your ZIP file here"
                        : "Drag and drop your ZIP file here"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      or click to browse
                    </p>
                  </div>
                  <Input
                    id="zipFile"
                    name="zipFile"
                    type="file"
                    accept=".zip"
                    onChange={handleFileChange}
                    required
                    disabled={pending}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              {fileName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 p-3 bg-muted rounded-md">
                  <FileArchive className="h-4 w-4" />
                  <span className="font-medium">{fileName}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Upload a ZIP file (max 50MB)
              </p>
            </div>

            <Separator />

            {/* Tag Selection */}
            <div className="space-y-4">
              <div>
                <Label>Select Tags</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose one or more tags to categorize this upload
                </p>
              </div>

              {tags.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tags.map((tag) => {
                    const tagId = tag.id.toString();
                    const isChecked = selectedTags.has(tagId);

                    return (
                      <div
                        key={tag.id}
                        className="flex items-center space-x-3 rounded-md border p-4 hover:bg-accent transition-colors"
                      >
                        <Checkbox
                          id={`tag-${tag.id}`}
                          name="tags"
                          value={tagId}
                          checked={isChecked}
                          onCheckedChange={() => handleTagToggle(tagId)}
                          disabled={pending}
                        />
                        <Label
                          htmlFor={`tag-${tag.id}`}
                          className="flex-1 cursor-pointer font-normal"
                        >
                          {tag.name}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No tags available</AlertTitle>
                  <AlertDescription>
                    Please create some tags first before uploading.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Error/Success Messages */}
            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {state?.success && (
              <Alert className="border-green-500/50 text-green-600 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  {state.uploadedCount
                    ? `Successfully uploaded ${state.uploadedCount} image${
                        state.uploadedCount > 1 ? "s" : ""
                      }!`
                    : "File uploaded successfully!"}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={pending || tags.length === 0}
            >
              {pending ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
