import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { colors, globalStyles } from "../constants/GlobalStyles";
import { useAuth } from "../context/AuthContext";
import {
  addTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/TaskService";
import DateTimePickerWeb from "./DateTimePickerWeb";

const TaskListScreen = () => {
  const { logout, currentUser } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("low");
  const [editTaskId, setEditTaskId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    console.log("Current user state:", currentUser);
    if (!currentUser) {
      console.log("No user found, redirecting to login");
      router.replace("/login");
      return;
    }
    console.log("User authenticated, fetching tasks for:", currentUser.uid);
    fetchTasks();
  }, [currentUser]);

  useEffect(() => {
    filterTasks();
  }, [search, tab, tasks]);

  const fetchTasks = async () => {
    if (!currentUser) {
      console.log("No user found in fetchTasks");
      return;
    }
    setLoading(true);
    try {
      console.log("Fetching tasks for user:", currentUser.uid);
      const fetchedTasks = await getTasks(currentUser.uid);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Alert.alert("Error", "Failed to fetch tasks");
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const filterTasks = () => {
    const today = new Date().toDateString();
    const filtered = tasks.filter((task) => {
      const titleMatch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());
      if (tab === "All") return titleMatch;
      if (tab === "Today")
        return titleMatch && new Date(task.dueDate).toDateString() === today;
      if (tab === "Upcoming")
        return titleMatch && new Date(task.dueDate).toDateString() !== today;
    });
    setFilteredTasks(filtered);
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id, currentUser.uid);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert("Error", "Failed to delete task");
    }
  };

  const openEditModal = (task) => {
    setTitle(task.title);
    setDueDate(new Date(task.dueDate));
    setPriority(task.priority);
    setEditTaskId(task.id);
    setModalVisible(true);
  };

  const handleSaveTask = async () => {
    if (!currentUser) {
      console.log("No user found in handleSaveTask");
      Alert.alert("Error", "You must be logged in to save tasks");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Error", "Title cannot be empty");
      return;
    }

    const taskData = {
      title,
      dueDate: dueDate.toISOString(),
      priority,
      userId: currentUser.uid,
    };

    try {
      console.log("Saving task for user:", currentUser.uid, taskData);
      if (editTaskId) {
        await updateTask(editTaskId, taskData, currentUser.uid);
      } else {
        await addTask(currentUser.uid, taskData);
      }

      setModalVisible(false);
      setTitle("");
      setDueDate(new Date());
      setPriority("low");
      setEditTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      Alert.alert("Error", "Failed to save task");
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const renderRightActions = (taskId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteTask(taskId)}
    >
      <Ionicons name="trash" size={20} color="#fff" />
    </TouchableOpacity>
  );

  const renderTaskItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity
        style={[styles.taskItem, styles[item.priority]]}
        onPress={() => openEditModal(item)}
      >
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskDate}>Due: {formatDate(item.dueDate)}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={[
              styles.priorityIndicator,
              styles[`${item.priority}Indicator`],
            ]}
          />
          <TouchableOpacity
            onPress={() => handleDeleteTask(item.id)}
            style={{ marginLeft: 12, padding: 4 }}
            accessibilityLabel="Delete task"
          >
            <Ionicons name="trash" size={20} color={colors.status.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out");
    }
  };

  const renderHeader = () => {
    const defaultAvatar =
      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: currentUser?.photoURL || defaultAvatar }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {currentUser?.displayName || "My Workspace"}
            </Text>
            <Text style={styles.userEmail}>{currentUser?.email || ""}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.text.secondary}
          />
          <Text style={styles.userInfo}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.text.tertiary}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search tasks..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor={colors.text.tertiary}
        />
      </View>

      <View style={styles.tabContainer}>
        {["All", "Today", "Upcoming"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabButton, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="clipboard-outline"
                size={64}
                color={colors.text.tertiary}
              />
              <Text style={styles.emptyText}>No tasks found</Text>
              <Text style={styles.emptySubtext}>
                Create your first task to get started
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditTaskId(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={24} color={colors.background.primary} />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editTaskId ? "Edit Task" : "New Task"}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  placeholder="Enter task title"
                  value={title}
                  onChangeText={setTitle}
                  style={styles.modalInput}
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Due Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateButton}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.dateText}>{formatDate(dueDate)}</Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && Platform.OS !== "web" && (
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDueDate(selectedDate);
                  }}
                />
              )}

              {showDatePicker && Platform.OS === "web" && (
                <DateTimePickerWeb
                  value={dueDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDueDate(selectedDate);
                  }}
                />
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Priority</Text>
                <View style={styles.priorityRow}>
                  {["low", "medium", "high"].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.priorityButton,
                        priority === p && styles.selectedPriority,
                        priority === p &&
                          styles[
                            `selected${p.charAt(0).toUpperCase() + p.slice(1)}`
                          ],
                      ]}
                      onPress={() => setPriority(p)}
                    >
                      <View style={[styles.priorityDot, styles[`${p}Dot`]]} />
                      <Text
                        style={[
                          styles.priorityText,
                          priority === p && styles.selectedPriorityText,
                        ]}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              {editTaskId && (
                <TouchableOpacity
                  onPress={async () => {
                    await handleDeleteTask(editTaskId);
                    setModalVisible(false);
                  }}
                  style={[
                    styles.saveButton,
                    { backgroundColor: colors.status.error },
                  ]}
                >
                  <Ionicons
                    name="trash"
                    size={18}
                    color={colors.background.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.saveText,
                      { color: colors.background.primary },
                    ]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleSaveTask}
                style={styles.saveButton}
              >
                <Text style={styles.saveText}>
                  {editTaskId ? "Update" : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

export default TaskListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.medium,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.background.primary,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  priorityIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginLeft: 12,
  },
  lowIndicator: {
    backgroundColor: colors.priority.low,
  },
  mediumIndicator: {
    backgroundColor: colors.priority.medium,
  },
  highIndicator: {
    backgroundColor: colors.priority.high,
  },
  deleteButton: {
    backgroundColor: colors.status.error,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.secondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: "80%",
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.tertiary,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.tertiary,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
  },
  priorityRow: {
    flexDirection: "row",
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.medium,
    backgroundColor: colors.background.tertiary,
  },
  selectedPriority: {
    borderColor: colors.primary,
    backgroundColor: colors.background.secondary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  selectedLow: {
    borderColor: colors.priority.low,
    backgroundColor: "#1A2E1A",
  },
  selectedMedium: {
    borderColor: colors.priority.medium,
    backgroundColor: "#2E2A1A",
  },
  selectedHigh: {
    borderColor: colors.priority.high,
    backgroundColor: "#2E1A1A",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  lowDot: {
    backgroundColor: colors.priority.low,
  },
  mediumDot: {
    backgroundColor: colors.priority.medium,
  },
  highDot: {
    backgroundColor: colors.priority.high,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  selectedPriorityText: {
    color: colors.text.primary,
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.secondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.background.primary,
  },
});
