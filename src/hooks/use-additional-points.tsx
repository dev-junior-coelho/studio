import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { collection, query, where, CollectionReference } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Produto } from '@/lib/types';

export function useAdditionalPoints(selectedRegiaoId: string | null) {
  const firebase = useFirebase();
  const { firestore } = firebase;

  const pointsQuery = useMemoFirebase(() => {
    if (!firestore || !selectedRegiaoId) return null;
    return query(
      collection(firestore, 'produtos') as CollectionReference<Produto>,
      where('tipo', '==', 'Ponto Adicional'),
      where('regiaoId', 'in', [selectedRegiaoId, 'nacional'])
    );
  }, [firestore, selectedRegiaoId]);

  const { data: additionalPoints, isLoading } = useCollection<Produto>(pointsQuery);

  return {
    additionalPoints: additionalPoints || [],
    isLoading
  };
}