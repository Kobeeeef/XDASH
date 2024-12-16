package org.kobe.xbot.xdashbackend.XGRID;



import com.formdev.flatlaf.themes.FlatMacDarkLaf;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.kobe.xbot.Client.XTablesClient;
import org.kobe.xbot.Utilities.ResponseStatus;
import org.kobe.xbot.Utilities.Utilities;
import org.kobe.xbot.Utilities.XTablesData;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.DefaultTreeModel;
import javax.swing.tree.TreeNode;
import java.awt.*;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@SuppressWarnings("ExtractMethodRecommender")
public class XTablesViewer extends JFrame {
    private final JTree treeView;
    private final DefaultMutableTreeNode rootNode;
    public XTablesData cache;
    private ExecutorService threadPool = Executors.newCachedThreadPool();
    private final long cacheFetchCooldown = 5000;
    private boolean isCacheReady = false;
    private final Thread cacheThread;
    private final XTablesClient client;
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private JLabel statusLabel;
    private JButton rebootButton;
    private JButton reloadAllButton;
    public XTablesViewer(XTablesClient client) {
        setTitle("XTables Viewer");
        setSize(1000, 500);
        setExtendedState(JFrame.MAXIMIZED_BOTH); // Fullscreen
        setDefaultCloseOperation(JFrame.HIDE_ON_CLOSE);
        try {
            Image icon = ImageIO.read(Objects.requireNonNull(getClass().getResource("/icon.png")));
            setIconImage(icon);
        } catch (IOException e) {
            System.err.println("Icon image not found.");
        }
        // Root node and tree setup
        rootNode = new DefaultMutableTreeNode();
        treeView = new JTree(rootNode);
        treeView.setRootVisible(false);

        // Create a header for columns
        String[] columnNames = {"Key", "Value"};


        // Set the layout to display both header and tree
        JPanel mainPanel = new JPanel(new BorderLayout());
        mainPanel.add(new JScrollPane(treeView), BorderLayout.CENTER);
        add(mainPanel, BorderLayout.CENTER);

        JPanel controlPanel = createControlPanel();
        add(controlPanel, BorderLayout.SOUTH);
        try {
            UIManager.setLookAndFeel(new FlatMacDarkLaf());
            SwingUtilities.updateComponentTreeUI(this);
        } catch (UnsupportedLookAndFeelException ex) {
            throw new RuntimeException(ex);
        }
        this.client = client;
        cacheThread = new Thread(this::enableCache);
        cacheThread.setDaemon(true);
        cacheThread.start();
    }


    private JPanel createControlPanel() {
        JTextField keyField = new JTextField(15);
        JTextField valueField = new JTextField(15);
        statusLabel = new JLabel();
        statusLabel.setOpaque(true);
        statusLabel.setBackground(Color.WHITE);
        JLabel connectionStatus = new JLabel("Status: " + (client != null ? (client.getSocketClient().isConnected ? "Connected" : "Disconnected") : "Unknown"));
        connectionStatus.setOpaque(true);
        connectionStatus.setBackground((client != null ? client.getSocketClient().isConnected ? Color.GREEN : Color.RED : Color.WHITE));
        Thread thread = getThread(connectionStatus);
        thread.start();
        JButton updateButton = new JButton("Update Value");
        updateButton.addActionListener(e -> {
            String key = keyField.getText().trim();
            String value = valueField.getText().trim();
            if (!key.isEmpty() && Utilities.validateKey(key, false)) {
                try {
                    ResponseStatus status = client.putRaw(key, value).complete();
                    keyField.setText("");
                    valueField.setText("");
                    if (status == ResponseStatus.OK) {
                        statusLabel.setText("Value Updated");
                        statusLabel.setBackground(Color.GREEN);
                    } else {
                        statusLabel.setText("Failed to Update Value");
                        statusLabel.setBackground(Color.RED);
                    }
                } catch (Exception ei) {
                    valueField.setText("");
                    statusLabel.setText(ei.getMessage());
                    statusLabel.setBackground(Color.RED);
                }
            } else {
                statusLabel.setText("Invalid Key");
                statusLabel.setBackground(Color.RED);
            }
        });

        reloadAllButton = new JButton("Reload All");
        reloadAllButton.addActionListener(e -> {
            try {
                String newRawJSON = client.getRawJSON().complete();
                cache.updateFromRawJSON(newRawJSON);
                refreshTree();
                statusLabel.setText("Reloaded All Data");
                statusLabel.setBackground(Color.GREEN);
            } catch (Exception ei) {
                statusLabel.setText(ei.getMessage());
                statusLabel.setBackground(Color.RED);
            }
        });
        rebootButton = new JButton("Reboot");
        rebootButton.setEnabled(false);
        rebootButton.addActionListener(e -> {
            ResponseStatus responseStatus = client.rebootServer().complete();
            if (responseStatus == ResponseStatus.OK) {
                statusLabel.setText("Rebooting Server");
                statusLabel.setBackground(Color.YELLOW);
            } else {
                statusLabel.setText("Failed to Reboot Server");
                statusLabel.setBackground(Color.RED);
            }

        });
        JPanel panel = new JPanel();
        panel.add(statusLabel);
        panel.add(new JLabel("Key:"));
        panel.add(keyField);
        panel.add(new JLabel("Value:"));
        panel.add(valueField);
        panel.add(updateButton);
        panel.add(reloadAllButton);
        panel.add(rebootButton);
        panel.add(connectionStatus);
        return panel;
    }

