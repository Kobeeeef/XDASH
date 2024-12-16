package org.kobe.xbot.xdashbackend.FileEditor;

import com.formdev.flatlaf.fonts.inter.FlatInterFont;
import com.formdev.flatlaf.fonts.jetbrains_mono.FlatJetBrainsMonoFont;
import com.formdev.flatlaf.themes.FlatMacDarkLaf;
import com.formdev.flatlaf.themes.FlatMacLightLaf;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.Session;
import org.fife.ui.rsyntaxtextarea.SyntaxConstants;
import org.kobe.xbot.xdashbackend.entities.SSHHostAddress;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;
import org.kobe.xbot.xdashbackend.utilities.Utilities;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.io.*;
import java.util.Objects;

public class App extends JFrame {
    private static final XDashLogger logger = XDashLogger.getLogger();
    public EditorView editorView;
    public JPanel toolPanel;
    public JButton closeFileButton;
    public JButton saveButton;
    public JMenuBar menuBar;
    public JMenu settingsMenu, themeItem, colorSchemeItem, languageItem;
    public JMenuItem darkThemeItem, lightThemeItem, monokaiItem, eclipseItem, nightItem, redItem, blueItem, purpleItem,
            javaItem, pythonItem, cItem, jsItem, exitItem;
    public boolean darkTheme = true;
    private final ChannelSftp channelSftp;
    private final String remoteFilePath;
    private final String hostname;
    private final String password;
    public App(ChannelSftp channelSftp, String remoteFilePath, String hostname, String password) {
        this.channelSftp = channelSftp;
        this.remoteFilePath = remoteFilePath;
        this.hostname = hostname;
        this.password = password;
        setSize(900, 800);
        setTitle(String.format("%1$s@%2$s", hostname, remoteFilePath));
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE); // Dispose instead of exiting the process
        setLayout(new BorderLayout());
        setLocationRelativeTo(null);
        try {
            Image icon = ImageIO.read(Objects.requireNonNull(getClass().getResource("/icon.png")));
            setIconImage(icon);
        } catch (IOException e) {
            logger.severe("Icon image not found in file editor.");
        }
        setVisible(true);
        init();
        addComponent();
        setSyntaxForFileExtension(remoteFilePath);
    }
    public void saveFileWithSudo() {
        try {
            // Save edited content to a temporary file
            File tempFile = File.createTempFile("edited_file", ".tmp");
            try (FileWriter writer = new FileWriter(tempFile)) {
                writer.write(editorView.getText());
            }

            // Upload the temporary file to the remote system's /tmp directory
            String tempRemotePath = "/tmp/" + tempFile.getName();
            try (InputStream inputStream = new FileInputStream(tempFile)) {
                channelSftp.put(inputStream, tempRemotePath);
            }

            // Use sudo to move the file to the desired location
            ChannelExec channelExec = (ChannelExec) channelSftp.getSession().openChannel("exec");
            channelExec.setCommand("echo \"" + password + "\" | sudo -S mv " + tempRemotePath + " " + remoteFilePath);
            channelExec.setInputStream(null);
            channelExec.setErrStream(null);

            InputStream execInput = channelExec.getInputStream();
            channelExec.connect();

            BufferedReader reader = new BufferedReader(new InputStreamReader(execInput));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            reader.close();
            channelExec.disconnect();

            if (channelExec.getExitStatus() != 0) {
                JOptionPane.showMessageDialog(null, "Failed to save remote file with sudo. Error: " + output, "Error", JOptionPane.ERROR_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(null, "File saved successfully.", "XDASH Success!", JOptionPane.INFORMATION_MESSAGE);
            }

            // Delete the temporary local file
            tempFile.delete();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Failed to save remote file: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    private void loadRemoteFile() {
        try {
            InputStream inputStream = channelSftp.get(remoteFilePath);
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            StringBuilder content = new StringBuilder();

            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
            editorView.setText(content.toString());
            inputStream.close();

            setSyntaxForFileExtension(remoteFilePath);
        } catch (Exception e) {
            logger.info("Exception in file editor: " + e.getMessage());
        }
    }
    private void setSyntaxForFileExtension(String filePath) {
        String fileExtension = Utilities.getFileExtension(filePath).toLowerCase();
        switch (fileExtension) {
            case "java":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_JAVA);
                break;
            case "py":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_PYTHON);
                break;
            case "cpp":
            case "c", "h":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_C);
                break;
            case "js":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_JAVASCRIPT);
                break;
            case "html":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_HTML);
                break;
            case "css":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_CSS);
                break;
            case "service", "ini", "properties":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_PROPERTIES_FILE);
                break;
            case "xml":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_XML);
                break;
            case "json":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_JSON);
                break;
            case "yaml":
            case "yml":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_YAML);
                break;
            case "md":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_MARKDOWN);
                break;
            case "sh":
            case "bash":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_UNIX_SHELL);
                break;
            case "sql":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_SQL);
                break;
            case "php":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_PHP);
                break;
            case "ruby":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_RUBY);
                break;
            case "go":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_GO);
                break;
            case "rust":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_RUST);
                break;
            case "scala":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_SCALA);
                break;
            case "kotlin":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_KOTLIN);
                break;
            case "pl":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_PERL);
                break;
            case "lua":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_LUA);
                break;
            case "tex":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_LATEX);
                break;
            case "tcl":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_TCL);
                break;
            case "sas":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_SAS);
                break;
            case "zsh":
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_UNIX_SHELL);
                break;
            default:
                editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_NONE);
                break;
        }
    }

    public void init() {
        editorView = new EditorView(this);

        toolPanel = new JPanel();
        toolPanel.setLayout(new FlowLayout(FlowLayout.CENTER));

        saveButton = new JButton("Save");
        closeFileButton = new JButton("Close File");

        saveButton.addActionListener(e -> saveFileWithSudo());
        closeFileButton.addActionListener(e -> close());

        toolPanel.add(saveButton);
        toolPanel.add(closeFileButton);

        menuBar = new JMenuBar();
        settingsMenu = new JMenu("Settings", true);

        themeItem = new JMenu("Theme");
        darkThemeItem = new JMenuItem("Dark");
        lightThemeItem = new JMenuItem("Light");

        colorSchemeItem = new JMenu("Color scheme");
        monokaiItem = new JMenuItem("Monokai");
        eclipseItem = new JMenuItem("Eclipse");
        nightItem = new JMenuItem("Night");
        redItem = new JMenuItem("Reversal Red");
        blueItem = new JMenuItem("Amplified Blue");
        purpleItem = new JMenuItem("Hollow Purple");

        languageItem = new JMenu("Language support");
        javaItem = new JMenuItem("Java");
        pythonItem = new JMenuItem("Python");
        cItem = new JMenuItem("C/C++");
        jsItem = new JMenuItem("Javascript");

        darkThemeItem.addActionListener(e -> {
            try {
                darkTheme = true;
                UIManager.setLookAndFeel(new FlatMacDarkLaf());
                editorView.setColorScheme("Monokai");
                SwingUtilities.updateComponentTreeUI(this);
            } catch (UnsupportedLookAndFeelException ex) {
                throw new RuntimeException(ex);
            }
        });

        lightThemeItem.addActionListener(e -> {
            try {
                darkTheme = false;
                UIManager.setLookAndFeel(new FlatMacLightLaf());
                editorView.setColorScheme("Eclipse");
                SwingUtilities.updateComponentTreeUI(this);
            } catch (UnsupportedLookAndFeelException ex) {
                throw new RuntimeException(ex);
            }
        });

        monokaiItem.addActionListener(e -> editorView.setColorScheme("Monokai"));
        eclipseItem.addActionListener(e -> editorView.setColorScheme("Eclipse"));
        nightItem.addActionListener(e -> editorView.setColorScheme("Night"));
        redItem.addActionListener(e -> editorView.setColorScheme("Red"));
        blueItem.addActionListener(e -> editorView.setColorScheme("Blue"));
        purpleItem.addActionListener(e -> editorView.setColorScheme("Purple"));
        javaItem.addActionListener(e -> editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_JAVA));
        pythonItem.addActionListener(e -> editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_PYTHON));
        cItem.addActionListener(e -> editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_C));
        jsItem.addActionListener(e -> editorView.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_JAVASCRIPT));

        exitItem = new JMenuItem("Close File");
        exitItem.addActionListener(e -> {
           close();
        });
        loadRemoteFile();
        toFront();
        setAlwaysOnTop(true);
        setAlwaysOnTop(false);
    }
    private void close() {
        try {
            if (channelSftp != null && channelSftp.isConnected()) {
                channelSftp.disconnect();
                logger.info(String.format("Closed channel on file editor: %1$s%2$s", hostname, remoteFilePath));
            }
            dispose();
        } catch (Exception ec) {
            logger.severe("Failed to close connection: " + ec.getMessage());
            JOptionPane.showMessageDialog(null, "Failed to close connection: " + ec.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    public void addComponent() {
        menuBar.add(settingsMenu);
        settingsMenu.add(themeItem);
        settingsMenu.add(colorSchemeItem);
        settingsMenu.addSeparator();
        settingsMenu.add(languageItem);
        settingsMenu.addSeparator();

        themeItem.add(darkThemeItem);
        themeItem.add(lightThemeItem);

        colorSchemeItem.add(monokaiItem);
        colorSchemeItem.add(eclipseItem);
        colorSchemeItem.add(nightItem);
        colorSchemeItem.add(redItem);
        colorSchemeItem.add(blueItem);
        colorSchemeItem.add(purpleItem);

        languageItem.add(javaItem);
        languageItem.add(pythonItem);
        languageItem.add(cItem);
        languageItem.add(jsItem);

        settingsMenu.add(exitItem);

        this.add(toolPanel, BorderLayout.NORTH);
        this.add(editorView.getContentPanel(), BorderLayout.CENTER);
        setJMenuBar(menuBar);

        revalidate();
        repaint();

        setVisible(true);
    }
    public static void openRemoteFileEditor(SSHHostAddress sshHostAddress, String remoteFilePath) {
        Session session = sshHostAddress.getSession();
        FlatMacDarkLaf.setup();
        FlatJetBrainsMonoFont.install();
        FlatInterFont.install();
        if (session == null || !session.isConnected()) {
            throw new RuntimeException("This session is not connected.");
        }
        UIManager.put("defaultFont", new Font(FlatInterFont.FAMILY, Font.PLAIN, 13));
        SwingUtilities.invokeLater(() -> {
            try {
                if (session == null || !session.isConnected()) {
                    logger.severe("This session is not connected.");
                     return;
                }
                ChannelSftp channelSftp = (ChannelSftp) session.openChannel("sftp");
                channelSftp.connect();
                new App(channelSftp, remoteFilePath, sshHostAddress.getHostname(), sshHostAddress.getPassword());
            } catch (Exception e) {
                logger.severe("Failed to open remote file editor: " + e.getMessage());
                JOptionPane.showMessageDialog(null, "Failed to open remote file editor: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
    }
}
