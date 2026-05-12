import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function getAuthedUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.id as string | undefined;
}
