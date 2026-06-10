# STM32 CRC32 Calculator

A lightweight, client-side CRC32 calculator web tool designed specifically for STM32 developers and embedded systems engineers. Calculate CRC32 checksums for hexadecimal data using the standard IEEE 802.3 algorithm compatible with STM32 hardware CRC unit.

**Live Demo:** https://jsaundersis.github.io/STM32-CRC32-Calculator/

## 🎯 Features

- **Multiple Input Formats** - Supports C-style arrays, space-separated, comma-separated, or mixed formats
- **Real-time Byte Recognition** - Displays exactly which bytes are being processed
- **STM32 Compatible** - Uses CRC32 IEEE 802.3 algorithm (polynomial 0x04C11DB7)
- **Client-side Only** - No data sent to server, all calculations performed locally
- **Responsive Design** - Works on desktop and mobile devices
- **Error Handling** - Validates input and shows warnings for invalid hex values

## 📋 Algorithm Specifications

| Parameter | Value |
|-----------|-------|
| Algorithm | CRC32 IEEE 802.3 |
| Polynomial | 0x04C11DB7 (0xEDB88320 reversed) |
| Initial Value | 0xFFFFFFFF |
| Final XOR | 0xFFFFFFFF |
| Input Reflection | Yes |
| Output Reflection | Yes |
| Compatible With | STM32 hardware CRC, WinRAR, PNG, Ethernet |

## 💻 Installation

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/PineappleSystems/crc32-calculator.git
cd crc32-calculator
```
2. Open index.html in your web browser
