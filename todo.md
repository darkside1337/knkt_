# Project Tasks

priority:

add create post (mobile and desktop)

figure out the post stuff

add tag system

## Navigation

### Mobile

- Fix topbar behavior when scrolling.
- perhaps rework the mobile sidebar

### Desktop

- Complete full navigation functionality.

---

## Profile Page

---

## Posts System

- Implement post structure.
- Add like/dislike system.

---

## Messaging

- Integrate WebSocket for real-time messaging.
  - Enable 1-on-1 chat functionality.

---

## Claude take

I'll help you design a database structure and implementation approach for the social media posts. Let's break this down:

```prisma
// This is your Prisma schema file

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  image         String?   // Profile picture URL
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  posts         Post[]
  // Add other user-related fields as needed
}

model Post {
  id            String    @id @default(cuid())
  caption       String?   // Optional caption
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  userId        String    // Foreign key to User
  user          User      @relation(fields: [userId], references: [id])
  images        Image[]   // Relation to Image model

  @@index([userId])
}

model Image {
  id            String    @id @default(cuid())
  url           String    // Cloudinary URL
  postId        String    // Foreign key to Post
  post          Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt     DateTime  @default(now())

  @@index([postId])
}

```

This schema design supports all your requirements:

1. Text-only posts (just use the caption field)
2. Single image with caption (create one Image record)
3. Multiple images with caption (create multiple Image records)

Here's how I would implement the post creation flow:

1. **API Route Structure**:

```typescript
// app/api/posts/route.ts
export async function POST(req: Request) {
  const { caption, images } = await req.json();

  // 1. Upload images to Cloudinary first (if any)
  const uploadedImages = images
    ? await Promise.all(images.map((img) => uploadToCloudinary(img)))
    : [];

  // 2. Create post with Prisma
  const post = await prisma.post.create({
    data: {
      caption,
      userId: session.user.id, // Get from your auth session
      images: {
        create: uploadedImages.map((img) => ({
          url: img.secure_url,
        })),
      },
    },
    include: {
      images: true,
      user: true,
    },
  });

  return Response.json(post);
}
```

2. **Frontend Form Component**:

```typescript
// Components for creating a new post
const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caption", caption);
    images.forEach((img) => formData.append("images", img));

    await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="What's on your mind?"
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files || []))}
      />
      <button type="submit">Post</button>
    </form>
  );
};
```

Some additional considerations:

1. **Image Processing**:

   - Set up size limits for uploads
   - Consider compressing images before upload
   - Use Cloudinary's transformation APIs for different sizes/formats

2. **Performance**:

   - Implement pagination for post fetching
   - Use optimistic updates for better UX
   - Consider implementing image lazy loading

3. **Validation**:

   - Validate file types and sizes
   - Set maximum number of images per post
   - Validate caption length

4. **Additional Features to Consider**:
   - Post privacy settings (public/private)
   - Image order tracking
   - Image captions/alt text
   - Post tags or mentions

Would you like me to elaborate on any of these aspects or show you how to implement specific features?

## Chatgpt take

Your idea for the post structure (text caption, single/multiple images with captions) fits well with the use of Next.js 14, PostgreSQL, Prisma, and Cloudinary. Here's a suggested approach to implement it:

### 1. **Database Schema (Prisma)**

You can define your Prisma schema to handle different post types: text, image, or multiple images. Here's an example:

```prisma
model Post {
  id          String    @id @default(uuid())
  userId      String    @relation(fields: [userId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id])
  caption     String?
  postType    PostType  @default(TEXT) // Enum to differentiate types of posts
  images      Image[]   // A relation to handle multiple images
  createdAt   DateTime  @default(now())
}

model Image {
  id      String   @id @default(uuid())
  url     String   // URL to the image stored in Cloudinary
  postId  String   @relation(fields: [postId], references: [id], onDelete: Cascade)
  post    Post     @relation(fields: [postId], references: [id])
}

enum PostType {
  TEXT
  SINGLE_IMAGE
  MULTIPLE_IMAGES
}
```

- **Post model**: Handles general post data (e.g., caption and `postType`).
- **Image model**: Stores URLs to the images uploaded to Cloudinary.
- **PostType enum**: Helps differentiate between posts that contain only text, a single image, or multiple images.

### 2. **Image Upload Handling (Cloudinary)**

Use Cloudinary to handle image uploads, which you can integrate using the Cloudinary SDK. You'll need a form to allow the user to upload images and text captions.

Here's a Next.js function that uploads an image to Cloudinary:

```ts
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "your_upload_preset");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url; // Get the secure URL for storing in your DB
};
```

### 3. **API Routes for Creating Posts**

In Next.js 14, you can create server actions or API routes to handle the form submission. Here’s an outline for your API route:

1. **Receive form data** (caption, images).
2. **Upload images** to Cloudinary.
3. **Save the post** and **image URLs** in PostgreSQL using Prisma.

Example API route to handle creating a post:

```ts
import { prisma } from "@/lib/prisma"; // Your Prisma instance
import { uploadToCloudinary } from "@/lib/cloudinary"; // Cloudinary helper

export async function POST(req: Request) {
  const formData = await req.formData();
  const caption = formData.get("caption") as string;
  const files = formData.getAll("images") as File[];

  // Upload each image to Cloudinary and get URLs
  const imageUrls = await Promise.all(
    files.map((file) => uploadToCloudinary(file))
  );

  // Create the post in the database
  const post = await prisma.post.create({
    data: {
      caption,
      postType:
        files.length > 1
          ? "MULTIPLE_IMAGES"
          : files.length === 1
          ? "SINGLE_IMAGE"
          : "TEXT",
      images: {
        create: imageUrls.map((url) => ({ url })),
      },
    },
  });

  return new Response(JSON.stringify(post), { status: 201 });
}
```

### 4. **Frontend Form for Post Creation**

You can build a form using React and handle text and image inputs. For example:

```tsx
import { useState } from "react";

export default function CreatePostForm() {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caption", caption);
    images.forEach((image) => formData.append("images", image));

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      // Handle success (maybe redirect or show a success message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Add a caption..."
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files || []))}
      />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

### 5. **Handling Likes/Dislikes**

You can add a `Like` model that stores references to posts and users:

```prisma
model Like {
  id        String   @id @default(uuid())
  postId    String   @relation(fields: [postId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id])
  userId    String   @relation(fields: [userId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

You can then handle likes/dislikes through API routes that modify this table by either adding or removing entries based on the user’s action.

---

This structure allows flexibility for creating various types of posts, handling media efficiently with Cloudinary, and storing everything reliably in PostgreSQL. How does this approach sound to you?
