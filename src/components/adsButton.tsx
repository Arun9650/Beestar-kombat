import { useCallback, ReactElement } from 'react'
import { useAdsgram } from "@/hooks/useAdsgram";
import { ShowPromiseResult } from "@/../utils/types";
import { useRouter } from 'next/navigation';


export function ShowAdButton(): ReactElement {
    const router = useRouter();
    
  const onReward = useCallback(() => {
    alert('Reward');
    router.push("/");
  }, []);

  const onError = useCallback((result: ShowPromiseResult) => {
    alert(JSON.stringify(result, null, 4));
  }, []);

  /**
   * insert your-block-id
   */
  const showAd = useAdsgram({ blockId: "2691", onReward, onError });

  return (
    <button onClick={showAd}>Show Ad</button>
  )
}