"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { createTag } from "@/app/actions/tag.action";
import { Plus, AlertCircle, CheckCircle2 } from "lucide-react";

interface Tag {
  id: number;
  name: string;
  created_at: string;
}

interface TagsPageProps {
  tags: Tag[];
}

export default function TagsPage({ tags }: TagsPageProps) {
  const [state, action, pending] = useActionState(createTag, undefined);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 md:grid-cols-[1fr_400px]">
        {/* Tags Display */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Tags</h1>
            <p className="text-muted-foreground mt-2">
              Browse and manage all tags
            </p>
          </div>
          <Separator className="mb-6" />

          <div className="flex flex-wrap gap-3">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-base px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {tag.name}
                </Badge>
              ))
            ) : (
              <Card className="w-full">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No tags yet. Create your first tag!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Create Tag Form */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Tag
              </CardTitle>
              <CardDescription>Add a new tag to your collection</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={action} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tag Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter tag name"
                    required
                    disabled={pending}
                  />
                </div>

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
                      Tag created successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? "Creating..." : "Create Tag"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
