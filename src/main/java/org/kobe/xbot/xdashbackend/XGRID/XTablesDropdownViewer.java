package org.kobe.xbot.xdashbackend.XGRID;

import com.formdev.flatlaf.fonts.jetbrains_mono.FlatJetBrainsMonoFont;
import org.kobe.xbot.JClient.XTablesClient;
import org.kobe.xbot.Utilities.Entities.XTableProto;
import org.kobe.xbot.Utilities.Utilities;
import org.kobe.xbot.Utilities.XTablesByteUtils;
import org.kobe.xbot.Utilities.XTablesData;

import javax.swing.*;
import javax.swing.event.CellEditorListener;
import javax.swing.event.ChangeEvent;
import javax.swing.plaf.basic.BasicScrollBarUI;
import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.DefaultTreeCellEditor;
import javax.swing.tree.DefaultTreeCellRenderer;
import javax.swing.tree.DefaultTreeModel;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.Arrays;
import java.util.EventObject;
import java.util.Map;

public class XTablesDropdownViewer extends JPanel {
    private final XTablesData cache;
    private final JTree tree;
    private Font treeFont;
    private final XTablesClient client;

    public XTablesDropdownViewer(JFrame parent, XTablesClient client, XTablesData cache) {
        this.cache = cache;
        this.client = client;
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
                    Object userObject = editedNode.getUserObject();
                    String key = null;

                    if (userObject instanceof KeyValueNode kvNode) {
                        key = kvNode.key.trim();
                    } else {
                        // Try to retrieve the key from the parent node
                        DefaultMutableTreeNode parentNode = (DefaultMutableTreeNode) editedNode.getParent();
                        if (parentNode != null && parentNode.getUserObject() instanceof KeyValueNode parentKvNode) {
                            key = parentKvNode.key.trim();
                        }
                    }

                    if (key != null) {
                        // If a key is found, update with the new value
                        String value = tree.getCellEditor().getCellEditorValue().toString().trim();
                        onUpdate(key, value); // Pass the full key and updated value
                    }
                }
                populateTable(); // Refresh the tree view
            }

            @Override
            public void editingCanceled(ChangeEvent e) {
                // Handle cancel case if necessary
            }
        });


        JScrollPane scrollPane = new JScrollPane(tree);
        scrollPane.getVerticalScrollBar().setUI(new BasicScrollBarUI());  // Ensure proper UI setup
        scrollPane.getHorizontalScrollBar().setUI(new BasicScrollBarUI());
        JScrollBar vScrollBar = scrollPane.getVerticalScrollBar();

        add(scrollPane, BorderLayout.CENTER);

        tree.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {

                if (e.isControlDown()) {
                    if (e.getKeyCode() == KeyEvent.VK_PLUS || e.getKeyCode() == KeyEvent.VK_EQUALS) {
                        deriveFont(1);
                    } else if (e.getKeyCode() == KeyEvent.VK_MINUS) {
                        deriveFont(-1);
                    } else if (e.getKeyCode() == KeyEvent.VK_R) {
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
        if (newSize < 8 || newSize > 72) return;
        treeFont = treeFont.deriveFont(newSize);
        tree.setFont(treeFont);
    }

    public void populateTable() {
        DefaultMutableTreeNode root = new DefaultMutableTreeNode();

        // Recursively populate tree
        addNodes(root, cache, "");

        DefaultTreeModel model = (DefaultTreeModel) tree.getModel();
        model.setRoot(root);

        tree.setRootVisible(false);
        tree.setShowsRootHandles(true);
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


    private void expandAllRows() {
        for (int i = 0; i < tree.getRowCount(); i++) {
            tree.expandRow(i);
        }
    }

    private void addNodes(DefaultMutableTreeNode parent, XTablesData data, String fullKey) {

        if (data == null) return;
        Map<String, XTablesData> subTables = data.getTablesMap();

        String value = null;
        if(data.getType() != null && data.getValue() != null) {
            value = XTablesByteUtils.convertTypeValueToJsonString(data.getType(), data.getValue());
        }
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

    public void onUpdate(String key, String value) {
        if (!key.isEmpty() && Utilities.validateKey(key, false)) {
            try {
                try {
                    Map.Entry entry = XTablesByteUtils.convertJsonStringToTypeValue(value);
                    XTableProto.XTableMessage.Type type = (XTableProto.XTableMessage.Type) entry.getKey();
                    byte[] bytes = (byte[]) entry.getValue();
                    boolean success = client.putTypedBytes(key, type, bytes);
                    if (!success) {
                        JOptionPane.showMessageDialog(null, "NON-OK Status returned: " + success, "Error", JOptionPane.ERROR_MESSAGE);
                    }
                } catch (Exception err) {
                    JOptionPane.showMessageDialog(null, "Exception while updating value: " + err.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);

                }


            } catch (Exception ei) {
                JOptionPane.showMessageDialog(null, "Exception while updating value: " + ei.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        } else {
            JOptionPane.showMessageDialog(null, "This key is invalid.", "Error", JOptionPane.ERROR_MESSAGE);
        }
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
