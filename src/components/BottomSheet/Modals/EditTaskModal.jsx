import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTag, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import COLORS from '@/utils/color';
import * as Haptics from 'expo-haptics';

const EditTaskModal = ({ visible, onClose, onEdit, onDelete, labels, task }) => {
  const [taskName, setTaskName] = useState(task ? task.name : '');
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState(task ? task.color : '#7C3FFF');
  const colors = [
    '#7C3FFF',
    '#FF5452',
    '#3FFFA9',
    '#FFDF3F',
    '#FF9B3F',
    '#3FCEFF',
    '#FF3F9B',
    '#3FFF3F',
    '#FF3F3F',
    '#3F3FFF',
  ];

  {
    /*
    Dataflow: 

    1) User clicks the current task in TaskList this will open the EditTaskModal
    2) User can edit the task name and color in here
    3) Retrieve the current task name and color from the parent component
    4) renders the current task name and color in the input and color selector
    5) User can edit the task name and color

    
    
    
    */
  }

  useEffect(() => {
    if (task) {
      setTaskName(task.name);
      setSelectedColor(task.color);
    }
  }, [task]);

  const handleSubmit = () => {
    const trimmingTask = taskName.trim();
    if (trimmingTask.length === 0) {
      setError('Task name cannot be empty');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (labels.some((label) => label.name.toLowerCase() === trimmingTask.toLowerCase() && label.name !== task.name)) {
      //exclude the current edit task
      setError('Task already exists');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    const newTask = {
      name: trimmingTask,
      color: selectedColor, // Using the selectedColor state we added
    };

    onEdit(newTask);
    setTaskName('');
    setSelectedColor('#7C3FFF');
    setError('');
    onClose();
  };

  const handleInputChange = (text) => {
    setTaskName(text);
    setError('');
  };

  const handleDelete = () => {
    onDelete(task);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <FontAwesomeIcon icon={faTrashCan} size={20} color="#FF3B30" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Task</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faTag} size={26} color={selectedColor} />
              <TextInput
                style={styles.input}
                inputMode="text"
                placeholder={`Enter Task Name`}
                placeholderTextColor="#666666"
                value={taskName}
                maxLength={10}
                onChangeText={handleInputChange}
                selectTextOnFocus={false} // Prevent text selection on focus
              />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.colorSelector}>
              <Text style={styles.colorTitle}>Select Color</Text>
              <View style={styles.colorGrid}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditTaskModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(148, 130, 218, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    height: '50%',
    backgroundColor: COLORS.lightpink,
    borderWidth: 4,
    borderTopRightRadius: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    color: 'red',
    fontFamily: 'ReadexProBold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  modalTitle: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'ReadexProBold',
  },
  deleteButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999, // Add zIndex to ensure button is clickable
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderRadius: 9,
    borderColor: '#000',
    width: 40,
    height: 40,
    backgroundColor: '#fff',
  },
  placeholder: {
    width: 36,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 28,
    fontFamily: 'M5x7',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 4,
    padding: 15,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#E1B1F8',
    borderWidth: 4,
  },
  saveButton: {
    backgroundColor: '#9482DA',
    borderWidth: 4,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'ReadexProSemiBold',
  },
  colorSelector: {
    marginVertical: 15,
  },
  colorTitle: {
    color: '#000',
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'ReadexProSemiBold',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#000',
  },
});
