# R2 Upload Setup Guide

## 1. Database Setup

Run the SQL schema in your Supabase database:

```sql
-- See database/schema.sql
```

Or run it directly in Supabase SQL Editor.

## 2. Cloudflare R2 Setup

### Create R2 Bucket:

1. Go to Cloudflare Dashboard
2. Navigate to R2 Object Storage
3. Create a new bucket (e.g., `nozomi-images`)
4. Configure public access if needed

### Get API Credentials:

1. Go to R2 → Manage R2 API Tokens
2. Create a new API token with Read & Write permissions
3. Copy the Access Key ID and Secret Access Key

### Get R2 Endpoint:

- Format: `https://<account-id>.r2.cloudflarestorage.com`
- Find your account ID in the URL or dashboard

### Configure Public URL:

1. In R2 bucket settings, enable public access or set up a custom domain
2. Use the public URL format: `https://<bucket>.<custom-domain>.com` or use R2's dev subdomain

## 3. Environment Variables

Update your `.env` file with your R2 credentials:

```env
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=nozomi-images
R2_PUBLIC_URL=https://your-bucket.your-domain.com
```

## 4. How It Works

### Upload Flow:

1. User uploads a ZIP file with a name and selected tags
2. Server receives the file and unzips it
3. For each image file in the ZIP:
   - Upload to Cloudflare R2
   - Get the public URL
   - Save metadata to Supabase `images` table
   - Link image to selected tags in `image_tags` table

### Supported Image Formats:

- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

### File Size Limits:

- Maximum ZIP file size: 50MB
- Individual file size: No specific limit (handled by R2)

## 5. Usage

1. Navigate to `/upload`
2. Enter a name for your upload
3. Select a ZIP file containing images
4. Choose one or more tags
5. Click "Upload File"
6. Images will be extracted, uploaded to R2, and saved to database

## 6. Database Schema

### images table:

- `id`: Auto-increment primary key
- `name`: Original filename
- `url`: Public URL from R2
- `upload_name`: Name given by user for this upload batch
- `size`: File size in bytes
- `content_type`: MIME type (image/jpeg, etc.)
- `created_at`: Upload timestamp

### image_tags table:

- `id`: Auto-increment primary key
- `image_id`: Foreign key to images
- `tag_id`: Foreign key to tags
- `created_at`: Link timestamp

## 7. Next Steps

- View uploaded images: Create `/images` page
- Gallery view: Display images grouped by tags
- Delete functionality: Remove images from R2 and database
- Edit tags: Update image-tag associations