    private Thread getThread(JLabel connectionStatus) {
        Thread thread = new Thread(() -> {
            while (true) {
                connectionStatus.setText("Status: " + (client != null ? (client.getSocketClient().isConnected ? "Connected" : "Disconnected") : "Unknown"));
                connectionStatus.setBackground((client != null ? client.getSocketClient().isConnected ? Color.GREEN : Color.RED : Color.WHITE));
                if(rebootButton != null) rebootButton.setEnabled(client != null && client.getSocketClient().isConnected);
                if(reloadAllButton != null) reloadAllButton.setEnabled(client != null && client.getSocketClient().isConnected);
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        });
        thread.setDaemon(true);
        return thread;
    }

    private void loadData(String parentKey) {
        rootNode.removeAllChildren(); // Clear existing nodes
        loadNodeData(cache, parentKey, rootNode); // Populate root node
        ((DefaultTreeModel) treeView.getModel()).reload();
    }

    private void loadNodeData(XTablesData data, String parentKey, DefaultMutableTreeNode parentNode) {
        Map<String, XTablesData> entries = data.getTablesMap();
        if (entries != null) {
            for (Map.Entry<String, XTablesData> entry : entries.entrySet()) {
                String key = entry.getKey();
                XTablesData childData = entry.getValue();

                String[] keyParts = key.split("\\.");
                String displayKey = keyParts[keyParts.length - 1];

                DefaultMutableTreeNode childNode = new DefaultMutableTreeNode(displayKey + " : " + childData.getValue());
                parentNode.add(childNode);

                loadNodeData(childData, parentKey.isEmpty() ? key : parentKey + "." + key, childNode);
            }
        }
    }

    private void updateValue(String key, String value) {
        cache.put(key, value);
    }

    private void updateAllFromJSON(String json) {
        cache.updateFromRawJSON(json);
    }

    private void refreshTree() {
        loadData("");
    }

    private void enableCache() {
        try {
            initializeCache();
            if (subscribeToCacheUpdates()) {
                subscribeToZMQUpdates();
                System.out.println("Cache is now setup and ready to use.");
            } else {
                System.out.println("Failed to subscribe to ANY update, NON OK status returned from server.");
            }
        } catch (Exception e) {
            System.out.println("Failed to initialize cache or subscribe to updates. Error:\n" + e.getMessage());
        }
    }

    private boolean subscribeToCacheUpdates() {
        ResponseStatus responseStatus = client.subscribeUpdateEvent((updateEvent) -> {
            cache.put(updateEvent.getKey(), updateEvent.getValue());
            updateSpecificNode(updateEvent.getKey(), updateEvent.getValue());
        }).complete();
        if (responseStatus.equals(ResponseStatus.OK)) System.out.println("Cache is now subscribed for updates.");
        isCacheReady = responseStatus.equals(ResponseStatus.OK);
        return isCacheReady;
    }
    private void subscribeToZMQUpdates() {
        client.getSocketClient().getZMQ_SUB_SOCKET().subscribe("");
        threadPool.execute(() -> {
            while(!Thread.currentThread().isInterrupted()) {
                try {
                    String[] key_value = client.receiveNextZMQ();
                    if(key_value.length == 2) {
                        cache.put(key_value[0], key_value[1]);
                        updateSpecificNode(key_value[0], key_value[1]);
                    }
                } catch (Exception ignored) {}
            }
        });

    }
    private void initializeCache() {
        String rawJSON = client.getRawJSON().complete();
        cache = new XTablesData();
        cache.updateFromRawJSON(rawJSON);
        refreshTree();
    }

    private void updateSpecificNode(String key, String value) {
        DefaultMutableTreeNode currentNode = rootNode;
        String[] keyParts = key.split("\\.");

        for (int i = 0; i < keyParts.length; i++) {
            String part = keyParts[i];
            DefaultMutableTreeNode childNode = findChildNode(currentNode, part);

            if (childNode == null) {
                String displayValue = (i == keyParts.length - 1) ? part + " : " + value : part;
                childNode = new DefaultMutableTreeNode(displayValue);
                currentNode.add(childNode);
                ((DefaultTreeModel) treeView.getModel()).nodeStructureChanged(currentNode);
            }

            currentNode = childNode;
        }

        currentNode.setUserObject(getDisplayKey(key) + " : " + value);
        ((DefaultTreeModel) treeView.getModel()).nodeChanged(currentNode);
    }

    private DefaultMutableTreeNode findChildNode(DefaultMutableTreeNode parent, String keyPart) {
        Enumeration<TreeNode> children = parent.children();
        while (children.hasMoreElements()) {
            DefaultMutableTreeNode child = (DefaultMutableTreeNode) children.nextElement();
            String childKeyPart = child.getUserObject().toString().split(" : ")[0];
            if (childKeyPart.equals(keyPart)) {
                return child;
            }
        }
        return null;
    }

    private String getDisplayKey(String key) {
        String[] parts = key.split("\\.");
        return parts[parts.length - 1];
    }


}

