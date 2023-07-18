import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const options = [
  { value: "News", label: "News" },
  { value: "Lafda", label: "Lafda" },
  { value: "Song Review", label: "Song Review" },
  { value: "Album Review", label: "Album Review" },
  { value: "Song", label: "Song" },
  { value: "Album", label: "Album" },
];

export default function SubmitNews() {
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    tag: "", // Updated to an empty string
    description: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const mandatoryFields = ["title", "tag", "description"];

  const handleSubmit = () => {
    // Check if any mandatory field is empty
    const isAnyMandatoryFieldEmpty = mandatoryFields.some(
      (field) => !formData[field]
    );

    if (isAnyMandatoryFieldEmpty) {
      // If any mandatory field is empty, display an error message
      setSubmissionStatus("error");
      return;
    }

    // All mandatory fields are filled, proceed with submission
    fetch("http://localhost:5000/news/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        setSubmissionStatus("success");
        // Perform any additional actions after successful submission
      })
      .catch((error) => {
        console.error("Error:", error);
        setSubmissionStatus("error");
      });
  };

  useEffect(() => {
    return () => {
      setFormData({
        image: "",
        title: "",
        tag: "",
        description: "",
      });
      setSubmissionStatus(null);
    };
  }, []);

  let message = null;
  if (submissionStatus === "success") {
    message = (
      <Text style={styles.successMessage}>Form submitted successfully!</Text>
    );
  } else if (submissionStatus === "error") {
    message = (
      <Text style={styles.errorMessage}>
        An error occurred. Please try again.
      </Text>
    );
  }

  // Disable submit button if the "tag" field is empty or if any other mandatory field is empty
  const isSubmitDisabled =
    !formData.tag || mandatoryFields.some((field) => !formData[field]);

  return (
    <View style={styles.container}>
      {message}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={formData.title}
        onChangeText={(value) => handleChange("title", value)}
        placeholder="Title"
      />
      <Text style={styles.label}>Image Link</Text>
      <TextInput
        style={styles.input}
        value={formData.image}
        onChangeText={(value) => handleChange("image", value)}
        placeholder="Image Link"
      />

      <Text style={styles.label}>Tag</Text>
      <Picker
        style={styles.input}
        selectedValue={formData.tag}
        onValueChange={(value) => handleChange("tag", value)}
        mode="dropdown"
      >
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        value={formData.description}
        onChangeText={(value) => handleChange("description", value)}
        placeholder="Description"
        multiline
        numberOfLines={4}
        textAlignVertical="top" // Update this line
      />

      <TouchableOpacity
        style={[styles.button, isSubmitDisabled && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitDisabled}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  descriptionInput: {
    height: 200,
  },
  button: {
    backgroundColor: "gray",
    borderRadius: 4,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "lightgray",
  },
  successMessage: {
    color: "green",
    fontWeight: "bold",
    marginBottom: 16,
  },
  errorMessage: {
    color: "red",
    fontWeight: "bold",
    marginBottom: 16,
  },
});
