import { Text } from "@/components/ui/text";
import { useUserActionsHook } from "@/features/user/user.hook";
import { useWeightJournalsActionsHook } from "@/features/weight-journals/weight-journals.hooks";
import {
  getErrorMessage,
  isUnauthorizedError,
  reportRequestError,
} from "@/lib/http-client";
import { useAppSelector } from "@/store/hooks";
import { IGeneratedNutritionTarget } from "@/features/nutrition-target/nutrition-target.types";
import BuildingStep from "./building-step";
import PlanResult from "./plan-result";
import { useFocusEffect, useRouter } from "expo-router";
import { ReactNode, useCallback, useState } from "react";
import { BackHandler, ScrollView, View } from "react-native";
import AboutStep from "./about-step";
import AgeGate from "./age-gate";
import BodyStep from "./body-step";
import FoodStep from "./food-step";
import GoalStep from "./goal-step";
import OnboardingFooter from "./onboarding-footer";
import OnboardingHeader from "./onboarding-header";
import {
  ADULT_AGE,
  GoalType,
  OnboardingValues,
  StepId,
} from "./onboarding.types";
import {
  getAge,
  getSteps,
  getTargetWeightRange,
  toPlanRequest,
} from "./onboarding.utils";
import PaceStep from "./pace-step";
import WeekStep from "./week-step";
import WelcomeStep from "./welcome-step";

const DEFAULT_HEIGHT = 170;
const DEFAULT_WEIGHT = 70;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

