import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/services/userService';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const userProfile = await getUserProfile(userId);

    if (!userProfile) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
