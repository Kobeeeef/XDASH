package org.kobe.xbot.xdashbackend.entities;

public enum Architecture {
    // x86 Architectures
    X86_LINUX("linux/amd64"),           // 64-bit AMD architecture for Linux
    X86_WINDOWS("windows/amd64"),       // 64-bit AMD architecture for Windows
    X86_MACOS("darwin/amd64"),          // 64-bit AMD architecture for macOS

    // ARM Architectures
    ARM64_LINUX("linux/arm64"),         // 64-bit ARM architecture for Linux
    ARM64_WINDOWS("windows/arm64"),     // 64-bit ARM architecture for Windows
    ARM64_MACOS("darwin/arm64"),        // 64-bit ARM architecture for macOS
    ARM_V7_LINUX("linux/arm/v7"),       // 32-bit ARM v7 architecture for Linux
    ARM_V7_WINDOWS("windows/arm/v7"),   // 32-bit ARM v7 architecture for Windows
    ARM_V6_LINUX("linux/arm/v6"),       // 32-bit ARM v6 architecture for Linux

    // Other Architectures
    POWERPC_LINUX("linux/ppc64le"),    // PowerPC 64-bit Little Endian for Linux
    S390X_LINUX("linux/s390x");         // IBM System/390 64-bit architecture for Linux

    private final String buildxPlatform;

    Architecture(String buildxPlatform) {
        this.buildxPlatform = buildxPlatform;
    }

    public String getBuildxPlatform() {
        return buildxPlatform;
    }

    public static Architecture fromUnixCLI(String osResponse, String archResponse) {
        return switch (osResponse.toLowerCase()) {
            case "linux" -> switch (archResponse.toLowerCase()) {
                case "x86_64" -> X86_LINUX;
                case "arm64" -> ARM64_LINUX;
                case "armv7l" -> ARM_V7_LINUX;
                case "armv6l" -> ARM_V6_LINUX;
                case "ppc64le" -> POWERPC_LINUX;
                case "s390x" -> S390X_LINUX;
                default -> throw new IllegalArgumentException("Unsupported architecture for Linux: " + archResponse);
            };
            case "windows" -> switch (archResponse.toLowerCase()) {
                case "x86_64" -> X86_WINDOWS;
                case "arm64" -> ARM64_WINDOWS;
                case "armv7l" -> ARM_V7_WINDOWS;
                default -> throw new IllegalArgumentException("Unsupported architecture for Windows: " + archResponse);
            };
            case "darwin" -> switch (archResponse.toLowerCase()) {
                case "x86_64" -> X86_MACOS;
                case "arm64" -> ARM64_MACOS;
                default -> throw new IllegalArgumentException("Unsupported architecture for macOS: " + archResponse);
            };
            default -> throw new IllegalArgumentException("Unsupported OS: " + osResponse);
        };
    }
    public static Architecture valueOfNull(String name) {
        try {
           return Architecture.valueOf(name);
        } catch (Exception ignored) {
            return null;
        }
    }
}
