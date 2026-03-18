'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function adminLogin(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', password, {
      httpOnly: true,
      secure: process.env.NODE_VERSION === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid password' };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}
