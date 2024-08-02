package org.kobe.xbot.xdashbackend.entities;

public enum ControlCharacter {
    TAB('\t'),
    CTRL_A('\u0001'),      // Start of heading
    CTRL_B('\u0002'),      // Start of text
    CTRL_C('\u0003'),      // End of text (interrupt)
    CTRL_D('\u0004'),      // End of transmission
    CTRL_E('\u0005'),      // Enquiry
    CTRL_F('\u0006'),      // Acknowledge
    CTRL_G('\u0007'),      // Bell
    CTRL_H('\u0008'),      // Backspace
    CTRL_I('\u0009'),      // Horizontal tab
    CTRL_J('\n'),          // Line feed (newline)
    CTRL_K('\u000B'),      // Vertical tab
    CTRL_L('\u000C'),      // Form feed
    CTRL_M('\r'),          // Carriage return
    CTRL_N('\u000E'),      // Shift out
    CTRL_O('\u000F'),      // Shift in
    CTRL_P('\u0010'),      // Data link escape
    CTRL_Q('\u0011'),      // Device control 1 (XON)
    CTRL_R('\u0012'),      // Device control 2
    CTRL_S('\u0013'),      // Device control 3 (XOFF)
    CTRL_T('\u0014'),      // Device control 4
    CTRL_U('\u0015'),      // Negative acknowledge
    CTRL_V('\u0016'),      // Synchronous idle
    CTRL_W('\u0017'),      // End of transmission block
    CTRL_X('\u0018'),      // Cancel
    CTRL_Y('\u0019'),      // End of medium
    CTRL_Z('\u001A'),      // Substitute
    ESCAPE('\u001B'),      // Escape
    DELETE('\u007F'),      // Delete
    CTRL_BACKSLASH('\u001C'), // File separator
    CTRL_LEFTBRACKET('\u001B'), // Escape
    CTRL_RIGHTBRACKET('\u001D'), // Group separator
    CTRL_CARET('\u001E'),      // Record separator
    CTRL_UNDERSCORE('\u001F'); // Unit separator

    private final char character;

    ControlCharacter(char character) {
        this.character = character;
    }

    public char getCharacter() {
        return character;
    }
}

