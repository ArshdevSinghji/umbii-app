import ChildSheet from "@/components/meal-sheet/child-sheet";
import { ActionButton } from "@/components/ui/action-button";
import { errorToast } from "@/components/ui/app-toaster";
import { Text } from "@/components/ui/text";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { removeFoodLog } from "@/features/food-logs/food-logs.slice";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import {
  getErrorMessage,
  getErrorStatus,
  isUnauthorizedError,
} from "@/lib/http-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { View } from "react-native";

interface IProps {
  visible: boolean;
  log: IFoodLog;
  onClose: () => void;
  // Deleted (or already gone): close the meal sheet too.
  onDeleted: () => void;
  // Lets the parent refuse to close while the delete is in flight.
  onBusyChange: (isBusy: boolean) => void;
}

// Delete confirmation as a child sheet over the meal sheet (an AlertDialog
// would portal behind the Modal). The slice drops the log from every list,
// so Home's totals and Stats update without a refetch.
export default function DeleteMealSheet({
  visible,
  log,
  onClose,
  onDeleted,
  onBusyChange,
}: IProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userSlice);
  const { deleteFoodLog } = useFoodLogsActionsHook();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setBusy = (busy: boolean) => {
    setIsBusy(busy);
    onBusyChange(busy);
  };

  const handleClose = () => {
    if (isBusy) return;
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteFoodLog(user.id, log.id);
      onDeleted();
    } catch (err) {
      // 401 is already heading to sign-in.
      if (isUnauthorizedError(err)) return onDeleted();
      // Gone already (deleted on another device): just drop it here too.
      if (getErrorStatus(err) === 404) {
        errorToast("This meal was already deleted");
        dispatch(removeFoodLog(log.id));
        return onDeleted();
      }
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ChildSheet
      visible={visible}
      title="Delete this meal?"
      description="Its calories and nutrients will be taken off your totals. To count this meal again, you'll need to log it again yourself."
      onClose={handleClose}
    >
      {error && <Text className="text-sm text-destructive">{error}</Text>}
      <View className="flex-row gap-2">
        <ActionButton
          className="flex-1"
          variant="outline"
          label="Cancel"
          onPress={handleClose}
          disabled={isBusy}
        />
        <ActionButton
          className="flex-1"
          variant="destructive"
          label="Delete"
          onPress={handleDelete}
          isLoading={isBusy}
        />
      </View>
    </ChildSheet>
  );
}
