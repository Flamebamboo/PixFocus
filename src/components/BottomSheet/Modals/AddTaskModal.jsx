import React, { useState } from 'react';
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
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { useHaptics } from '@/hooks/useHaptics';
import COLORS from '@/utils/color';

const AddTaskModal = ({ visible, onClose, onAdd, labels }) => {
  const { triggerHaptic } = useHaptics();
  const [taskName, setTaskName] = useState('');
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState('#7C3FFF'); // Default color

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

    1) User enters task name and selects color in here
    2) creates an object with both properties: {name: "Task Name", color: "#selected-color"}
    3) This object is passed to the parent via the onAdd prop
    4) The parent's handleAddNewTask function receives this object and adds it to the labels array

    
    
    
    */
  }

  const handleSubmit = () => {
    const trimmingTask = taskName.trim();
    if (trimmingTask.length === 0) {
      setError('Task name cannot be empty');
      triggerHaptic('error');
      return;
    }

    if (labels.some((label) => label.name.toLowerCase() === trimmingTask.toLowerCase())) {
      setError('Task already exists');
      triggerHaptic('error');
      return;
    }
    const newTask = {
      name: trimmingTask,
      color: selectedColor, // Using the selectedColor state we added
    };

    onAdd(newTask);
    setTaskName('');
    setSelectedColor('#7C3FFF');
    setError('');
    onClose();
  };

  const handleInputChange = (text) => {
    setTaskName(text);
    setError('');
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Task</Text>

            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faTag} size={26} color={selectedColor} />
              <TextInput
                style={styles.input}
                inputMode="text"
                placeholder={`Enter Task Name`}
                placeholderTextColor="#C9C9C9"
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
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleSubmit}>
                <Text style={[styles.buttonText, { color: '#fff' }]}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddTaskModal;

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
  modalTitle: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'ReadexProBold',
  },
  input: {
    flex: 1, // Add this to make input take remaining space
    color: '#000',
    fontSize: 28,
    fontFamily: 'M5x7',
    marginLeft: 10, // Add spacing between icon and input
  },

  // Add this style
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
  addButton: {
    backgroundColor: '#9482DA',
    borderWidth: 4,
  },
  buttonText: {
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
