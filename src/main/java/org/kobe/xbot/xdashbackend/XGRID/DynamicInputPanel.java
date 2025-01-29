package org.kobe.xbot.xdashbackend.XGRID;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

public class DynamicInputPanel extends JPanel {
    private final JTextField keyField;
    private final JComboBox<String> typeDropdown;
    private final JPanel valuePanel;
    private JTextField singleValueField;
    private DefaultListModel<String> listModel;
    private JList<String> listComponent;
    private JCheckBox booleanCheckbox;

    public DynamicInputPanel() {
        setLayout(new BorderLayout(10, 10));

        // Key input field
        JPanel keyPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        keyPanel.add(new JLabel("Key:"));
        keyField = new JTextField(20);
        keyPanel.add(keyField);
        add(keyPanel, BorderLayout.NORTH);

        // Dropdown for type selection
        JPanel typePanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        typePanel.add(new JLabel("Type:"));
        String[] types = {"String", "Double", "Integer", "Float", "Boolean",
                "DoubleList", "StringList", "IntegerList", "LongList", "FloatList", "BooleanList"};
        typeDropdown = new JComboBox<>(types);
        typePanel.add(typeDropdown);
        add(typePanel, BorderLayout.WEST);

        // Value input area
        valuePanel = new JPanel(new BorderLayout());
        setupSingleInput(); // Default UI
        add(valuePanel, BorderLayout.CENTER);

        // Handle dropdown selection changes
        typeDropdown.addItemListener(e -> updateValueInput((String) typeDropdown.getSelectedItem()));
    }

    private void updateValueInput(String type) {
        valuePanel.removeAll();

        if (type.endsWith("List")) {
            setupListInput();
        } else if (type.equals("Boolean")) {
            setupBooleanInput();
        } else {
            setupSingleInput();
        }

        valuePanel.revalidate();
        valuePanel.repaint();
    }

    private void setupSingleInput() {
        singleValueField = new JTextField(20);
        valuePanel.add(singleValueField, BorderLayout.CENTER);
    }

    private void setupBooleanInput() {
        booleanCheckbox = new JCheckBox("True/False");
        valuePanel.add(booleanCheckbox, BorderLayout.CENTER);
    }

    private void setupListInput() {
        listModel = new DefaultListModel<>();
        listComponent = new JList<>(listModel);
        JScrollPane scrollPane = new JScrollPane(listComponent);

        JButton addButton = new JButton("Add");
        JButton removeButton = new JButton("Remove");

        addButton.addActionListener(e -> {
            String input = JOptionPane.showInputDialog("Enter a value:");
            if (input != null && !input.trim().isEmpty()) {
                listModel.addElement(input.trim());
            }
        });

        removeButton.addActionListener(e -> {
            int selectedIndex = listComponent.getSelectedIndex();
            if (selectedIndex != -1) {
                listModel.remove(selectedIndex);
            }
        });

        JPanel buttonPanel = new JPanel(new FlowLayout());
        buttonPanel.add(addButton);
        buttonPanel.add(removeButton);

        valuePanel.add(scrollPane, BorderLayout.CENTER);
        valuePanel.add(buttonPanel, BorderLayout.SOUTH);
    }

    public String getKey() {
        return keyField.getText().trim();
    }

    public String getSelectedType() {
        return (String) typeDropdown.getSelectedItem();
    }

    public Object getEnteredValue() {
        String type = getSelectedType();
        if (type.endsWith("List")) {
            List<String> values = new ArrayList<>();
            for (int i = 0; i < listModel.size(); i++) {
                values.add(listModel.get(i));
            }
            return values;
        } else if (type.equals("Boolean")) {
            return booleanCheckbox.isSelected();
        } else {
            return singleValueField.getText().trim();
        }
    }
}

