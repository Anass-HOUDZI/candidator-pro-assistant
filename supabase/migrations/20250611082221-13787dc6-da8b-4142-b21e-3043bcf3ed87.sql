
-- Table pour stocker les réflexions
CREATE TABLE public.reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  candidature_id UUID REFERENCES public.candidatures(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('note_candidature', 'analyse_performance', 'strategie_recherche', 'collaboration')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'en_cours' CHECK (status IN ('en_cours', 'termine', 'en_attente', 'archive')),
  priority TEXT DEFAULT 'moyenne' CHECK (priority IN ('basse', 'moyenne', 'haute', 'urgente')),
  due_date TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les collaborateurs sur les réflexions
CREATE TABLE public.reflection_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reflection_id UUID NOT NULL REFERENCES public.reflections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les commentaires et discussions
CREATE TABLE public.reflection_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reflection_id UUID NOT NULL REFERENCES public.reflections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.reflection_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les rappels et notifications
CREATE TABLE public.reflection_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reflection_id UUID NOT NULL REFERENCES public.reflections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('notification', 'email', 'push')),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  message TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflection_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflection_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflection_reminders ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les réflexions
CREATE POLICY "Users can view their own reflections and shared ones" 
  ON public.reflections 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    id IN (
      SELECT reflection_id 
      FROM public.reflection_collaborators 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own reflections" 
  ON public.reflections 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reflections or shared ones with editor role" 
  ON public.reflections 
  FOR UPDATE 
  USING (
    user_id = auth.uid() OR 
    id IN (
      SELECT reflection_id 
      FROM public.reflection_collaborators 
      WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  );

CREATE POLICY "Users can delete their own reflections" 
  ON public.reflections 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Politiques RLS pour les collaborateurs
CREATE POLICY "Users can view collaborators of their reflections" 
  ON public.reflection_collaborators 
  FOR SELECT 
  USING (
    reflection_id IN (
      SELECT id FROM public.reflections WHERE user_id = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Users can add collaborators to their reflections" 
  ON public.reflection_collaborators 
  FOR INSERT 
  WITH CHECK (
    reflection_id IN (
      SELECT id FROM public.reflections WHERE user_id = auth.uid()
    )
  );

-- Politiques RLS pour les commentaires
CREATE POLICY "Users can view comments on accessible reflections" 
  ON public.reflection_comments 
  FOR SELECT 
  USING (
    reflection_id IN (
      SELECT id FROM public.reflections 
      WHERE user_id = auth.uid() OR 
      id IN (
        SELECT reflection_id 
        FROM public.reflection_collaborators 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create comments on accessible reflections" 
  ON public.reflection_comments 
  FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND
    reflection_id IN (
      SELECT id FROM public.reflections 
      WHERE user_id = auth.uid() OR 
      id IN (
        SELECT reflection_id 
        FROM public.reflection_collaborators 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Politiques RLS pour les rappels
CREATE POLICY "Users can manage their own reminders" 
  ON public.reflection_reminders 
  FOR ALL 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Index pour optimiser les performances
CREATE INDEX idx_reflections_user_id ON public.reflections(user_id);
CREATE INDEX idx_reflections_candidature_id ON public.reflections(candidature_id);
CREATE INDEX idx_reflections_type ON public.reflections(type);
CREATE INDEX idx_reflections_status ON public.reflections(status);
CREATE INDEX idx_reflections_due_date ON public.reflections(due_date);
CREATE INDEX idx_reflection_collaborators_reflection_id ON public.reflection_collaborators(reflection_id);
CREATE INDEX idx_reflection_collaborators_user_id ON public.reflection_collaborators(user_id);
CREATE INDEX idx_reflection_comments_reflection_id ON public.reflection_comments(reflection_id);
CREATE INDEX idx_reflection_reminders_user_id ON public.reflection_reminders(user_id);
CREATE INDEX idx_reflection_reminders_scheduled_at ON public.reflection_reminders(scheduled_at);
