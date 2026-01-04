"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface Tag {
  id: number;
  name: string;
}

interface Gallery {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  tags: Tag[];
  imageCount: number;
  coverImage: string | null;
}

interface GalleryGridProps {
  galleries: Gallery[];
  currentPage: number;
  totalPages: number;
}

export default function GalleryGrid({ galleries, currentPage, totalPages }: GalleryGridProps) {
  return (
    <div className="space-y-8">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {galleries.map((gallery) => (
          <Card key={gallery.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/gallery/${gallery.id}`}>
              <div className="aspect-square bg-muted relative">
                {gallery.coverImage ? (
                  <img
                    src={gallery.coverImage}
                    alt={gallery.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {gallery.imageCount} images
                </div>
              </div>
            </Link>
            <CardHeader>
              <CardTitle className="text-lg line-clamp-1">
                <Link href={`/gallery/${gallery.id}`} className="hover:underline">
                  {gallery.name}
                </Link>
              </CardTitle>
            </CardHeader>
            {gallery.tags.length > 0 && (
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {gallery.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                  {gallery.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{gallery.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            )}
            <CardFooter className="text-xs text-muted-foreground">
              {new Date(gallery.created_at).toLocaleDateString()}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {galleries.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No galleries yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first gallery to get started
            </p>
            <Button asChild>
              <Link href="/upload">Upload Gallery</Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link href={`/?page=${currentPage - 1}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </>
            )}
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link href={`/?page=${pageNum}`}>{pageNum}</Link>
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link href={`/?page=${currentPage + 1}`}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
