import MusicLayout from "@/components/MusicLayout";
import { getTracks, getSelections } from "@/lib/api";
import CenterBlock from "@/components/CenterBlock/CenterBlock";

export default async function Home() {
  const [tracks, selections] = await Promise.all([getTracks(), getSelections()]);
  return (
    <MusicLayout selections={selections}><CenterBlock tracks={tracks} /></MusicLayout>
  );
}
