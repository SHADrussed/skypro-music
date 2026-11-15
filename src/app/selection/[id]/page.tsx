import MusicLayout from "@/components/MusicLayout";
import CenterBlock from "@/components/CenterBlock/CenterBlock";
import { getSelection, getTracks, getSelections } from "@/lib/api";
export default async function SelectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [selection, tracks, selections] = await Promise.all([getSelection(id), getTracks(), getSelections()]);
  const ids = new Set(selection.items);
  return <MusicLayout selections={selections}><CenterBlock title={selection.name ?? "Подборка"} tracks={tracks.filter(track => ids.has(track._id))} /></MusicLayout>;
}
