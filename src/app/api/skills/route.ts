import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server-client';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('search') || '';
  const supabase = await createSupabaseServerClient({ req: request });
  const {
    data,
    error,
    status,
  } = await supabase
    .from('skills')
    .select('id, name', { count: 'exact' })
    .ilike('name', `%${q}%`)
    .limit(10);

  if (error) {
    const code = status === 401 ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status: code });
  }

  return NextResponse.json(data);
}