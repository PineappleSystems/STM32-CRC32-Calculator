// CRC32 calculation function
function calculateCRC32(bytes) {
    const crc32Table = [];
    let crc;

    // Create CRC32 table
    for (let i = 0; i < 256; i++) {
        crc = i;
        for (let j = 8; j > 0; j--) {
            if (crc & 1) {
                crc = (crc >>> 1) ^ 0xedb88320;
            } else {
                crc = crc >>> 1;
            }
        }
        crc32Table[i] = crc;
    }

    crc = 0xffffffff;
    bytes.forEach(byte => {
        crc = crc32Table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    });

    return (crc ^ 0xffffffff) >>> 0;
}

// Convert 32-bit value to little-endian 32-bit value
function toLittleEndian32(value) {
    // Ensure value is unsigned 32-bit
    value = value >>> 0;
    // Extract bytes in little-endian order
    const byte0 = (value >> 0) & 0xFF;
    const byte1 = (value >> 8) & 0xFF;
    const byte2 = (value >> 16) & 0xFF;
    const byte3 = (value >> 24) & 0xFF;
    
    // Reconstruct as little-endian and ensure unsigned
    return ((byte0 << 24) | (byte1 << 16) | (byte2 << 8) | byte3) >>> 0;
}

// Parse HEX string to bytes array
function parseHexToBytes(hexString) {
    // Remove spaces, commas, 0x prefix
    let cleaned = hexString.replace(/0x/gi, '').replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (cleaned === '') {
        return { bytes: [], errors: [] };
    }
    
    // Split by spaces or commas
    let hexValues = cleaned.split(/[\s,]+/);
    let bytes = [];
    let errors = [];
    
    for (let i = 0; i < hexValues.length; i++) {
        let hexValue = hexValues[i];
        // Validate hex string
        if (/^[0-9A-Fa-f]{1,2}$/.test(hexValue)) {
            let byte = parseInt(hexValue, 16);
            bytes.push(byte);
        } else {
            errors.push(hexValue);
        }
    }
    
    return { bytes: bytes, errors: errors };
}

// Format bytes for display
function formatBytes(bytes) {
    return bytes.map(byte => '0x' + byte.toString(16).toUpperCase().padStart(2, '0')).join(', ');
}

// Update UI with results
function updateUI(bytes, errors) {
    const bytesDisplay = document.getElementById("bytes_display");
    const byteCountSpan = document.getElementById("byte_count");
    const byteListDiv = document.getElementById("byte_list");
    const hexInfoDiv = document.getElementById("hex_info");
    const resultDiv = document.getElementById("crc_result");
    const errorDiv = document.getElementById("error_display");
    
    if (bytes.length === 0) {
        bytesDisplay.style.display = "block";
        byteCountSpan.textContent = "0";
        byteListDiv.innerHTML = "<span style='color: #999;'>No valid bytes found</span>";
        hexInfoDiv.innerHTML = "<span style='color: #999;'>No data processed</span>";
        resultDiv.innerHTML = "";
        
        if (errors.length > 0) {
            errorDiv.innerHTML = `<div class="result-box error">⚠️ Invalid hex values found: ${errors.join(', ')}</div>`;
        } else {
            errorDiv.innerHTML = "";
        }
        return;
    }
    
    // Clear any previous errors
    errorDiv.innerHTML = "";
    
    // Show byte information
    bytesDisplay.style.display = "block";
    byteCountSpan.textContent = bytes.length;
    
    // Display the byte list
    const formattedBytes = formatBytes(bytes);
    byteListDiv.innerHTML = formattedBytes;
    
    // Display hex dump information
    const hexString = bytes.map(byte => byte.toString(16).toUpperCase().padStart(2, '0')).join(' ');
    hexInfoDiv.innerHTML = `HEX: ${hexString}`;
    
    // Calculate CRC32
    const crcValue = calculateCRC32(bytes);
    const crcHex = crcValue.toString(16).toUpperCase().padStart(8, '0');
    const crcLittleEndian = toLittleEndian32(crcValue);
    const crcLittleHex = crcLittleEndian.toString(16).toUpperCase().padStart(8, '0');
    
    // Display result
    resultDiv.innerHTML = `
        <div class="result-box">
            <strong>CRC32 Result:</strong><br>
            Decimal: ${crcValue}<br>
            Hexadecimal: 0x${crcHex}<br>
            Expected format for STM32: 0x${crcLittleHex}
        </div>
    `;
    
    // Show any parsing errors (warnings, not critical)
    if (errors.length > 0) {
        errorDiv.innerHTML = `<div class="result-box error">⚠️ Warning: Invalid hex values were ignored: ${errors.join(', ')}</div>`;
    }
}

// Main calculate function
function onCalculateClick() {
    const hexInput = document.getElementById("hex_input").value.trim();
    
    if (!hexInput) {
        document.getElementById("bytes_display").style.display = "none";
        document.getElementById("crc_result").innerHTML = "";
        document.getElementById("error_display").innerHTML = "";
        alert("Please enter a valid hex string.");
        return;
    }
    
    // Parse the input
    const { bytes, errors } = parseHexToBytes(hexInput);
    
    if (bytes.length === 0 && errors.length === 0) {
        alert("No valid hex values found. Please check your input format.");
        return;
    }
    
    // Update UI with results
    updateUI(bytes, errors);
}

// Event listener setup when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate_btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', onCalculateClick);
    }
});