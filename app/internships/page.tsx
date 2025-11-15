import { getAllInternships } from '@/lib/actions/internshipActions';
import InternshipsClient from './InternshipsClient';

export default async function InternshipsPage() {
  const result = await getAllInternships();

  return (
    <InternshipsClient initialInternships={result.success ? result.data || [] : []} />
  );
}

