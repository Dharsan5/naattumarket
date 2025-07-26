-- Create tables for the chat functionality

-- Messages table to store all chat messages
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    supplier_id UUID NOT NULL,
    order_id TEXT,
    recipient_id UUID NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own messages
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = recipient_id);

-- Policy to allow users to insert their own messages
CREATE POLICY "Users can insert their own messages" ON public.messages
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update read status of messages addressed to them
CREATE POLICY "Users can update read status of their messages" ON public.messages
    FOR UPDATE
    USING (auth.uid() = recipient_id)
    WITH CHECK (
        auth.uid() = recipient_id AND
        (SELECT count(*) FROM jsonb_object_keys(jsonb_strip_nulls(jsonb_build_object(
            'is_read', is_read
        ))) = 1)
    );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_supplier_id ON public.messages(supplier_id);
CREATE INDEX IF NOT EXISTS idx_messages_order_id ON public.messages(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Ensure suppliers table exists (for foreign key reference)
CREATE TABLE IF NOT EXISTS public.suppliers (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for suppliers table
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view suppliers
CREATE POLICY "Anyone can view suppliers" ON public.suppliers
    FOR SELECT
    TO authenticated
    USING (true);
