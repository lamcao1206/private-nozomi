"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Grid2x2, Grid3x3, Square } from "lucide-react";
import Image from "next/image";

interface Tag {
  id: number;
  name: string;
}

interface Image {
  id: number;
  name: string;
  url: string;
  content_type: string;
  created_at: string;
}

interface GalleryViewerProps {
  galleryName: string;
  tags: Tag[];
  images: Image[];
}

type ViewMode = 1 | 2 | 3;

export default function GalleryViewer({
  galleryName,
  tags,
  images,
}: GalleryViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">{galleryName}</h1>
        <p className="text-muted-foreground">
          {images.length} image{images.length !== 1 ? "s" : ""}
        </p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      <Separator />

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Columns:</span>
        <div className="flex gap-1">
          <Button
            variant={viewMode === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode(1)}
          >
            <Square className="h-4 w-4 mr-1" />1
          </Button>
          <Button
            variant={viewMode === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode(2)}
          >
            <Grid2x2 className="h-4 w-4 mr-1" />2
          </Button>
          <Button
            variant={viewMode === 3 ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode(3)}
          >
            <Grid3x3 className="h-4 w-4 mr-1" />3
          </Button>
        </div>
      </div>

      <div
        className={`grid gap-4 ${
          viewMode === 1
            ? "grid-cols-1"
            : viewMode === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {images.map((image) => (
          <div key={image.id} className="relative aspect-square bg-muted">
            <Image
              src={image.url}
              alt={image.name}
              fill
              className="object-contain"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {images.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <p className="text-muted-foreground">No images in this gallery</p>
          </div>
        </Card>
      )}
    </div>
  );
}
