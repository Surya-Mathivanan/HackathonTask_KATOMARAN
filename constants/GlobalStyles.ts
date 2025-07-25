import { Dimensions, Platform, StyleSheet, TextStyle } from 'react-native';

const { width } = Dimensions.get('window');

type FontWeight = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";

export const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E5E5',
    tertiary: '#B3B3B3',
  },
  background: {
    primary: '#000000',
    secondary: '#1A1A1A',
    tertiary: '#2D2D2D',
  },
  border: {
    light: '#2D2D2D',
    medium: '#404040',
    dark: '#666666',
  },
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
  },
  button: {
    primary: '#FFD700',
    secondary: '#2D2D2D',
    google: '#EA4335',
    apple: '#FFFFFF',
    facebook: '#1877F2',
    twitter: '#1DA1F2',
  },
  priority: {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
  },
  gradient: {
    primary: ['#FFD700', '#FFA500'],
    secondary: ['#10B981', '#FFD700'],
    tertiary: ['#F59E0B', '#EF4444'],
  }
};

export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  h4: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0,
    lineHeight: 20,
  }
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  }),
  xl: Platform.select({
    ios: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
    },
    android: {
      elevation: 10,
    },
  }),
};

export const globalStyles = StyleSheet.create({
  // Layout Styles
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  // Card Styles
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...shadows.sm,
  },
  cardElevated: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 0,
    ...shadows.md,
  },

  // Input Styles
  input: {
    height: 48,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    marginBottom: spacing.lg,
  },
  inputFocused: {
    borderColor: colors.primary,
    ...shadows.sm,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  searchInput: {
    marginHorizontal: spacing.xl,
    marginVertical: spacing.md,
  },

  // Button Styles
  button: {
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: colors.button.primary,
    ...shadows.sm,
  },
  buttonSecondary: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    ...typography.button,
    marginLeft: spacing.sm,
  },
  buttonTextPrimary: {
    color: colors.background.primary,
  },
  buttonTextSecondary: {
    color: colors.text.primary,
  },
  buttonTextOutline: {
    color: colors.primary,
  },

  // Social Button Styles
  socialButton: {
    width: '100%',
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: spacing.sm,
    ...shadows.sm,
  },

  // Divider Styles
  divider: {
    height: 1,
    backgroundColor: colors.border.medium,
    marginVertical: spacing.lg,
    width: '100%',
  },
  dividerWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.medium,
  },
  dividerText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.background.primary,
  },

  // Text Styles
  errorText: {
    ...typography.body2,
    color: colors.status.error,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#2D1B1B',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#4D2626',
  },
  successText: {
    ...typography.body2,
    color: colors.status.success,
    marginBottom: spacing.sm,
  },
  link: {
    ...typography.button,
    color: colors.primary,
  },

  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    ...shadows.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: 2,
  },
  userEmail: {
    ...typography.body2,
    color: colors.text.secondary,
  },

  // Auth Screen Styles
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background.primary,
  },
  authCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.xxxl,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: spacing.xxxxl,
  },
  authTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  authSubtitle: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  // Task List Styles
  taskContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...shadows.sm,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  taskDate: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  taskPriorityIndicator: {
    width: 4,
    height: 32,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.md,
  },
  taskPriorityLow: {
    backgroundColor: colors.priority.low,
  },
  taskPriorityMedium: {
    backgroundColor: colors.priority.medium,
  },
  taskPriorityHigh: {
    backgroundColor: colors.priority.high,
  },

  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.medium,
    ...shadows.sm,
  },
  searchIcon: {
    marginRight: spacing.md,
  },
  searchInputField: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    ...shadows.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  tabText: {
    ...typography.body2,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  tabTextActive: {
    ...typography.body2,
    fontWeight: 'bold',
    color: colors.background.primary,
  },

  // FAB Styles
  fab: {
    position: 'absolute',
    bottom: spacing.xxxl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.xl,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: 34,
    maxHeight: '80%',
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  modalContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },

  // Input Group Styles
  inputGroup: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    ...typography.body2,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  // Priority Styles
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.medium,
    backgroundColor: colors.background.tertiary,
  },
  priorityButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background.secondary,
    ...shadows.sm,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  priorityText: {
    ...typography.body2,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  priorityTextSelected: {
    ...typography.body2,
    fontWeight: 'bold',
    color: colors.text.primary,
  },

  // Date Button Styles
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.tertiary,
  },
  dateText: {
    ...typography.body1,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },

  // Delete Action Styles
  deleteButton: {
    backgroundColor: colors.status.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body1,
    color: colors.text.secondary,
    marginTop: spacing.lg,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    ...typography.h4,
    color: colors.text.secondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body2,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  // List Container
  listContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },

  // Close Button
  closeButton: {
    padding: spacing.xs,
  },

  // Cancel and Save Buttons
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
  },
  cancelText: {
    ...typography.button,
    color: colors.text.secondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    ...shadows.sm,
  },
  saveText: {
    ...typography.button,
    color: colors.background.primary,
  },
});

export default globalStyles;