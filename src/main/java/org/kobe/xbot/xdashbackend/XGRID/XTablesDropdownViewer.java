package org.kobe.xbot.xdashbackend.XGRID;

import com.formdev.flatlaf.fonts.jetbrains_mono.FlatJetBrainsMonoFont;
import org.kobe.xbot.Client.XTablesClient;
import org.kobe.xbot.Utilities.XTablesData;

import javax.swing.*;
import javax.swing.event.CellEditorListener;
import javax.swing.event.ChangeEvent;
import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.DefaultTreeCellEditor;
import javax.swing.tree.DefaultTreeCellRenderer;
import javax.swing.tree.DefaultTreeModel;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.EventObject;
import java.util.Map;

public class XTablesDropdownViewer extends JPanel {
    private final XTablesData cache;
    private final JTree tree;
    private Font treeFont;
    public XTablesDropdownViewer(JFrame parent, XTablesClient client, XTablesData cache) {
        this.cache = cache;
        setLayout(new BorderLayout());
        treeFont = new Font(FlatJetBrainsMonoFont.FAMILY, Font.PLAIN, 18);  // Set the initial font size


        // Create tree model without a root
        DefaultMutableTreeNode invisibleRoot = new DefaultMutableTreeNode(); // Invisible root
        DefaultTreeModel treeModel = new DefaultTreeModel(invisibleRoot);
        treeModel.setRoot(null); // Hides the root

        tree = new JTree(treeModel);
        tree.setEditable(true);
        tree.setCellEditor(new DefaultTreeCellEditor(tree, new DefaultTreeCellRenderer()) {
            @Override
            public boolean isCellEditable(EventObject event) {
                DefaultMutableTreeNode node = (DefaultMutableTreeNode) tree.getLastSelectedPathComponent();
                if (node != null && node.getUserObject() instanceof KeyValueNode) {
                    KeyValueNode kvNode = (KeyValueNode) node.getUserObject();
                    return kvNode.isValue; // Only allow editing of 'value' nodes
                }
                return false;
            }
        });

        // Listen for edit completion
        tree.getCellEditor().addCellEditorListener(new CellEditorListener() {
            @Override
            public void editingStopped(ChangeEvent e) {
                DefaultMutableTreeNode editedNode = (DefaultMutableTreeNode) tree.getLastSelectedPathComponent();
                if (editedNode != null) {
                    KeyValueNode kvNode = (KeyValueNode) editedNode.getUserObject();
                    if (kvNode.isValue) {
                        kvNode.value = tree.getCellEditor().getCellEditorValue().toString();
                    }
                    onUpdate(kvNode); // Pass the full key and updated value
                }
                populateTable(); // Refresh the tree view
            }

            @Override
            public void editingCanceled(ChangeEvent e) {
                // Handle cancel case if necessary
            }
        });

        JScrollPane scrollPane = new JScrollPane(tree);
        add(scrollPane, BorderLayout.CENTER);
        tree.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {

                if (e.isControlDown()) {
                    if (e.getKeyCode() == KeyEvent.VK_PLUS || e.getKeyCode() == KeyEvent.VK_EQUALS) {
                        deriveFont(1);
                    } else if (e.getKeyCode() == KeyEvent.VK_MINUS) {
                        deriveFont(-1);
                    }else if (e.getKeyCode() == KeyEvent.VK_R) {
                        treeFont = new Font(FlatJetBrainsMonoFont.FAMILY, Font.PLAIN, 18);
                        tree.setFont(treeFont);
                    }
                }
            }
        });

        tree.setFont(treeFont);
        populateTable();
    }
    public void deriveFont(float size) {
        float newSize = treeFont.getSize() + size;
        if(newSize < 8 || newSize > 72) return;
        treeFont = treeFont.deriveFont(newSize);
        tree.setFont(treeFont);
    }
    public void populateTable() {
        DefaultMutableTreeNode root = new DefaultMutableTreeNode();

        // Recursively populate tree
        addNodes(root, cache, "");

        DefaultTreeModel model = (DefaultTreeModel) tree.getModel();
        model.setRoot(root);

        tree.setRootVisible(false); // Hides the root node
        tree.setShowsRootHandles(true); // Shows expand/collapse handles
        model.reload(root);
        expandAllRows();
        revalidate();
        repaint();
    }
    public void updateNode(String key, String value) {
        DefaultTreeModel model = (DefaultTreeModel) tree.getModel();
        DefaultMutableTreeNode root = (DefaultMutableTreeNode) model.getRoot();

        // Start the recursive search from the root node
        updateNodeRecursive(root, key, value, model);
    }






    private void updateNodeRecursive(DefaultMutableTreeNode currentNode, String key, String value, DefaultTreeModel model) {
        String[] keyParts = key.split("\\.");
        DefaultMutableTreeNode parentNode = currentNode;

        StringBuilder currentKey = new StringBuilder();
        for (int i = 0; i < keyParts.length; i++) {
            currentKey.append(keyParts[i]);
            String partialKey = currentKey.toString();

            DefaultMutableTreeNode nextNode = null;
            for (int j = 0; j < parentNode.getChildCount(); j++) {
                DefaultMutableTreeNode childNode = (DefaultMutableTreeNode) parentNode.getChildAt(j);
                KeyValueNode kvNode = (KeyValueNode) childNode.getUserObject();
                if (kvNode.key.equals(partialKey)) {
                    nextNode = childNode;
                    break;
                }
            }

            if (nextNode == null) {
                KeyValueNode newNode = new KeyValueNode(partialKey, "", false);
                nextNode = new DefaultMutableTreeNode(newNode);
                parentNode.add(nextNode);
                model.nodeStructureChanged(parentNode);
            }

            if (i == keyParts.length - 1) {
                DefaultMutableTreeNode valueNode = null;
                for (int j = 0; j < nextNode.getChildCount(); j++) {
                    DefaultMutableTreeNode childNode = (DefaultMutableTreeNode) nextNode.getChildAt(j);
                    KeyValueNode kvNode = (KeyValueNode) childNode.getUserObject();
                    if (kvNode.isValue) {
                        valueNode = childNode;
                        break;
                    }
                }

                if (valueNode == null) {
                    KeyValueNode leafNode = new KeyValueNode(partialKey, value, true);
                    valueNode = new DefaultMutableTreeNode(leafNode);
                    nextNode.add(valueNode);
                    model.nodeStructureChanged(nextNode);
                } else {
                    KeyValueNode leafKvNode = (KeyValueNode) valueNode.getUserObject();
                    leafKvNode.value = value;
                    model.nodeChanged(valueNode);
                }
            }

            parentNode = nextNode;
            if (i < keyParts.length - 1) currentKey.append(".");
        }
    }

