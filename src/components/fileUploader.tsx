'use client';

import { useRef, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/supabase-client';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/useToast';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileIcon } from 'lucide-react';

interface FileUploaderProps {
  imageUrl: string;
  name?: string;
  folder: string;
  onUpload?: (storedPath: string) => void;
}

export default function FileUploader({ imageUrl, folder, onUpload }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClient();
  const bucket = process.env.NEXT_PUBLIC_BUCKET_NAME || '';

  
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user?.id) {
        setUserId(data.user.id);
      } else {
        toast({ title: 'Auth error', description: 'Unable to get user ID', variant: 'destructive' });
      }
    })();
  }, [supabase, toast]);

  
  useEffect(() => {
    if (!imageUrl) return;
    (async () => {
      const { data } = await supabase.storage.from(bucket).createSignedUrl(imageUrl, 300);
      if (data?.signedUrl) setPreviewUrl(data.signedUrl);
    })();
  }, [imageUrl, bucket, supabase]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Here")
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    const MAX_SIZE_MB = 5;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({ title: 'Unsupported file type', description: 'Only images and PDFs are allowed.', variant: 'destructive' });
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max size is 5MB.', variant: 'destructive' });
      return;
    }
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${folder}/${crypto.randomUUID()}.${fileExt}`;

    setUploading(true);

    const { error } = await supabase.storage.from(bucket).upload(filePath, file);

    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } else {
      const { data } = await supabase.storage.from(bucket).createSignedUrl(filePath, 300);
      console.log(data,'Signed URL Data');
      if (data?.signedUrl) {
        setPreviewUrl(data.signedUrl);
        toast({ title: 'Upload successful', variant: 'default' });
        if (onUpload) onUpload(filePath);
      }
    }

    setUploading(false);
  };

  return (
    <div>
      <Card>
        <CardContent className="p-4 space-y-2">
          <div
            className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-4 items-center cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <FileIcon className="w-6 h-6" />
            <span className="text-sm font-medium text-gray-500">Upload a logo for the project display</span>
          </div>
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-sm font-medium">Project Logo</Label>
            <Input
              id="file"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              ref={inputRef}
              disabled={uploading}
              className="hidden"
            />
          </div>
          {(previewUrl || uploading) && (
            <>
              {previewUrl && (
                <p className="text-sm  wrap-break-word underline text-blue-600">
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" >Uploaded: {previewUrl.split("/").at(-1)?.split('?').at(0)}</a>
                </p>
              )}
              {uploading && (
                <p className="text-sm text-muted-foreground">Uploading...</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
