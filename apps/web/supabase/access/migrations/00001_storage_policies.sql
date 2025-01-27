-- Enable RLS on the storage.bucket table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins full access" ON storage.objects;
DROP POLICY IF EXISTS "Customers access own files" ON storage.objects;
DROP POLICY IF EXISTS "Agents full access for select" ON storage.objects;
DROP POLICY IF EXISTS "Agents full access for insert" ON storage.objects;
DROP POLICY IF EXISTS "Agents full access for update" ON storage.objects;
-- Admins have full access
CREATE POLICY "Admins full access" ON storage.objects FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM public.users
        WHERE email = auth.email()::text
            AND role = 'admin'
    )
);
-- Customers can access their own files based on customer_id metadata
CREATE POLICY "Customers access own files" ON storage.objects FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM public.users
        WHERE email = auth.email()::text
            AND role = 'customer'
            AND id::text = (metadata->>'customer_id')
    )
);
-- Agents have full access except delete
CREATE POLICY "Agents full access for select" ON storage.objects FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE email = auth.email()
                AND role = 'agent'
        )
    );
CREATE POLICY "Agents full access for insert" ON storage.objects FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE email = auth.email()
                AND role = 'agent'
        )
    );
CREATE POLICY "Agents full access for update" ON storage.objects FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE email = auth.email()
                AND role = 'agent'
        )
    );