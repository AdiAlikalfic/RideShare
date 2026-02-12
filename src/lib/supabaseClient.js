import {createClient} from "@supabase/supabase-js";

const supabaseUrl = 'https://mbsytrrvnswfezhqhzzx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ic3l0cnJ2bnN3ZmV6aHFoenp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTY3ODMsImV4cCI6MjA4NTMzMjc4M30.lNNz7W7ErrKpqjjWu-FBNJvcV2pcraPJHlYwGXYo3IA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)