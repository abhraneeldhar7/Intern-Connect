import { getAllInternships } from '@/lib/actions/internshipActions';
import InternshipsClient from './InternshipsClient';

export default async function InternshipsPage() {
  const result = await getAllInternships();

  const internships = result.success ? result.data || [] : [];
  const serializedInternships = JSON.parse(JSON.stringify(internships));

  return (
    <InternshipsClient initialInternships={serializedInternships} />
  );
}

