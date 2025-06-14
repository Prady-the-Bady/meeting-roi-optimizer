
-- Create a table to store meeting sessions
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  participants INTEGER NOT NULL,
  duration INTEGER NOT NULL, -- duration in seconds
  total_cost DECIMAL(10,2) NOT NULL,
  cost_method TEXT NOT NULL,
  custom_rate DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to store cost history for analytics
CREATE TABLE public.meeting_cost_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_cost_history ENABLE ROW LEVEL SECURITY;

-- Create policies for meetings table
CREATE POLICY "Users can view their own meetings" 
  ON public.meetings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meetings" 
  ON public.meetings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meetings" 
  ON public.meetings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meetings" 
  ON public.meetings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for meeting cost history table
CREATE POLICY "Users can view cost history for their meetings" 
  ON public.meeting_cost_history 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.id = meeting_cost_history.meeting_id 
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert cost history for their meetings" 
  ON public.meeting_cost_history 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.id = meeting_cost_history.meeting_id 
    AND meetings.user_id = auth.uid()
  ));

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
