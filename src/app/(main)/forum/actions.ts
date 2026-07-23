'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 8);
}

export async function createTopic(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Giriş yapmanız gerekiyor.' };
    }

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const forum_id = formData.get('forum_id') as string;

    if (!title || !content || !forum_id) {
        return { error: 'Lütfen tüm alanları doldurun.' };
    }

    const slug = generateSlug(title);

    const { data: topic, error } = await supabase
        .from('topics')
        .insert({
            title,
            slug,
            content,
            forum_id,
            author_id: user.id
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating topic:', error);
        return { error: 'Konu oluşturulurken bir hata oluştu.' };
    }

    revalidatePath('/forum');
    redirect(`/forum/${topic.slug}`);
}

export async function createReply(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Giriş yapmanız gerekiyor.' };
    }

    const content = formData.get('content') as string;
    const topic_id = formData.get('topic_id') as string;
    const topic_slug = formData.get('topic_slug') as string;

    if (!content || !topic_id) {
        return { error: 'Lütfen bir içerik girin.' };
    }

    const { error } = await supabase
        .from('replies')
        .insert({
            content,
            topic_id,
            author_id: user.id
        });

    if (error) {
        console.error('Error creating reply:', error);
        return { error: 'Cevap gönderilirken bir hata oluştu.' };
    }

    // Touch the topic's updated_at field to bump it
    await supabase
        .from('topics')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', topic_id);

    revalidatePath(`/forum/${topic_slug}`);
    revalidatePath('/forum');
    
    return { success: true };
}
