    package org.kobe.xbot.xdashbackend.XGRID;

    import javax.swing.*;
    import java.awt.*;
    import java.awt.event.ActionEvent;
    import java.awt.event.ActionListener;

    public class SwingNotification {
        public static void showNotification(JFrame parent, String message, int duration) {
            JWindow window = new JWindow(parent); // Attach to the main JFrame
            window.setLayout(new BorderLayout());

            JLabel label = new JLabel(message, SwingConstants.CENTER);
            label.setFont(new Font("Arial", Font.BOLD, 14));
            label.setOpaque(true);
            label.setBackground(new Color(50, 50, 50));
            label.setForeground(Color.WHITE);
            label.setBorder(BorderFactory.createLineBorder(Color.BLACK, 1));

            window.add(label, BorderLayout.CENTER);
            window.setSize(250, 50);

            // Position in the top-right of the parent JFrame
            Point location = parent.getLocationOnScreen();
            int x = location.x + parent.getWidth() - window.getWidth() - 10;
            int y = location.y + 10; // Adjust for padding from the top
            window.setLocation(x, y);

            window.setAlwaysOnTop(true);
            window.setVisible(true);

            // Auto-close after 'duration' milliseconds
            Timer timer = new Timer(duration, new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    window.setVisible(false);
                    window.dispose();
                }
            });

            timer.setRepeats(false);
            timer.start();
        }

    }

