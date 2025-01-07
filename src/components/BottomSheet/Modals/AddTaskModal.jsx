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
const AddTaskModal = ({ visible, onClose, onAdd, labels }) => {
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
      return;
    }

    if (labels.some((label) => label.name.toLowerCase() === trimmingTask.toLowerCase())) {
      setError('Task already exists');
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
                placeholderTextColor="#666666"
                value={taskName}
                maxLength={10}
                onChangeText={handleInputChange}
                autoFocus
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

              <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Add Task</Text>
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
    backgroundColor: 'rgba(148, 130, 218, 0.5)', // Matching your backdrop color with opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    height: '45%',
    backgroundColor: '#141414', // Matching your modal background
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1, // Add this to make input take remaining space
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10, // Add spacing between icon and input
  },

  // Add this style
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
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
    backgroundColor: '#3D3D3D',
  },
  addButton: {
    backgroundColor: '#9482DA', // Matching your theme color
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  colorSelector: {
    marginVertical: 15,
  },
  colorTitle: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#ffffff',
  },
});
