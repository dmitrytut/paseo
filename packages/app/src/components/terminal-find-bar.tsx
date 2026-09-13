import { useCallback } from "react";
import type { ComponentType } from "react";
import { Pressable, Text, View, type PressableStateCallbackType } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { ChevronDown, ChevronUp, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { Theme } from "@/styles/theme";
import { SearchInput } from "@/components/ui/combobox";

const foregroundMutedColorMapping = (theme: Theme) => ({ color: theme.colors.foregroundMuted });
const ThemedChevronUp = withUnistyles(ChevronUp, foregroundMutedColorMapping);
const ThemedChevronDown = withUnistyles(ChevronDown, foregroundMutedColorMapping);
const ThemedX = withUnistyles(X, foregroundMutedColorMapping);

export interface TerminalFindBarProps {
  query: string;
  matchIndex: number;
  matchCount: number;
  onChangeQuery: (query: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

export function TerminalFindBar({
  query,
  matchIndex,
  matchCount,
  onChangeQuery,
  onNext,
  onPrevious,
  onClose,
}: TerminalFindBarProps) {
  const { t } = useTranslation();

  const handleQueryKeyPress = useCallback(
    (event: { nativeEvent: { key: string } }) => {
      if (event.nativeEvent.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  let matchLabel = "";
  if (query.length > 0) {
    matchLabel =
      matchCount === 0
        ? t("workspace.terminal.find.noMatches")
        : t("workspace.terminal.find.matchCount", { current: matchIndex + 1, total: matchCount });
  }

  return (
    <View style={styles.container} testID="terminal-find-bar">
      <View style={styles.inputContainer}>
        <SearchInput
          placeholder={t("workspace.terminal.find.placeholder")}
          onChangeText={onChangeQuery}
          onSubmitEditing={onNext}
          autoFocus
          onKeyPress={handleQueryKeyPress}
        />
      </View>
      {matchLabel ? <Text style={styles.matchLabel}>{matchLabel}</Text> : null}
      <FindBarButton
        icon={ThemedChevronUp}
        accessibilityLabel={t("workspace.terminal.find.previousMatch")}
        disabled={matchCount === 0}
        onPress={onPrevious}
      />
      <FindBarButton
        icon={ThemedChevronDown}
        accessibilityLabel={t("workspace.terminal.find.nextMatch")}
        disabled={matchCount === 0}
        onPress={onNext}
      />
      <FindBarButton
        icon={ThemedX}
        accessibilityLabel={t("workspace.terminal.find.close")}
        onPress={onClose}
      />
    </View>
  );
}

interface FindBarButtonProps {
  icon: ComponentType<{ size?: number }>;
  accessibilityLabel: string;
  disabled?: boolean;
  onPress: () => void;
}

function FindBarButton({
  icon: Icon,
  accessibilityLabel,
  disabled = false,
  onPress,
}: FindBarButtonProps) {
  const buttonStyle = useCallback(
    (state: PressableStateCallbackType) => [
      styles.button,
      state.pressed && styles.buttonPressed,
      disabled && styles.buttonDisabled,
    ],
    [disabled],
  );

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={buttonStyle}
    >
      <Icon size={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    position: "absolute",
    top: theme.spacing[2],
    right: theme.spacing[2],
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[1],
    backgroundColor: theme.colors.surface0,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    zIndex: 10,
    ...theme.shadow.md,
  },
  inputContainer: {
    width: 200,
  },
  matchLabel: {
    color: theme.colors.foregroundMuted,
    fontSize: 12,
    minWidth: 56,
    textAlign: "center",
  },
  button: {
    padding: theme.spacing[1],
    borderRadius: theme.borderRadius.md,
  },
  buttonPressed: {
    backgroundColor: theme.colors.surface1,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
}));
