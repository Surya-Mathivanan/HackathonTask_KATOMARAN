import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_KEY_PREFIX = "@todo_tasks_";

// Get all tasks for a specific user
export const getTasks = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const tasksKey = `${TASKS_KEY_PREFIX}${userId}`;
    const storedTasks = await AsyncStorage.getItem(tasksKey);
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error("Error getting tasks:", error);
    throw error;
  }
};

// Add a new task
export const addTask = async (userId, taskData) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const tasksKey = `${TASKS_KEY_PREFIX}${userId}`;
    const existingTasks = await getTasks(userId);

    const newTask = {
      id: Date.now().toString(), // Generate a unique ID
      ...taskData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...existingTasks];
    await AsyncStorage.setItem(tasksKey, JSON.stringify(updatedTasks));

    return newTask;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData, userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const tasksKey = `${TASKS_KEY_PREFIX}${userId}`;
    const existingTasks = await getTasks(userId);

    const updatedTasks = existingTasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          ...taskData,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });

    await AsyncStorage.setItem(tasksKey, JSON.stringify(updatedTasks));
    return updatedTasks.find((task) => task.id === taskId);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId, userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const tasksKey = `${TASKS_KEY_PREFIX}${userId}`;
    const existingTasks = await getTasks(userId);

    const updatedTasks = existingTasks.filter((task) => task.id !== taskId);
    await AsyncStorage.setItem(tasksKey, JSON.stringify(updatedTasks));

    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Clear all tasks for a user
export const clearTaskCache = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const tasksKey = `${TASKS_KEY_PREFIX}${userId}`;
    await AsyncStorage.removeItem(tasksKey);
  } catch (error) {
    console.error("Error clearing tasks:", error);
    throw error;
  }
};
