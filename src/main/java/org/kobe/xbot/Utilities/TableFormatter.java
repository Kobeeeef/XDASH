package org.kobe.xbot.Utilities;

public class TableFormatter {

    /**
     * Creates a formatted table as a string.
     *
     * @param headers Array of column headers.
     * @param data 2D array of table data.
     * @return A string representing the formatted table.
     */
    public static String makeTable(String[] headers, String[][] data) {
        // Calculate column widths
        int[] columnWidths = calculateColumnWidths(headers, data);

        // Build the table
        StringBuilder tableBuilder = new StringBuilder();

        // Add top border
        tableBuilder.append(generateBorder(columnWidths)).append("\n");

        // Add headers
        tableBuilder.append(formatRow(headers, columnWidths)).append("\n");

        // Add separator line
        tableBuilder.append(generateBorder(columnWidths)).append("\n");

        // Add rows
        for (String[] row : data) {
            tableBuilder.append(formatRow(row, columnWidths)).append("\n");
        }

        // Add bottom border
        tableBuilder.append(generateBorder(columnWidths));

        return tableBuilder.toString();
    }

    private static int[] calculateColumnWidths(String[] headers, String[][] data) {
        int numColumns = headers.length;
        int[] columnWidths = new int[numColumns];

        // Initialize column widths with header lengths
        for (int i = 0; i < numColumns; i++) {
            columnWidths[i] = headers[i].length();
        }

        // Adjust column widths based on data
        for (String[] row : data) {
            for (int i = 0; i < row.length; i++) {
                columnWidths[i] = Math.max(columnWidths[i], row[i].length());
            }
        }

        return columnWidths;
    }

    private static String formatRow(String[] row, int[] columnWidths) {
        StringBuilder rowBuilder = new StringBuilder();
        rowBuilder.append("|");
        for (int i = 0; i < row.length; i++) {
            rowBuilder.append(" ").append(String.format("%-" + columnWidths[i] + "s", row[i])).append(" |");
        }
        return rowBuilder.toString();
    }

    private static String generateBorder(int[] columnWidths) {
        StringBuilder borderBuilder = new StringBuilder();
        borderBuilder.append("+");
        for (int width : columnWidths) {
            borderBuilder.append("-".repeat(width + 2)).append("+");
        }
        return borderBuilder.toString();
    }

    public static void main(String[] args) {
        // Example usage
        String[] headers = {"ID", "Name", "Score"};
        String[][] data = {
                {"1", "Alice", "95"},
                {"2", "Bob", "88"},
                {"3", "Charlie", "91"}
        };

        String table = makeTable(headers, data);
        System.out.println(table);
    }
}