//    private void updateNodeRecursive(DefaultMutableTreeNode currentNode, String key, String value, DefaultTreeModel model) {
//
//        // Iterate through the children of the current node
//        for (int i = 0; i < currentNode.getChildCount(); i++) {
//            DefaultMutableTreeNode childNode = (DefaultMutableTreeNode) currentNode.getChildAt(i);
//            KeyValueNode kvNode = (KeyValueNode) childNode.getUserObject();
//
//            // If the current child node matches the target key, update its value
//            if (kvNode.key.equals(key)) {
//
//                DefaultMutableTreeNode leafNode = (DefaultMutableTreeNode) childNode.getChildAt(0); // The actual value node
//
//                if (leafNode != null) {
//                    KeyValueNode leafKvNode = (KeyValueNode) leafNode.getUserObject();
//                    leafKvNode.value = value;  // Update the leaf node value
//                    leafKvNode.isValue = true; // Ensure it's marked as a value node
//
//                    // Reload the updated child node (leaf node)
//                    model.nodeChanged(leafNode); // Only reload the leaf node
//                }
//                break; // Once the leaf node is updated, exit the loop
//            }
//
//            // Recursively check the child nodes if the key isn't found yet
//            updateNodeRecursive(childNode, key, value, model);
//        }
//
//        // If the key was not found, create and add a new node
//
//    }


    private void expandAllRows() {
        for (int i = 0; i < tree.getRowCount(); i++) {
            tree.expandRow(i);
        }
    }

    private void addNodes(DefaultMutableTreeNode parent, XTablesData data, String fullKey) {
        if (data == null) return;

        Map<String, XTablesData> subTables = data.getTablesMap();
        String value = data.getValue();

        // Add value node if it exists
        if (value != null && !value.isEmpty()) {
            KeyValueNode kvNode = new KeyValueNode(fullKey, value, true);
            DefaultMutableTreeNode valueNode = new DefaultMutableTreeNode(kvNode);
            parent.add(valueNode);
        }

        // Add sub-tables recursively
        if (subTables != null && !subTables.isEmpty()) {
            for (Map.Entry<String, XTablesData> entry : subTables.entrySet()) {
                String key = entry.getKey();
                XTablesData subTable = entry.getValue();

                String newFullKey = fullKey.isEmpty() ? key : fullKey + "." + key;
                KeyValueNode kvNode = new KeyValueNode(newFullKey, "", false);
                DefaultMutableTreeNode subTableNode = new DefaultMutableTreeNode(kvNode);
                parent.add(subTableNode);

                // Recursive call for sub-tables
                addNodes(subTableNode, subTable, newFullKey);
            }
        }
    }

    public void onUpdate(KeyValueNode keyValueNode) {
        System.out.println("Full Key: " + keyValueNode.key);
        System.out.println("Updated Value: " + keyValueNode.value);
    }

    /**
     * Helper class for storing key-value pairs in nodes.
     */
    public static class KeyValueNode {
        String key;  // Full key (e.g., "root.subtable.value")
        String value;
        boolean isValue = false;

        public KeyValueNode(String key, String value, boolean isValue) {
            this.key = key;
            this.value = value;
            this.isValue = isValue;
        }

        @Override
        public String toString() {
            if (isValue) {
                return value; // For value nodes, show the value
            } else {
                // Extract the last part of the key (the ending key)
                String[] keyParts = key.split("\\."); // Split by dot
                return keyParts[keyParts.length - 1]; // Return the last part of the key
            }
        }

    }
}
