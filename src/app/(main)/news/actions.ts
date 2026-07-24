'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleVote(targetId: string, targetType: string, reactionType: 'upvote' | 'downvote') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Oy vermek için giriş yapmalısınız.' };
  }

  // Fetch user profile to get user_id for the likes table
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return { success: false, message: 'Profil bulunamadı.' };
  }

  // Check if vote already exists
  const { data: existingVote } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', profile.id)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .single();

  try {
    if (existingVote) {
      if (existingVote.reaction_type === reactionType) {
        // User clicked the same vote again -> Remove vote
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingVote.id);
      } else {
        // User changed vote
        await supabase
          .from('likes')
          .update({ reaction_type: reactionType })
          .eq('id', existingVote.id);
      }
    } else {
      // New vote
      await supabase
        .from('likes')
        .insert({
          user_id: profile.id,
          target_type: targetType,
          target_id: targetId,
          reaction_type: reactionType
        });
    }

    revalidatePath(`/news`); // We can be more specific, but this ensures updates are visible
    return { success: true };
  } catch (error: any) {
    console.error('Vote error:', error);
    return { success: false, message: 'İşlem sırasında bir hata oluştu.' };
  }
}

export async function trackView(newsId: string) {
  const supabase = await createClient();
  
  // Note: For a robust system, this should ideally be an RPC call in Supabase to increment securely
  // For now, we will do a simple increment. It's safe enough for non-critical view counts.
  const { data: news } = await supabase
    .from('news')
    .select('views')
    .eq('id', newsId)
    .single();
    
  if (news) {
    await supabase
      .from('news')
      .update({ views: (news.views || 0) + 1 })
      .eq('id', newsId);
  }
}
