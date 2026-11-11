import HealthFlagsPicker from "@/components/profile-fields/health-flags-picker";
import { HealthFlag } from "../onboarding.types";

interface IProps {
  healthFlags: HealthFlag[] | null;
  onHealthFlagsChange: (healthFlags: HealthFlag[] | null) => void;
}

// Health conditions. The last step: each option says how it changes the plan.
export default function HealthStep({
  healthFlags,
  onHealthFlagsChange,
}: IProps) {
  return (
    <HealthFlagsPicker value={healthFlags} onChange={onHealthFlagsChange} />
  );
}
