create table public.profile (
  id uuid not null default gen_random_uuid (),
  name character varying not null,
  email character varying not null,
  created_at timestamp with time zone not null default now(),
  constraint profile_pkey primary key (id)
) TABLESPACE pg_default;

create table public.blogs (
  id uuid not null default gen_random_uuid (),
  title character varying not null,
  content text not null,
  created_by uuid not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  image character varying null,
  constraint blogs_pkey primary key (id),
  constraint blogs_created_by_fkey foreign KEY (created_by) references profile (id)
) TABLESPACE pg_default;

create table public.blog_interactions (
  id uuid not null default gen_random_uuid (),
  blog_id uuid not null,
  content text not null,
  created_at timestamp with time zone not null default now(),
  created_by uuid null,
  updated_at timestamp with time zone null,
  constraint blog_interactions_pkey primary key (id),
  constraint blog_interactions_blog_id_fkey foreign KEY (blog_id) references blogs (id),
  constraint blog_interactions_created_by_fkey foreign KEY (created_by) references profile (id)
) TABLESPACE pg_default;

CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'blog-feature'
);

CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-feature'
);

CREATE POLICY "Allow authenticated users to update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-feature'
)
WITH CHECK (
  bucket_id = 'blog-feature'
);

CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-feature'
);