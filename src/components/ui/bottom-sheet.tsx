import BottomSheetLib, { BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { forwardRef } from 'react';

interface IProps {
  snapPoints?: string[];
  children: React.ReactNode;
  onClose?: () => void;
}

export const BottomSheet = forwardRef<BottomSheetLib, IProps>(
  ({ snapPoints, children, onClose }, ref) => {
    return (
      <BottomSheetLib
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
      >
        <BottomSheetView style={{ padding: 16 }}>
          {children}
        </BottomSheetView>
      </BottomSheetLib>
    );
  }
);