// A multi-step form held in one state object, kept while moving back and
// forth. Every answer comes from a picker, so nothing can be invalid; each
// step only checks it's answered.
export default function Onboarding() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.userSlice);
  const { latestWeightJournal, fetchLatestWeightJournal } =
    useWeightJournalsActionsHook();
  const {
    profile,
    fetchUser,
    isSavingOnboarding: isSubmitting,
    saveUserOnboarding,
  } = useUserActionsHook();
  // The server's reason when "Build my plan" fails (e.g. a validation rule).
  const [submitError, setSubmitError] = useState<string | null>(null);
  // After "Build my plan": the questions give way to the building screen,
  // then the generated targets.
  const [phase, setPhase] = useState<"questions" | "building" | "result">(
    "questions",
  );
  const [plan, setPlan] = useState<IGeneratedNutritionTarget | null>(null);
  const isBuilding = phase !== "questions";

  // 0 is the welcome screen; 1..n index into the question screens.
  const [position, setPosition] = useState(0);
  // Under 18: the flow stops here.
  const [isAgeGated, setIsAgeGated] = useState(false);
  // Starts from what's already known (saved height, latest weigh-in).
  const [values, setValues] = useState<OnboardingValues>(() => ({
    sex: null,
    dateOfBirth: null,
    heightCm: profile?.heightCm ?? DEFAULT_HEIGHT,
    weightKg: latestWeightJournal?.weightKg ?? DEFAULT_WEIGHT,
    goalType: null,
    targetWeightKg: null,
    pace: null,
    workoutsPerWeek: null,
    activityLevel: null,
    trainingType: null,
    avgSessionMinutes: null,
    dietType: null,
    allergies: null,
    healthFlags: null,
  }));

  const set = <K extends keyof OnboardingValues>(
    key: K,
    value: OnboardingValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // A changed answer makes the last failure stale.
    setSubmitError(null);
  };

  // The pace screen is left out for maintenance, so the count, the
  // progress bar and Back all follow the goal.
  const steps = getSteps(values.goalType);
  const stepId: StepId | undefined = steps[position - 1];

  const goBack = () => {
    // Not mid-submit: the answers are being saved.
    if (isSubmitting || isBuilding) return;
    if (isAgeGated) return router.back();
    if (position > 0) setPosition(position - 1);
    else router.back();
  };

  // Android's back button steps back through the questions before leaving.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          // Swallowed while the plan is built and shown.
          if (isBuilding) return true;
          if (position === 0 || isAgeGated) return false;
          setPosition(position - 1);
          return true;
        },
      );
      return () => subscription.remove();
    }, [position, isAgeGated, isBuilding]),
  );

  // Target weight, kept inside the ruler's range around the current weight
  // (which may have changed since it was set).
  const targetRange = getTargetWeightRange(values.weightKg);
  const targetWeightKg = clamp(
    values.targetWeightKg ?? values.weightKg,
    targetRange.min,
    targetRange.max,
  );

  // Saves the profile, records today's weigh-in and generates the first
  // nutrition target (Home's target updates from the response), then
  // reloads what changed. The building screen shows meanwhile; on a
  // failure, back to this step with the reason.
  const finish = async () => {
    setSubmitError(null);
    setPlan(null);
    setPhase("building");
    try {
      const generated = await saveUserOnboarding(
        user.id,
        toPlanRequest(values),
      );
      await Promise.all([
        fetchUser(user.id),
        fetchLatestWeightJournal(user.id),
      ]).catch((error) =>
        reportRequestError("Error refreshing after onboarding:", error),
      );
      setPlan(generated);
    } catch (error) {
      setPhase("questions");
      // 401 is already handled by sending the user to sign in.
      if (!isUnauthorizedError(error)) setSubmitError(getErrorMessage(error));
    }
  };

  const goNext = () => {
    if (
      stepId === "about" &&
      values.dateOfBirth &&
      getAge(values.dateOfBirth) < ADULT_AGE
    ) {
      setIsAgeGated(true);
      return;
    }
    // Keep the target the ruler showed (it may have been clamped).
    if (stepId === "pace") set("targetWeightKg", targetWeightKg);
    if (position === steps.length) finish();
    else setPosition(position + 1);
  };

  if (phase === "building") {
    return (
      <BuildingStep
        firstName={user.username?.split(" ")[0]}
        isDone={plan !== null}
        onSeePlan={() => setPhase("result")}
      />
    );
  }

  if (phase === "result" && plan) {
    return (
      <PlanResult
        target={plan}
        // Acknowledged: on to the app.
        onContinue={() => router.replace("/(tabs)/home")}
      />
    );
  }

  if (isAgeGated) return <AgeGate onExit={() => router.back()} />;

  if (position === 0) {
    return (
      <WelcomeStep
        // First-time users arrive with nothing behind them to go back to.
        onBack={router.canGoBack() ? goBack : undefined}
        onStart={() => setPosition(1)}
      />
    );
  }

  const screens: Record<
    StepId,
    {
      title: string;
      description: string;
      content: ReactNode;
      isAnswered: boolean;
      hint?: string;
    }
  > = {
    about: {
      title: "First, a bit about you",
      description: "We need both to estimate how much your body burns.",
      content: (
        <AboutStep
          sex={values.sex}
          dateOfBirth={values.dateOfBirth}
          onSexChange={(sex) => set("sex", sex)}
          onDateOfBirthChange={(date) => set("dateOfBirth", date)}
        />
      ),
      isAnswered: values.sex !== null && values.dateOfBirth !== null,
      hint: "Answer both to continue",
    },
    body: {
      title: "Your height and weight",
      description: "Slide to set them. A rough number is fine.",
      content: (
        <BodyStep
          height={values.heightCm}
          weight={values.weightKg}
          onHeightChange={(cm) => set("heightCm", cm)}
          onWeightChange={(kg) => set("weightKg", kg)}
        />
      ),
      isAnswered: true,
    },
    goal: {
      title: "What's your goal?",
      description: "You can change this anytime.",
      content: (
        <GoalStep
          goalType={values.goalType}
          onChange={(goalType) => set("goalType", goalType)}
        />
      ),
      isAnswered: values.goalType !== null,
      hint: "Pick a goal to continue",
    },
    pace: {
      title: "How fast do you want to go?",
      description: "Pick a target and a pace you can keep.",
      content: values.goalType && values.goalType !== GoalType.Maintenance && (
        <PaceStep
          goalType={values.goalType}
          weightKg={values.weightKg}
          targetWeightKg={targetWeightKg}
          pace={values.pace}
          onTargetWeightChange={(kg) => set("targetWeightKg", kg)}
          onPaceChange={(pace) => set("pace", pace)}
        />
      ),
      isAnswered: values.pace !== null,
      hint: "Pick a pace to continue",
    },
    week: {
      title: "What does your week look like?",
      description: "This sets how much you burn.",
      content: (
        <WeekStep
          workoutsPerWeek={values.workoutsPerWeek}
          activityLevel={values.activityLevel}
          trainingType={values.trainingType}
          avgSessionMinutes={values.avgSessionMinutes}
          onWorkoutsChange={(count) => set("workoutsPerWeek", count)}
          onActivityChange={(level) => set("activityLevel", level)}
          onTrainingTypeChange={(type) => set("trainingType", type)}
          onSessionChange={(minutes) => set("avgSessionMinutes", minutes)}
        />
      ),
      // Training type and session length only count with workouts.
      isAnswered:
        values.workoutsPerWeek !== null &&
        values.activityLevel !== null &&
        (values.workoutsPerWeek === 0 ||
          (values.trainingType !== null && values.avgSessionMinutes !== null)),
      hint: "Answer all to continue",
    },
    food: {
      title: "Food and health",
      description: "Last one. So your plan fits how you eat.",
      content: (
        <FoodStep
          dietType={values.dietType}
          allergies={values.allergies}
          healthFlags={values.healthFlags}
          onDietTypeChange={(dietType) => set("dietType", dietType)}
          onAllergiesChange={(allergies) => set("allergies", allergies)}
          onHealthFlagsChange={(flags) => set("healthFlags", flags)}
        />
      ),
      isAnswered:
        values.dietType !== null &&
        values.allergies !== null &&
        values.healthFlags !== null,
      hint: "Answer all to continue",
    },
  };

  const current = screens[stepId];
  const isLast = position === steps.length;

  return (
    <View className="flex-1 gap-6">
      <OnboardingHeader onBack={goBack} step={position} total={steps.length} />

      <ScrollView
        // A new scroll per screen, so each starts at the top.
        key={stepId}
        className="flex-1"
        contentContainerStyle={{ gap: 24, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          <Text className="font-sans-bold text-3xl">{current.title}</Text>
          <Text className="text-sm text-muted-foreground">
            {current.description}
          </Text>
        </View>
        {current.content}
      </ScrollView>

      <OnboardingFooter
        label={isLast ? "Build my plan" : "Continue"}
        hint={current.hint}
        disabled={!current.isAnswered}
        isLoading={isLast && isSubmitting}
        error={isLast ? submitError : null}
        onPress={goNext}
      />
    </View>
  );
}
