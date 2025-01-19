import * as Haptics from "expo-haptics";
import { useGlobalContext } from "@/context/GlobalProvider";

export const useHaptics = () => {
  const { isHapticsEnabled } = useGlobalContext();

  const triggerHaptic = async (type = "light") => {
    if (!isHapticsEnabled) return;

    switch (type) {
    case "light":
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case "medium":
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case "heavy":
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case "success":
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case "error":
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
    default:
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return { triggerHaptic };
};
