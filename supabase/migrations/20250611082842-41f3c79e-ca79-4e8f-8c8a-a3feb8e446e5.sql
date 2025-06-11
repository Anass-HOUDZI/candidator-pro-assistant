
-- Supprimer les politiques RLS problématiques pour reflection_collaborators
DROP POLICY IF EXISTS "Users can view collaborators of their reflections" ON public.reflection_collaborators;
DROP POLICY IF EXISTS "Users can add collaborators to their reflections" ON public.reflection_collaborators;

-- Recréer des politiques RLS simplifiées pour éviter la récursion infinie
CREATE POLICY "Users can view reflection collaborators" 
  ON public.reflection_collaborators 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Reflection owners can manage collaborators" 
  ON public.reflection_collaborators 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.reflections 
      WHERE id = reflection_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reflections 
      WHERE id = reflection_id AND user_id = auth.uid()
    )
  );

-- Simplifier aussi la politique pour les réflexions pour éviter les récursions
DROP POLICY IF EXISTS "Users can view their own reflections and shared ones" ON public.reflections;

CREATE POLICY "Users can view their own reflections" 
  ON public.reflections 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Simplifier la politique de mise à jour des réflexions
DROP POLICY IF EXISTS "Users can update their own reflections or shared ones with editor role" ON public.reflections;

CREATE POLICY "Users can update their own reflections" 
  ON public.reflections 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Simplifier aussi les politiques pour les commentaires
DROP POLICY IF EXISTS "Users can view comments on accessible reflections" ON public.reflection_comments;
DROP POLICY IF EXISTS "Users can create comments on accessible reflections" ON public.reflection_comments;

CREATE POLICY "Users can view comments on their reflections" 
  ON public.reflection_comments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.reflections 
      WHERE id = reflection_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create comments on their reflections" 
  ON public.reflection_comments 
  FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.reflections 
      WHERE id = reflection_id AND user_id = auth.uid()
    )
  );
