"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from 'next/cache';

type FormState = {
  error?: string;
  success?: boolean;
};

export async function createTag(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string;

  if (!name || name.trim().length === 0) {
    return { error: 'Tag name is required' };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from('tags').insert({ name: name.trim() });

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/tags');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to create tag' };
  }
}