/*
  # Create messages table for gift advice requests

  1. New Tables
    - `messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `parent_name` (text) - Name of the parent asking for advice
      - `parent_email` (text) - Email address for follow-up
      - `child_age` (integer) - Age of the child
      - `message` (text) - The question or details about the child
      - `status` (text) - Status of the message (new, replied, archived)
      - `reply` (text, nullable) - Your response to the message
      - `created_at` (timestamptz) - When the message was submitted
      - `replied_at` (timestamptz, nullable) - When you replied

  2. Security
    - Enable RLS on `messages` table
    - Add policy for anyone to submit messages (public form)
    - Add policy for authenticated users to view all messages (admin access)
    - Add policy for authenticated users to update messages (for replies)
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  child_age integer NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' NOT NULL,
  reply text,
  created_at timestamptz DEFAULT now() NOT NULL,
  replied_at timestamptz
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit messages"
  ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);